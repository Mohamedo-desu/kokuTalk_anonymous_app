import { uploadComment } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { Dispatch, SetStateAction } from 'react'
import { Share } from 'react-native'
import { Toast } from 'react-native-toast-notifications'
import { getStoredValues, saveSecurely } from './storageUtils'

export const likeConfession = async ({
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

		const storedValues = await getStoredValues(['postsTodisLike', 'postsToLike'])

		let postsTodisLike = JSON.parse(storedValues.postsTodisLike || '[]')
		let postsToUndislike = JSON.parse(storedValues.postsToUndislike || '[]')
		let postsToLike = JSON.parse(storedValues.postsToLike || '[]')
		let postsToUnlike = JSON.parse(storedValues.postsToUnlike || '[]')

		postsTodisLike = postsTodisLike.filter((postId: string) => postId !== id)
		postsToUndislike = postsToUndislike.filter((postId: string) => postId !== id)

		if (updatedLikes.includes(userId)) {
			if (!itemLikes.includes(userId)) {
				postsToLike = [...postsToLike, id]
			}
			postsToUnlike = postsToUnlike.filter((postId: string) => postId !== id)
		} else {
			postsToLike = postsToLike.filter((postId: string) => postId !== id)
			if (itemLikes.includes(userId)) {
				postsToUnlike = [...postsToUnlike, id]
			}
		}

		await saveSecurely([
			{ key: 'postsToLike', value: JSON.stringify(postsToLike) },
			{ key: 'postsTodisLike', value: JSON.stringify(postsTodisLike) },
			{ key: 'postsToUnlike', value: JSON.stringify(postsToUnlike) },
			{ key: 'postsToUndislike', value: JSON.stringify(postsToUndislike) },
		])

		setLikes(updatedLikes)
		setdisLikes(updatedDislikes)
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
export const disLikeConfession = async ({
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

		const storedValues = await getStoredValues(['postsTodisLike', 'postsToLike'])
		let postsTodisLike = JSON.parse(storedValues.postsTodisLike || '[]')
		let postsToUndislike = JSON.parse(storedValues.postsToUndislike || '[]')
		let postsToLike = JSON.parse(storedValues.postsToLike || '[]')
		let postsToUnlike = JSON.parse(storedValues.postsToUnlike || '[]')

		postsToLike = postsToLike.filter((postId: string) => postId !== id)
		postsToUnlike = postsToUnlike.filter((postId: string) => postId !== id)

		if (updatedDislikes.includes(userId)) {
			if (!itemDisLikes.includes(userId)) {
				postsTodisLike = [...postsTodisLike, id]
			}
			postsToUndislike = postsToUndislike.filter((postId: string) => postId !== id)
		} else {
			postsTodisLike = postsTodisLike.filter((postId: string) => postId !== id)
			if (itemDisLikes.includes(userId)) {
				postsToUndislike = [...postsToUndislike, id]
			}
		}

		await saveSecurely([
			{ key: 'postsToLike', value: JSON.stringify(postsToLike) },
			{ key: 'postsTodisLike', value: JSON.stringify(postsTodisLike) },
			{ key: 'postsToUnlike', value: JSON.stringify(postsToUnlike) },
			{ key: 'postsToUndislike', value: JSON.stringify(postsToUndislike) },
		])

		setLikes(updatedLikes)
		setdisLikes(updatedDislikes)
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}

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

export const shareConfession = async ({
	id,
	itemShares,
	messageBody,
	confesser,
}: {
	id: string
	itemShares: string[]
	messageBody: string
	confesser: {
		display_name: string
		gender: string
		age: string
		photo_url: string
	}
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		const storedValues = await getStoredValues(['postsToShare'])
		let postsToShare = JSON.parse(storedValues.postsToShare || '[]')

		const message = `KokuTalk | Confess Anonymously\n\n${messageBody}\n\nConfessed by: ${confesser.display_name} (${confesser.gender}, ${confesser.age} years old)\n\nOpen this confession in KokuTalk: kokutalk://confession_details/${id}`

		const result = await Share.share({
			message: message,
		})

		if (result.action === Share.sharedAction) {
			if (itemShares.includes(userId)) {
				return
			}
			postsToShare = Array.from(new Set([...postsToShare, id]))
			await saveSecurely([{ key: 'postsToShare', value: JSON.stringify(postsToShare) }])
		}
	} catch (error: unknown) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
export const favoriteConfession = async ({
	id,
	isFavorite,
	setIsFavorite,
	itemFavorites,
}: {
	id: string
	isFavorite: boolean
	itemFavorites: string[]
	setIsFavorite: Dispatch<SetStateAction<boolean>>
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		const storedValues = await getStoredValues(['postsToFavorite'])
		let postsToFavorite = JSON.parse(storedValues.postsToFavorite || '[]')
		let postsToUnFavorite = JSON.parse(storedValues.postsToUnFavorite || '[]')

		if (isFavorite) {
			postsToFavorite = postsToFavorite.filter((item: string) => item !== id)
			if (itemFavorites.includes(userId)) {
				postsToUnFavorite = Array.from(new Set([...postsToUnFavorite, id]))
			}
		} else {
			if (!itemFavorites.includes(userId)) {
				postsToFavorite = Array.from(new Set([...postsToFavorite, id]))
			}
			postsToUnFavorite = postsToUnFavorite.filter((item: string) => item !== id)
		}
		await saveSecurely([
			{ key: 'postsToUnFavorite', value: JSON.stringify(postsToUnFavorite) },
			{ key: 'postsToFavorite', value: JSON.stringify(postsToFavorite) },
		])
		setIsFavorite(!isFavorite)
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
