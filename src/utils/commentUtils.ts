import { COMMENT_STORED_KEYS } from '@/constants/appDetails'
import { uploadComment } from '@/services/commentActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { Dispatch, SetStateAction } from 'react'
import { Toast } from 'react-native-toast-notifications'
import { getStoredValues, saveSecurely } from './storageUtils'

export const addComment = async ({
	id,
	newComment,
	setComments,
	setNewComment,
	setLoading,
	loading,
}: {
	id: string
	newComment: string
	setComments: Dispatch<SetStateAction<number>>
	setNewComment: Dispatch<SetStateAction<string>>
	setLoading: Dispatch<SetStateAction<boolean>>
	loading: boolean
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (loading) return
		setLoading(true)

		await uploadComment({
			id: '',
			created_at: '',
			comment_text: newComment,
			confession_id: id,
			commented_by: userId,
			replies: [],
			likes: [],
			dislikes: [],
		})

		setComments((prev) => prev + 1)
		setNewComment('')

		setLoading(false)
		Toast.show('success', {
			type: 'success',
		})
	} catch (error) {
		setLoading(false)
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}

export const likeComment = async ({
	id,
	likes,
	dislikes,
	setLikes,
	setdisLikes,
	itemLikes,
}: {
	id: string
	likes: string[]
	dislikes: string[]
	setLikes: Dispatch<SetStateAction<string[]>>
	setdisLikes: Dispatch<SetStateAction<string[]>>
	itemLikes: string[]
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		const updatedLikes = likes.includes(userId)
			? likes.filter((like) => like !== userId)
			: [...likes, userId]
		const updatedDislikes = dislikes.includes(userId)
			? dislikes.filter((dislike) => dislike !== userId)
			: dislikes

		const storedValues = await getStoredValues([
			COMMENT_STORED_KEYS.COMMENTS_TO_DISLIKE,
			COMMENT_STORED_KEYS.COMMENTS_TO_LIKE,
		])

		let commentsTodisLike = JSON.parse(storedValues.commentsTodisLike || '[]')
		let commentsToUndislike = JSON.parse(storedValues.commentsToUndislike || '[]')
		let commentsToLike = JSON.parse(storedValues.commentsToLike || '[]')
		let commentsToUnlike = JSON.parse(storedValues.commentsToUnlike || '[]')

		commentsTodisLike = commentsTodisLike.filter((postId: string) => postId !== id)
		commentsToUndislike = commentsToUndislike.filter((postId: string) => postId !== id)

		if (updatedLikes.includes(userId)) {
			if (!itemLikes.includes(userId)) {
				commentsToLike = [...commentsToLike, id]
			}
			commentsToUnlike = commentsToUnlike.filter((postId: string) => postId !== id)
		} else {
			commentsToLike = commentsToLike.filter((postId: string) => postId !== id)
			if (itemLikes.includes(userId)) {
				commentsToUnlike = [...commentsToUnlike, id]
			}
		}

		await saveSecurely([
			{ key: COMMENT_STORED_KEYS.COMMENTS_TO_LIKE, value: JSON.stringify(commentsToLike) },
			{ key: COMMENT_STORED_KEYS.COMMENTS_TO_DISLIKE, value: JSON.stringify(commentsTodisLike) },
			{ key: COMMENT_STORED_KEYS.COMMENTS_TO_UNLIKE, value: JSON.stringify(commentsToUnlike) },
			{
				key: COMMENT_STORED_KEYS.COMMENTS_TO_UNDISLIKE,
				value: JSON.stringify(commentsToUndislike),
			},
		])

		setLikes(updatedLikes)
		setdisLikes(updatedDislikes)
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
export const disLikeComment = async ({
	id,
	likes,
	dislikes,
	setLikes,
	setdisLikes,
	itemDisLikes,
}: {
	id: string
	likes: string[]
	dislikes: string[]
	setLikes: Dispatch<SetStateAction<string[]>>
	setdisLikes: Dispatch<SetStateAction<string[]>>
	itemDisLikes: string[]
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		const updatedDislikes = dislikes.includes(userId)
			? dislikes.filter((dislike) => dislike !== userId)
			: [...dislikes, userId]

		const updatedLikes = likes.includes(userId) ? likes.filter((like) => like !== userId) : likes

		const storedValues = await getStoredValues([
			COMMENT_STORED_KEYS.COMMENTS_TO_DISLIKE,
			COMMENT_STORED_KEYS.COMMENTS_TO_LIKE,
		])
		let commentsTodisLike = JSON.parse(storedValues.commentsTodisLike || '[]')
		let commentsToUndislike = JSON.parse(storedValues.commentsToUndislike || '[]')
		let commentsToLike = JSON.parse(storedValues.commentsToLike || '[]')
		let commentsToUnlike = JSON.parse(storedValues.commentsToUnlike || '[]')

		commentsToLike = commentsToLike.filter((postId: string) => postId !== id)
		commentsToUnlike = commentsToUnlike.filter((postId: string) => postId !== id)

		if (updatedDislikes.includes(userId)) {
			if (!itemDisLikes.includes(userId)) {
				commentsTodisLike = [...commentsTodisLike, id]
			}
			commentsToUndislike = commentsToUndislike.filter((postId: string) => postId !== id)
		} else {
			commentsTodisLike = commentsTodisLike.filter((postId: string) => postId !== id)
			if (itemDisLikes.includes(userId)) {
				commentsToUndislike = [...commentsToUndislike, id]
			}
		}

		await saveSecurely([
			{ key: COMMENT_STORED_KEYS.COMMENTS_TO_LIKE, value: JSON.stringify(commentsToLike) },
			{ key: COMMENT_STORED_KEYS.COMMENTS_TO_DISLIKE, value: JSON.stringify(commentsTodisLike) },
			{ key: COMMENT_STORED_KEYS.COMMENTS_TO_UNLIKE, value: JSON.stringify(commentsToUnlike) },
			{
				key: COMMENT_STORED_KEYS.COMMENTS_TO_UNDISLIKE,
				value: JSON.stringify(commentsToUndislike),
			},
		])

		setLikes(updatedLikes)
		setdisLikes(updatedDislikes)
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
