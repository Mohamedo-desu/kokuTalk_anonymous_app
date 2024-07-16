import { CONFESSION_STORED_KEYS } from '@/constants/appDetails'
import { deleteAConfession, reportAConfession } from '@/services/confessionActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { Dispatch, SetStateAction } from 'react'
import { Share } from 'react-native'
import { Toast } from 'react-native-toast-notifications'
import { getStoredValues, saveSecurely } from './storageUtils'

export const generateRandomColor = () => {
	const colorsArray = ['#FF5733', '#3357FF', '#FF33A1', '#A133FF', '#FFA533', '#5733FF', '#FF3357']
	const randomIndex = Math.floor(Math.random() * colorsArray.length)
	return colorsArray[randomIndex]
}

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

		const storedValues = await getStoredValues([
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE,
		])

		let confessionsToDislike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE] || '[]',
		)
		let confessionsToUndislike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE] || '[]',
		)
		let confessionsToLike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE] || '[]',
		)
		let confessionsToUnlike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE] || '[]',
		)

		confessionsToDislike = confessionsToDislike.filter(
			(confessionId: string) => confessionId !== id,
		)
		confessionsToUndislike = confessionsToUndislike.filter(
			(confessionId: string) => confessionId !== id,
		)

		if (updatedLikes.includes(userId)) {
			if (!itemLikes.includes(userId)) {
				confessionsToLike = [...confessionsToLike, id]
			}
			confessionsToUnlike = confessionsToUnlike.filter(
				(confessionId: string) => confessionId !== id,
			)
		} else {
			confessionsToLike = confessionsToLike.filter((confessionId: string) => confessionId !== id)
			if (itemLikes.includes(userId)) {
				confessionsToUnlike = [...confessionsToUnlike, id]
			}
		}

		await saveSecurely([
			{ key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE, value: JSON.stringify(confessionsToLike) },
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE,
				value: JSON.stringify(confessionsToDislike),
			},
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE,
				value: JSON.stringify(confessionsToUnlike),
			},
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE,
				value: JSON.stringify(confessionsToUndislike),
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

		const storedValues = await getStoredValues([
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE,
		])

		let confessionsTodisLike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE] || '[]',
		)
		let confessionsToUndislike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE] || '[]',
		)
		let confessionsToLike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE] || '[]',
		)
		let confessionsToUnlike = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE] || '[]',
		)

		confessionsToLike = confessionsToLike.filter((postId: string) => postId !== id)
		confessionsToUnlike = confessionsToUnlike.filter((postId: string) => postId !== id)

		if (updatedDislikes.includes(userId)) {
			if (!itemDisLikes.includes(userId)) {
				confessionsTodisLike = [...confessionsTodisLike, id]
			}
			confessionsToUndislike = confessionsToUndislike.filter((postId: string) => postId !== id)
		} else {
			confessionsTodisLike = confessionsTodisLike.filter((postId: string) => postId !== id)
			if (itemDisLikes.includes(userId)) {
				confessionsToUndislike = [...confessionsToUndislike, id]
			}
		}

		await saveSecurely([
			{ key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE, value: JSON.stringify(confessionsToLike) },
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE,
				value: JSON.stringify(confessionsTodisLike),
			},
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE,
				value: JSON.stringify(confessionsToUnlike),
			},
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE,
				value: JSON.stringify(confessionsToUndislike),
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

		const storedValues = await getStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_SHARE])
		let confessionsToShare = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_SHARE] || '[]',
		)

		const message = `KokuTalk | Confess Anonymously\n\n${messageBody}\n\nConfessed by: ${confesser.display_name} (${confesser.gender}, ${confesser.age} years old)\n\nOpen this confession in KokuTalk: kokutalk://confession_details/${id}`

		const result = await Share.share({
			message: message,
		})

		if (result.action === Share.sharedAction) {
			if (itemShares.includes(userId)) {
				return
			}
			confessionsToShare = Array.from(new Set([...confessionsToShare, id]))
			await saveSecurely([
				{
					key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_SHARE,
					value: JSON.stringify(confessionsToShare),
				},
			])
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

		const storedValues = await getStoredValues([
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_FAVORITE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNFAVORITE,
		])
		let confessionsToFavorite = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_FAVORITE] || '[]',
		)
		let confessionsToUnFavorite = JSON.parse(
			storedValues[CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNFAVORITE] || '[]',
		)

		if (isFavorite) {
			confessionsToFavorite = confessionsToFavorite.filter((item: string) => item !== id)
			if (itemFavorites.includes(userId)) {
				confessionsToUnFavorite = Array.from(new Set([...confessionsToUnFavorite, id]))
			}
		} else {
			if (!itemFavorites.includes(userId)) {
				confessionsToFavorite = Array.from(new Set([...confessionsToFavorite, id]))
			}
			confessionsToUnFavorite = confessionsToUnFavorite.filter((item: string) => item !== id)
		}
		await saveSecurely([
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNFAVORITE,
				value: JSON.stringify(confessionsToUnFavorite),
			},
			{
				key: CONFESSION_STORED_KEYS.CONFESSIONS_TO_FAVORITE,
				value: JSON.stringify(confessionsToFavorite),
			},
		])
		setIsFavorite(!isFavorite)
	} catch (error) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}

export const deleteConfession = async ({
	confessionId,
	confessedUserId,
}: {
	confessionId: string
	confessedUserId: string
}) => {
	try {
		await deleteAConfession({
			confessionId,
			confessedUserId,
		})
	} catch (error: unknown) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
export const reportConfession = async ({
	confessionId,
	report_reason,
	reported_by,
}: {
	confessionId: string
	report_reason: string
	reported_by: string
}) => {
	try {
		await reportAConfession({
			confessionId,
			report_reason,
			reported_by,
		})
	} catch (error: unknown) {
		Toast.show(`${error}`, {
			type: 'danger',
		})
	}
}
