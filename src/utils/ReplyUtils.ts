import { REPLY_STORED_KEYS } from '@/constants/appDetails'
import { deleteAReply, reportAReply, uploadReply } from '@/services/ReplyActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { REPORTPROPS } from '@/types'
import { Dispatch, SetStateAction } from 'react'
import Toast from 'react-native-toast-message'
import { getStoredValues, saveSecurely } from './storageUtils'

export const addReply = async ({
	id,
	confessionId,
	newReply,
}: {
	id: string
	confessionId: string
	newReply: string
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		await uploadReply({
			id: '',
			comment_id: id,
			created_at: '',
			reply_text: newReply,
			confession_id: confessionId,
			replied_by: userId,
			likes: [],
			dislikes: [],
			reports: [],
		})
	} catch (error) {
		Toast.show({
			type: 'danger',
			text1: `${error}`,
		})
	}
}

export const likeReply = async ({
	id,
	likes,
	dislikes,
	setLikes,
	pushTokens,
	setdisLikes,
	itemLikes,
}: {
	id: string
	likes: string[]
	dislikes: string[]
	pushTokens: string[]
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
			REPLY_STORED_KEYS.REPLIES_TO_DISLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_LIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNLIKE,
			REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY,
		])

		let repliesTodisLike = JSON.parse(storedValues[REPLY_STORED_KEYS.REPLIES_TO_DISLIKE] || '[]')
		let repliesToUndislike = JSON.parse(
			storedValues[REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE] || '[]',
		)
		let repliesToLike = JSON.parse(storedValues[REPLY_STORED_KEYS.REPLIES_TO_LIKE] || '[]')
		let repliesToUnlike = JSON.parse(storedValues[REPLY_STORED_KEYS.REPLIES_TO_UNLIKE] || '[]')
		let pushTokensToNotify = JSON.parse(
			storedValues[REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY] || '[]',
		)

		repliesTodisLike = repliesTodisLike.filter((postId: string) => postId !== id)
		repliesToUndislike = repliesToUndislike.filter((postId: string) => postId !== id)
		pushTokensToNotify = pushTokensToNotify.filter((tokenObj: any) => tokenObj.replyId !== id)

		if (updatedLikes.includes(userId)) {
			if (!itemLikes.includes(userId)) {
				repliesToLike = [...repliesToLike, id]
				pushTokensToNotify = [...pushTokensToNotify, { replyId: id, pushTokens }]
			}
			repliesToUnlike = repliesToUnlike.filter((postId: string) => postId !== id)
		} else {
			repliesToLike = repliesToLike.filter((postId: string) => postId !== id)
			if (itemLikes.includes(userId)) {
				repliesToUnlike = [...repliesToUnlike, id]
			}
		}

		await saveSecurely([
			{ key: REPLY_STORED_KEYS.REPLIES_TO_LIKE, value: JSON.stringify(repliesToLike) },
			{ key: REPLY_STORED_KEYS.REPLIES_TO_DISLIKE, value: JSON.stringify(repliesTodisLike) },
			{ key: REPLY_STORED_KEYS.REPLIES_TO_UNLIKE, value: JSON.stringify(repliesToUnlike) },
			{
				key: REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE,
				value: JSON.stringify(repliesToUndislike),
			},
			{
				key: REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY,
				value: JSON.stringify(pushTokensToNotify),
			},
		])

		setLikes(updatedLikes)
		setdisLikes(updatedDislikes)
	} catch (error) {
		Toast.show({
			type: 'danger',
			text1: `${error}`,
		})
	}
}
export const disLikeReply = async ({
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
			REPLY_STORED_KEYS.REPLIES_TO_DISLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE,
			REPLY_STORED_KEYS.REPLIES_TO_LIKE,
			REPLY_STORED_KEYS.REPLIES_TO_UNLIKE,
			REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY,
		])

		let repliesTodisLike = JSON.parse(storedValues[REPLY_STORED_KEYS.REPLIES_TO_DISLIKE] || '[]')
		let repliesToUndislike = JSON.parse(
			storedValues[REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE] || '[]',
		)
		let repliesToLike = JSON.parse(storedValues[REPLY_STORED_KEYS.REPLIES_TO_LIKE] || '[]')
		let repliesToUnlike = JSON.parse(storedValues[REPLY_STORED_KEYS.REPLIES_TO_UNLIKE] || '[]')
		let pushTokensToNotify = JSON.parse(
			storedValues[REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY] || '[]',
		)

		repliesToLike = repliesToLike.filter((postId: string) => postId !== id)
		repliesToUnlike = repliesToUnlike.filter((postId: string) => postId !== id)
		pushTokensToNotify.filter((tokenObj: any) => tokenObj.replyId !== id)

		if (updatedDislikes.includes(userId)) {
			if (!itemDisLikes.includes(userId)) {
				repliesTodisLike = [...repliesTodisLike, id]
			}
			repliesToUndislike = repliesToUndislike.filter((postId: string) => postId !== id)
		} else {
			repliesTodisLike = repliesTodisLike.filter((postId: string) => postId !== id)
			if (itemDisLikes.includes(userId)) {
				repliesToUndislike = [...repliesToUndislike, id]
			}
		}

		await saveSecurely([
			{ key: REPLY_STORED_KEYS.REPLIES_TO_LIKE, value: JSON.stringify(repliesToLike) },
			{ key: REPLY_STORED_KEYS.REPLIES_TO_DISLIKE, value: JSON.stringify(repliesTodisLike) },
			{ key: REPLY_STORED_KEYS.REPLIES_TO_UNLIKE, value: JSON.stringify(repliesToUnlike) },
			{
				key: REPLY_STORED_KEYS.REPLIES_TO_UNDISLIKE,
				value: JSON.stringify(repliesToUndislike),
			},
			{
				key: REPLY_STORED_KEYS.PUSH_TOKENS_TO_NOTIFY,
				value: JSON.stringify(pushTokensToNotify),
			},
		])

		setLikes(updatedLikes)
		setdisLikes(updatedDislikes)
	} catch (error) {
		Toast.show({
			type: 'danger',
			text1: `${error}`,
		})
	}
}
export const deleteReply = async ({
	commentId,
	replyId,
	repliedById,
}: {
	commentId: string
	replyId: string
	repliedById: string
}) => {
	try {
		await deleteAReply({
			commentId,
			replyId,
			repliedById,
		})
	} catch (error: unknown) {
		Toast.show({
			type: 'danger',
			text1: `${error}`,
		})
	}
}
export const reportReply = async ({
	replyId,
	report_reason,
	reported_by,
}: {
	replyId: string
	report_reason: REPORTPROPS['report_reason']
	reported_by: string
}) => {
	try {
		await reportAReply({
			replyId,
			report_reason,
			reported_by,
		})
	} catch (error: unknown) {
		Toast.show({
			type: 'danger',
			text1: `${error}`,
		})
	}
}
