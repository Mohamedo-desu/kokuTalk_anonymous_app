import { REPLY_STORED_KEYS } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import { REPLYPROPS } from '@/types'
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
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return
		}

		const [
			{ [REPLY_STORED_KEYS.REPLIES_TO_LIKE]: repliesToLike },
			{ [REPLY_STORED_KEYS.REPLIES_TO_DISLIKE]: repliesToDislike },
			{ [REPLY_STORED_KEYS.REPLIES_TO_UNLIKE]: repliesToUnlike },
			{ [REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE]: repliesToUndislike },
		] = await Promise.all([
			getStoredValues([REPLY_STORED_KEYS.REPLIES_TO_LIKE]),
			getStoredValues([REPLY_STORED_KEYS.REPLIES_TO_DISLIKE]),
			getStoredValues([REPLY_STORED_KEYS.REPLIES_TO_UNLIKE]),
			getStoredValues([REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE]),
		])

		const toLike = repliesToLike ? JSON.parse(repliesToLike) : []
		const toDislike = repliesToDislike ? JSON.parse(repliesToDislike) : []
		const toUnlike = repliesToUnlike ? JSON.parse(repliesToUnlike) : []
		const toUndislike = repliesToUndislike ? JSON.parse(repliesToUndislike) : []

		if (
			toLike.length === 0 &&
			toDislike.length === 0 &&
			toUnlike.length === 0 &&
			toUndislike.length === 0
		) {
			return
		}

		const repliesRef = collection(db, 'replies')

		await deleteStoredValues([
			REPLY_STORED_KEYS.REPLIES_TO_LIKE,
			REPLY_STORED_KEYS.REPLIES_TO_DISLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE,
		])

		const batch = writeBatch(db)

		const updateReplies = (replies: string[], dislikes: boolean, remove: boolean) => {
			replies.forEach((replyId: string) => {
				const replyRef = doc(repliesRef, replyId)
				batch.update(replyRef, {
					[dislikes ? 'dislikes' : 'likes']: remove ? arrayRemove(userId) : arrayUnion(userId),
					[dislikes ? 'likes' : 'dislikes']: arrayRemove(userId),
				})
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