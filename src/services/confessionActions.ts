import { CONFESSION_STORED_KEYS } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import { ADDCONFESSIONPROPS, COMMENTPROPS, CONFESSIONPROPS } from '@/types'
import { db } from '@/utils/firebase'
import { deleteStoredValues, getStoredValues } from '@/utils/storageUtils'
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
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

export const fetchConfessions = async ({
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
	setNoMoreDocuments,
}: {
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
	setNoMoreDocuments: Dispatch<SetStateAction<boolean>>
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		const confessionsRef = collection(db, 'confessions')

		let q

		if (lastDocumentFetched) {
			q = query(
				confessionsRef,
				orderBy('created_at', 'desc'),
				startAfter(lastDocumentFetched),
				limit(fetchLimit),
			)
		} else {
			q = query(confessionsRef, orderBy('created_at', 'desc'), limit(fetchLimit))
		}
		const snapshot = await getDocs(q)

		if (snapshot.empty) {
			setNoMoreDocuments(true)
			return []
		}

		const confessions = await Promise.all(
			snapshot.docs.map(async (confessDoc) => {
				const confession = confessDoc.data() as CONFESSIONPROPS

				if (confession.confessed_by) {
					const userDoc = await getUserDataFromFirestore(confession.confessed_by)

					confession.user = userDoc as CONFESSIONPROPS['user']
				}

				return confession
			}),
		)

		if (!userId) {
			return confessions
		}

		const seenConfessions: CONFESSIONPROPS[] = []
		const unseenConfessions: CONFESSIONPROPS[] = []

		confessions.forEach((confession) => {
			if (confession.views && confession.views.includes(userId)) {
				seenConfessions.push(confession)
			} else {
				unseenConfessions.push(confession)
			}
		})

		const sortedConfessions = unseenConfessions.concat(seenConfessions)

		setLastDocumentFetched(snapshot.docs[snapshot.docs.length - 1])

		return sortedConfessions
	} catch (error: any) {
		throw new Error(error?.message || 'An error occurred')
	}
}

export const addConfession = async (confessionBody: ADDCONFESSIONPROPS) => {
	try {
		const batch = writeBatch(db)

		const confessionsRef = collection(db, 'confessions')
		const docRef = await addDoc(confessionsRef, {})

		const confessionId = docRef.id
		await setDoc(docRef, { id: confessionId, ...confessionBody })

		if (confessionBody.confessed_by) {
			const userDocRef = doc(db, 'users', confessionBody.confessed_by)
			batch.update(userDocRef, { confessions: arrayUnion(confessionId) })
		}

		await batch.commit()

		return confessionId
	} catch (error: any) {
		throw new Error(error.message || 'Failed to add confession')
	}
}

export const updateUnseenConfessions = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return
		}

		let { [CONFESSION_STORED_KEYS.UNSEEN_CONFESSIONS]: unseenConfessions } = await getStoredValues([
			CONFESSION_STORED_KEYS.UNSEEN_CONFESSIONS,
		])

		if (!unseenConfessions || unseenConfessions.length === 0) {
			return
		}

		unseenConfessions = JSON.parse(unseenConfessions)

		await deleteStoredValues([CONFESSION_STORED_KEYS.UNSEEN_CONFESSIONS])

		const batch = writeBatch(db)

		unseenConfessions.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { views: arrayUnion(userId) })
		})

		await batch.commit()
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating unseen confessions')
	}
}
export const updateConfessionLikesAndDislikes = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return
		}

		const storedValues = await Promise.all([
			getStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE]),
			getStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE]),
			getStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE]),
			getStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE]),
		])

		const [
			{ [CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE]: confessionsToLike },
			{ [CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE]: confessionsTodisLike },
			{ [CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE]: confessionsToUnlike },
			{ [CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE]: confessionsToUndislike },
		] = storedValues

		const toLike = confessionsToLike ? JSON.parse(confessionsToLike) : []
		const toDislike = confessionsTodisLike ? JSON.parse(confessionsTodisLike) : []
		const toUnlike = confessionsToUnlike ? JSON.parse(confessionsToUnlike) : []
		const toUndislike = confessionsToUndislike ? JSON.parse(confessionsToUndislike) : []

		if (
			toLike.length === 0 &&
			toDislike.length === 0 &&
			toUnlike.length === 0 &&
			toUndislike.length === 0
		) {
			return
		}

		const confessionsRef = collection(db, 'confessions')

		await deleteStoredValues([
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_LIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_DISLIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNLIKE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNDISLIKE,
		])

		const batch = writeBatch(db)

		const updateConfessions = (confessions: string[], dislikes: boolean, remove: boolean) => {
			confessions.forEach((postId: string) => {
				const confessionRef = doc(confessionsRef, postId)
				batch.update(confessionRef, {
					[dislikes ? 'dislikes' : 'likes']: remove ? arrayRemove(userId) : arrayUnion(userId),
					[dislikes ? 'likes' : 'dislikes']: arrayRemove(userId),
				})
			})
		}

		updateConfessions(toLike, false, false)
		updateConfessions(toDislike, true, false)
		updateConfessions(toUnlike, false, true)
		updateConfessions(toUndislike, true, true)

		await batch.commit()
	} catch (error: any) {
		throw new Error(
			error.message || 'An error occurred while updating likes and dislikes confessions',
		)
	}
}

