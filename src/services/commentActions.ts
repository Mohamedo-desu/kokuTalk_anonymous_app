import { COMMENT_STORED_KEYS } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import { COMMENTPROPS, CONFESSIONPROPS, REPLYPROPS } from '@/types'
import { db } from '@/utils/firebase'
import { deleteStoredValues, getStoredValues } from '@/utils/storageUtils'
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	QueryDocumentSnapshot,
	setDoc,
	startAfter,
	where,
	writeBatch,
} from 'firebase/firestore'
import { Dispatch, SetStateAction } from 'react'
import { getUserDataFromFirestore } from './authActions'

export const updateCommentLikesAndDislikes = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser?.id

		if (!userId) {
			return
		}

		const storedKeys = [
			COMMENT_STORED_KEYS.COMMENTS_TO_LIKE,
			COMMENT_STORED_KEYS.COMMENTS_TO_DISLIKE,
			COMMENT_STORED_KEYS.COMMENTS_TO_UNLIKE,
			COMMENT_STORED_KEYS.COMMENTS_TO_UNDISLIKE,
		]

		const storedValues = await getStoredValues(storedKeys)

		const {
			[COMMENT_STORED_KEYS.COMMENTS_TO_LIKE]: commentsToLike,
			[COMMENT_STORED_KEYS.COMMENTS_TO_DISLIKE]: commentsToDislike,
			[COMMENT_STORED_KEYS.COMMENTS_TO_UNLIKE]: commentsToUnlike,
			[COMMENT_STORED_KEYS.COMMENTS_TO_UNDISLIKE]: commentsToUndislike,
		} = storedValues

		const toLike = commentsToLike ? JSON.parse(commentsToLike) : []
		const toDislike = commentsToDislike ? JSON.parse(commentsToDislike) : []
		const toUnlike = commentsToUnlike ? JSON.parse(commentsToUnlike) : []
		const toUndislike = commentsToUndislike ? JSON.parse(commentsToUndislike) : []

		if (
			toLike.length === 0 &&
			toDislike.length === 0 &&
			toUnlike.length === 0 &&
			toUndislike.length === 0
		) {
			return
		}

		const commentsRef = collection(db, 'comments')

		// Delete stored values after fetching them
		await deleteStoredValues(storedKeys)

		const batch = writeBatch(db)

		const updateComments = (comments: string[], dislikes: boolean, remove: boolean) => {
			comments.forEach((commentId: string) => {
				const commentRef = doc(commentsRef, commentId)
				batch.update(commentRef, {
					[dislikes ? 'dislikes' : 'likes']: remove ? arrayRemove(userId) : arrayUnion(userId),
					[dislikes ? 'likes' : 'dislikes']: arrayRemove(userId),
				})
			})
		}

		// Update comments with the respective actions
		updateComments(toLike, false, false)
		updateComments(toDislike, true, false)
		updateComments(toUnlike, false, true)
		updateComments(toUndislike, true, true)

		// Commit the batch operation
		await batch.commit()
	} catch (error: any) {
		console.error('Error updating likes and dislikes:', error)
		throw new Error(error.message || 'An error occurred while updating likes and dislikes comments')
	}
}
export const uploadComment = async (commentBody: COMMENTPROPS) => {
	try {
		const batch = writeBatch(db)

		const commentCollectionRef = collection(db, 'comments')

		const commentRef = await addDoc(commentCollectionRef, {})
		const commentId = commentRef.id

		await setDoc(commentRef, {
			...commentBody,
			id: commentId,
			created_at: new Date().toISOString(),
		})

		if (commentBody.confession_id) {
			const confessionDocRef = doc(db, 'comments', commentBody.confession_id)
			batch.update(confessionDocRef, { comments: arrayUnion(commentId) })
		}
		if (commentBody.commented_by) {
			const userDocRef = doc(db, 'users', commentBody.commented_by)
			batch.update(userDocRef, { comments: arrayUnion(commentId) })
		}

		await batch.commit()

		return commentId
	} catch (error: any) {
		throw new Error(error.message || 'Failed to add comment')
	}
}

export const fetchCommentReplies = async ({
	commentsReplies,
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
	setNoMoreDocuments,
}: {
	commentsReplies: string[] | undefined
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
	setNoMoreDocuments: Dispatch<SetStateAction<boolean>>
}) => {
	try {
		if (!commentsReplies || commentsReplies.length === 0) {
			return []
		}

		const repliesRef = collection(db, 'replies')

		let q

		if (lastDocumentFetched) {
			q = query(
				repliesRef,
				where('id', 'in', commentsReplies),
				orderBy('created_at', 'desc'),
				startAfter(lastDocumentFetched),
				limit(fetchLimit),
			)
		} else {
			q = query(
				repliesRef,
				where('id', 'in', commentsReplies),
				orderBy('created_at', 'desc'),
				limit(fetchLimit),
			)
		}

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			setNoMoreDocuments(true)

			return []
		}

		const replies = await Promise.all(
			querySnapshot.docs.map(async (confessDoc) => {
				const reply = confessDoc.data() as REPLYPROPS

				if (reply.replied_by) {
					const userDoc = await getUserDataFromFirestore(reply.replied_by)

					reply.user = userDoc as CONFESSIONPROPS['user']
				}

				return reply
			}) as Promise<REPLYPROPS>[],
		)

		setLastDocumentFetched(querySnapshot.docs[querySnapshot.docs.length - 1])

		return replies
	} catch (error) {
		console.log(error)

		throw new Error('An error occurred while fetching the replies')
	}
}