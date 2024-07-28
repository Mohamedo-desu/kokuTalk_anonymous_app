import { REPLY_STORED_KEYS } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import { REPLYPROPS, REPORTPROPS } from '@/types'
import { db } from '@/utils/firebase'
import { deleteStoredValues, getStoredValues } from '@/utils/storageUtils'
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	setDoc,
	writeBatch,
} from 'firebase/firestore'
import { sendPushNotifications } from './userActions'

export const uploadReply = async (replyBody: REPLYPROPS) => {
	try {
		if (!replyBody) return
		const batch = writeBatch(db)

		const replyCollectionRef = collection(db, 'replies')

		const replyRef = await addDoc(replyCollectionRef, {})
		const replyId = replyRef.id

		await setDoc(replyRef, {
			...replyBody,
			id: replyId,
			created_at: new Date().toISOString(),
		})

		if (replyBody.comment_id) {
			const commentDocRef = doc(db, 'comments', replyBody.comment_id)
			batch.update(commentDocRef, { replies: arrayUnion(replyId) })
		}
		if (replyBody.replied_by) {
			const userDocRef = doc(db, 'users', replyBody.replied_by)
			batch.update(userDocRef, { replies: arrayUnion(replyId) })
		}

		await batch.commit()

		return replyId
	} catch (error: any) {
		throw new Error(error.message || 'Failed to add comment')
	}
}

export const updateReplyLikesAndDislikes = async () => {
	try {
		const { id: userId, pushTokens: currentUserPushTokens } =
			useAuthStoreSelectors.getState().currentUser

		if (!userId) {
			return
		}

		const storedKeys = [
			REPLY_STORED_KEYS.REPLIES_TO_LIKE,
			REPLY_STORED_KEYS.REPLIES_TO_DISLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE,
			REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY,
		]

		const storedValues = await getStoredValues(storedKeys)

		const {
			[REPLY_STORED_KEYS.REPLIES_TO_LIKE]: repliesToLike,
			[REPLY_STORED_KEYS.REPLIES_TO_DISLIKE]: repliesToDislike,
			[REPLY_STORED_KEYS.REPLIES_TO_UNLIKE]: repliesToUnlike,
			[REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE]: repliesToUndislike,
			[REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY]: pushTokensToNotify,
		} = storedValues

		const toLike = repliesToLike ? JSON.parse(repliesToLike) : []
		const toDislike = repliesToDislike ? JSON.parse(repliesToDislike) : []
		const toUnlike = repliesToUnlike ? JSON.parse(repliesToUnlike) : []
		const toUndislike = repliesToUndislike ? JSON.parse(repliesToUndislike) : []
		const tokensToNotify = pushTokensToNotify ? JSON.parse(pushTokensToNotify) : []

		if (
			toLike.length === 0 &&
			toDislike.length === 0 &&
			toUnlike.length === 0 &&
			toUndislike.length === 0
		) {
			return
		}

		const repliesRef = collection(db, 'replies')

		await deleteStoredValues(storedKeys)

		const batch = writeBatch(db)

		const updateReplies = (replies: string[], dislikes: boolean, remove: boolean) => {
			replies.forEach((replyId: string) => {
				const replyRef = doc(repliesRef, replyId)
				batch.update(replyRef, {
					[dislikes ? 'dislikes' : 'likes']: remove ? arrayRemove(userId) : arrayUnion(userId),
					[dislikes ? 'likes' : 'dislikes']: arrayRemove(userId),
				})
				if (!remove && !dislikes) {
					const tokenObj = tokensToNotify.find((tokenObj: any) => tokenObj.replyId === replyId)
					if (tokenObj && tokenObj.pushTokens) {
						tokenObj.pushTokens.forEach((pushToken: string) => {
							if (!currentUserPushTokens.includes(pushToken)) {
								sendPushNotifications(
									pushToken,
									'Your reply got a new like!',
									'Someone liked your reply.',
									{ replyId },
								)
							}
						})
					}
				}
			})
		}

		updateReplies(toLike, false, false)
		updateReplies(toDislike, true, false)
		updateReplies(toUnlike, false, true)
		updateReplies(toUndislike, true, true)

		await batch.commit()
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating likes and dislikes replies')
	}
}

export const deleteAReply = async ({
	commentId,
	replyId,
	repliedById,
}: {
	commentId: string
	replyId: string
	repliedById: string
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId || !replyId || !repliedById) {
			return
		}

		if (userId !== repliedById) {
			throw new Error('Unauthorized to delete this reply')
		}

		const batch = writeBatch(db)

		const replyRef = doc(db, 'replies', replyId)

		batch.delete(replyRef)

		const commentDocRef = doc(db, 'comments', commentId)
		batch.update(commentDocRef, {
			replies: arrayRemove(replyId),
		})

		const userDocRef = doc(db, 'users', userId)
		batch.update(userDocRef, {
			replies: arrayRemove(replyId),
		})

		await batch.commit()
	} catch (error: any) {
		throw new Error(error.message || 'Failed to delete reply')
	}
}

export const reportAReply = async ({
	replyId,
	report_reason,
	reported_by,
}: {
	replyId: string
	report_reason: REPORTPROPS['report_reason']
	reported_by: string
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId || !replyId) {
			throw new Error('User ID or Comment ID is missing')
		}

		const batch = writeBatch(db)

		const reportsRef = doc(db, 'reply_reports', replyId)
		const collectionDocRef = doc(db, 'replies', replyId)

		await setDoc(
			reportsRef,
			{
				reports: arrayUnion({
					reply_id: replyId,
					report_reason,
					reported_by,
					reported_at: new Date().toISOString(),
				}),
			},
			{ merge: true },
		)

		batch.update(collectionDocRef, {
			reports: arrayUnion(reported_by),
		})

		await batch.commit()
	} catch (error: any) {
		console.error('Error reporting reply: ', error)
		throw new Error(error.message || 'Failed to report reply')
	}
}