export const updateSharedConfessions = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return
		}

		let { [CONFESSION_STORED_KEYS.CONFESSIONS_TO_SHARE]: confessionsToShare } =
			await getStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_SHARE])

		if (!confessionsToShare || confessionsToShare.length === 0) {
			return
		}

		confessionsToShare = JSON.parse(confessionsToShare)

		const batch = writeBatch(db)

		confessionsToShare.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { shares: arrayUnion(userId) })
		})

		await batch.commit()

		await deleteStoredValues([CONFESSION_STORED_KEYS.CONFESSIONS_TO_SHARE])
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating shared confessions')
	}
}

export const updateFavoritedConfessions = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return
		}

		let storedValues = await getStoredValues([
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNFAVORITE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_FAVORITE,
		])

		let {
			[CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNFAVORITE]: confessionsToUnFavorite,
			[CONFESSION_STORED_KEYS.CONFESSIONS_TO_FAVORITE]: confessionsToFavorite,
		} = storedValues

		if (
			(!confessionsToUnFavorite && !confessionsToFavorite) ||
			(confessionsToFavorite.length === 0 && confessionsToUnFavorite.length === 0)
		) {
			return
		}

		confessionsToUnFavorite = JSON.parse(confessionsToUnFavorite)
		confessionsToFavorite = JSON.parse(confessionsToFavorite)

		await deleteStoredValues([
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_UNFAVORITE,
			CONFESSION_STORED_KEYS.CONFESSIONS_TO_FAVORITE,
		])

		const batch = writeBatch(db)

		const userDocRef = doc(db, 'users', userId)

		confessionsToFavorite.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { favorites: arrayUnion(userId) })
			batch.update(userDocRef, { favorites: arrayUnion(confessionId) })
		})
		confessionsToUnFavorite.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { favorites: arrayRemove(userId) })
			batch.update(userDocRef, { favorites: arrayRemove(confessionId) })
		})

		await batch.commit()
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating favorited confessions')
	}
}

export const fetchConfessionById = async ({ id }: { id: string | undefined }) => {
	try {
		if (!id) return
		const confessionRef = doc(db, 'confessions', id)

		const confessionSnapshot = await getDoc(confessionRef)

		if (!confessionSnapshot.exists()) {
			return
		}

		const confession = {
			id: confessionSnapshot.id,
			...confessionSnapshot.data(),
		} as CONFESSIONPROPS

		if (!confession.confessed_by) {
			return
		}

		const userDoc = await getUserDataFromFirestore(confession.confessed_by)
		confession.user = userDoc as CONFESSIONPROPS['user']

		return confession
	} catch (error) {
		console.error('Error fetching confession or comments:', error)
		throw new Error('Error fetching confession or comments:')
	}
}

export const fetchConfessionComments = async ({
	confessionComments,
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
	setNoMoreDocuments,
}: {
	confessionComments: string[] | undefined
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
	setNoMoreDocuments: Dispatch<SetStateAction<boolean>>
}) => {
	try {
		if (!confessionComments || confessionComments.length === 0) {
			return []
		}

		const commentsRef = collection(db, 'comments')

		let q

		if (lastDocumentFetched) {
			q = query(
				commentsRef,
				where('id', 'in', confessionComments),
				orderBy('created_at', 'desc'),
				startAfter(lastDocumentFetched),
				limit(fetchLimit),
			)
		} else {
			q = query(
				commentsRef,
				where('id', 'in', confessionComments),
				orderBy('created_at', 'desc'),
				limit(fetchLimit),
			)
		}

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			setNoMoreDocuments(true)

			return []
		}

		const comments = await Promise.all(
			querySnapshot.docs.map(async (confessDoc) => {
				const comment = confessDoc.data() as COMMENTPROPS

				if (comment.commented_by) {
					const userDoc = await getUserDataFromFirestore(comment.commented_by)

					comment.user = userDoc as CONFESSIONPROPS['user']
				}

				return comment
			}) as Promise<COMMENTPROPS>[],
		)

		setLastDocumentFetched(querySnapshot.docs[querySnapshot.docs.length - 1])

		return comments
	} catch (error) {
		console.log(error)

		throw new Error('An error occurred while fetching the comments')
	}
}

export const deleteAConfession = async ({
	confessionId,
	confessedUserId,
}: {
	confessionId: string
	confessedUserId: string
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId || !confessionId || !confessedUserId) {
			return
		}

		if (userId !== confessedUserId) {
			throw new Error('Unauthorized to delete this confession')
		}

		const batch = writeBatch(db)

		const confessionRef = doc(db, 'confessions', confessionId)

		const commentsRef = collection(db, 'comments')
		const commentsQuery = query(commentsRef, where('confession_id', '==', confessionId))
		const commentsSnapshot = await getDocs(commentsQuery)

		commentsSnapshot.forEach((commentDoc) => {
			const commentId = commentDoc.id
			const commentRef = doc(db, 'comments', commentId)
			batch.delete(commentRef)
		})

		const repliesRef = collection(db, 'replies')
		const repliesQuery = query(repliesRef, where('confession_id', '==', confessionId))
		const repliesSnapshot = await getDocs(repliesQuery)

		repliesSnapshot.forEach((replyDoc) => {
			const replyId = replyDoc.id
			const replyRef = doc(db, 'replies', replyId)
			batch.delete(replyRef)
		})

		const userDocRef = doc(db, 'users', userId)
		batch.update(userDocRef, {
			confessions: arrayRemove(confessionId),
		})

		batch.delete(confessionRef)

		await batch.commit()

		console.log('Confession and associated comments/replies deleted successfully')
	} catch (error: any) {
		throw new Error(error.message || 'Failed to delete confession')
	}
}
// CURRENT USER CONFESSION ACTIONS
export const fetchMyConfessions = async ({
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
	setNoMoreDocuments,
}: {
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
	setNoMoreDocuments: Dispatch<SetStateAction<boolean>>
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return []
		}

		const userDoc = await getUserDataFromFirestore(userId)

		const userConfessions = userDoc.confessions as unknown as string[]

		if (!userConfessions || userConfessions.length === 0) {
			return []
		}
		const confessionsRef = collection(db, 'confessions')

		let q

		if (lastDocumentFetched) {
			q = query(
				confessionsRef,
				where('id', 'in', userConfessions),
				startAfter(lastDocumentFetched),
				limit(fetchLimit),
			)
		} else {
			q = query(confessionsRef, where('id', 'in', userConfessions), limit(fetchLimit))
		}

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			setNoMoreDocuments(true)
			return []
		}

		const confessions = await Promise.all(
			querySnapshot.docs.map(async (confessDoc) => {
				const confession = { user: userDoc, ...confessDoc.data() } as unknown as CONFESSIONPROPS

				return confession
			}) as Promise<CONFESSIONPROPS>[],
		)

		setLastDocumentFetched(querySnapshot.docs[querySnapshot.docs.length - 1])

		return confessions
	} catch (error) {
		throw new Error('An error occurred while fetching your confessions')
	}
}
export const fetchFavoriteConfessions = async ({
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
	setNoMoreDocuments,
}: {
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
	setNoMoreDocuments: Dispatch<SetStateAction<boolean>>
}) => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		if (!userId) {
			return []
		}

		const userDoc = await getUserDataFromFirestore(userId)

		const userFavorites = userDoc.favorites as unknown as string[]

		if (!userFavorites || userFavorites.length === 0) {
			return []
		}
		const confessionsRef = collection(db, 'confessions')

		let q

		if (lastDocumentFetched) {
			q = query(
				confessionsRef,
				where('id', 'in', userFavorites),
				startAfter(lastDocumentFetched),
				limit(fetchLimit),
			)
		} else {
			q = query(confessionsRef, where('id', 'in', userFavorites), limit(fetchLimit))
		}

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			setNoMoreDocuments(true)
			return []
		}

		const favorites = await Promise.all(
			querySnapshot.docs.map(async (confessDoc) => {
				const confession = confessDoc.data() as CONFESSIONPROPS

				if (confession.confessed_by) {
					const userDoc = await getUserDataFromFirestore(confession.confessed_by)

					confession.user = userDoc as CONFESSIONPROPS['user']
				}

				return confession
			}),
		)

		setLastDocumentFetched(querySnapshot.docs[querySnapshot.docs.length - 1])

		return favorites
	} catch (error) {
		throw new Error('An error occurred while fetching your favorites')
	}
}
