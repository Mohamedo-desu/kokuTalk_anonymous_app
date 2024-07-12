import { useAuthStoreSelectors } from '@/store/authStore'
import { ADDCOMMENTPROPS, ADDCONFESSIONPROPS, CONFESSIONSPROPS } from '@/types'
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
	orderBy,
	query,
	QueryDocumentSnapshot,
	setDoc,
	startAfter,
	where,
	writeBatch,
} from 'firebase/firestore'
import { getUserDataFromFirestore } from './authActions'

export const fetchConfessions = async ({
	userId,
	fetchLimit,
}: {
	userId: string
	fetchLimit: number
}) => {
	try {
		const confessionsRef = collection(db, 'confessions')

		const q = query(confessionsRef)
		const snapshot = await getDocs(q)

		if (snapshot.empty) {
			console.log('No matching documents.')
			return []
		}

		const confessions = await Promise.all(
			snapshot.docs.map(async (confessDoc) => {
				const confession = { id: confessDoc.id, ...confessDoc.data() } as CONFESSIONSPROPS

				if (confession.confessed_by) {
					const userDoc = await getDoc(doc(db, 'users', confession.confessed_by))
					if (userDoc.exists()) {
						confession.user = { id: userDoc.id, ...userDoc.data() } as CONFESSIONSPROPS['user']
					}
				}

				return confession
			}),
		)

		if (!userId) {
			return confessions
		}

		const seenConfessions: CONFESSIONSPROPS[] = []
		const unseenConfessions: CONFESSIONSPROPS[] = []

		confessions.forEach((confession) => {
			if (confession.views && confession.views.includes(userId)) {
				seenConfessions.push(confession)
			} else {
				unseenConfessions.push(confession)
			}
		})

		const sortedConfessions = unseenConfessions.concat(seenConfessions).slice(0, fetchLimit)

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

		let { unseenConfessions } = await getStoredValues(['unseenConfessions'])

		if (!unseenConfessions || unseenConfessions.length === 0 || !userId) {
			return
		}

		unseenConfessions = JSON.parse(unseenConfessions)

		const batch = writeBatch(db)

		unseenConfessions.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { views: arrayUnion(userId) })
		})

		await batch.commit()

		await deleteStoredValues(['unseenConfessions'])
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating unseen confessions')
	}
}
export const updateLikesAndDislikes = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		const [{ postsToLike }, { postsTodisLike }, { postsToUnlike }, { postsToUndislike }] =
			await Promise.all([
				getStoredValues(['postsToLike']),
				getStoredValues(['postsTodisLike']),
				getStoredValues(['postsToUnlike']),
				getStoredValues(['postsToUndislike']),
			])

		const toLike = postsToLike ? JSON.parse(postsToLike) : []
		const toDislike = postsTodisLike ? JSON.parse(postsTodisLike) : []
		const toUnlike = postsToUnlike ? JSON.parse(postsToUnlike) : []
		const toUndislike = postsToUndislike ? JSON.parse(postsToUndislike) : []

		if (
			(toLike.length === 0 &&
				toDislike.length === 0 &&
				toUnlike.length === 0 &&
				toUndislike.length === 0) ||
			!userId
		) {
			return
		}

		const confessionsRef = collection(db, 'confessions')

		await deleteStoredValues(['postsToLike', 'postsTodisLike', 'postsToUnlike', 'postsToUndislike'])

		const batch = writeBatch(db)

		const updatePosts = (posts: string[], dislikes: boolean, remove: boolean) => {
			posts.forEach((postId: string) => {
				const confessionRef = doc(confessionsRef, postId)
				batch.update(confessionRef, {
					[dislikes ? 'dislikes' : 'likes']: remove ? arrayRemove(userId) : arrayUnion(userId),
					[dislikes ? 'likes' : 'dislikes']: arrayRemove(userId),
				})
			})
		}

		updatePosts(toLike, false, false)
		updatePosts(toDislike, true, false)
		updatePosts(toUnlike, false, true)
		updatePosts(toUndislike, true, true)

		await batch.commit()
	} catch (error: any) {
		throw new Error(
			error.message || 'An error occurred while updating likes and dislikes confessions',
		)
	}
}

export const uploadComment = async (commentBody: ADDCOMMENTPROPS) => {
	try {
		const batch = writeBatch(db)

		const commentRef = await addDoc(collection(db, 'comments'), commentBody)

		const commentId = commentRef.id

		if (commentBody.confession_id) {
			const confessionDocRef = doc(db, 'confessions', commentBody.confession_id)
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

export const updateSharedConfessions = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		let { postsToShare } = await getStoredValues(['postsToShare'])

		if (!postsToShare || postsToShare.length === 0 || !userId) {
			return
		}

		postsToShare = JSON.parse(postsToShare)

		const batch = writeBatch(db)

		postsToShare.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { shares: arrayUnion(userId) })
		})

		await batch.commit()

		await deleteStoredValues(['postsToShare'])
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating unseen confessions')
	}
}

export const updateFavoritedConfessions = async () => {
	try {
		const userId = useAuthStoreSelectors.getState().currentUser.id

		let { postsToUnFavorite, postsToFavorite } = await getStoredValues([
			'postsToUnFavorite',
			'postsToFavorite',
		])

		if (
			(!postsToUnFavorite && !postsToFavorite) ||
			(postsToFavorite.length === 0 && postsToUnFavorite.length === 0) ||
			!userId
		) {
			return
		}

		postsToUnFavorite = JSON.parse(postsToUnFavorite)
		postsToFavorite = JSON.parse(postsToFavorite)

		await deleteStoredValues(['postsToUnFavorite', 'postsToFavorite'])

		const batch = writeBatch(db)

		const userDocRef = doc(db, 'users', userId)

		postsToFavorite.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { favorites: arrayUnion(userId) })
			batch.update(userDocRef, { favorites: arrayUnion(confessionId) })
		})
		postsToUnFavorite.forEach((confessionId: string) => {
			const confessionRef = doc(db, 'confessions', confessionId)
			batch.update(confessionRef, { favorites: arrayRemove(userId) })
			batch.update(userDocRef, { favorites: arrayRemove(confessionId) })
		})

		await batch.commit()
	} catch (error: any) {
		throw new Error(error.message || 'An error occurred while updating favorited confessions')
	}
}

export const fetchConfessionById = async ({ id }: { id: string }) => {
	try {
		const confessionRef = doc(db, 'confessions', id)
		const commentsRef = collection(db, 'comments')

		const confessionSnapshot = await getDoc(confessionRef)

		if (!confessionSnapshot.exists()) {
			return []
		}

		const commentQuery = query(
			commentsRef,
			where('confession_id', '==', id),
			orderBy('created_at', 'desc'),
		)

		const commentSnapshot = await getDocs(commentQuery)

		const confession = {
			id: confessionSnapshot.id,
			...confessionSnapshot.data(),
		}

		const comments = commentSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))

		return [confession, comments]
	} catch (error) {
		console.error('Error fetching confession or comments:', error)
		throw new Error('Error fetching confession or comments:')
	}
}

// CURRENT USER CONFESSION ACTIONS

export const fetchMyConfessions = async ({
	lastVisible,
	setLastVisible,
}: {
	lastVisible: QueryDocumentSnapshot
	setLastVisible: (lastVisible: QueryDocumentSnapshot) => void
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

		let q = query(confessionsRef, where('id', 'in', userConfessions), orderBy('created_at', 'desc'))

		if (lastVisible) {
			q = query(
				confessionsRef,
				where('id', 'in', userConfessions),
				orderBy('created_at', 'desc'),
				startAfter(lastVisible),
			)
		}

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.log('No matching documents.')
			return []
		}

		const confessions = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as CONFESSIONSPROPS[]

		setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])

		return confessions
	} catch (error) {
		throw new Error('An error occurred while fetching your confessions')
	}
}
export const fetchFavoriteConfessions = async ({
	lastVisible,
	setLastVisible,
}: {
	lastVisible: QueryDocumentSnapshot
	setLastVisible: (lastVisible: QueryDocumentSnapshot) => void
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

		let q = query(confessionsRef, where('id', 'in', userFavorites), orderBy('created_at', 'desc'))

		if (lastVisible) {
			q = query(
				confessionsRef,
				where('id', 'in', userFavorites),
				orderBy('created_at', 'desc'),
				startAfter(lastVisible),
			)
		}

		const querySnapshot = await getDocs(q)

		if (querySnapshot.empty) {
			console.log('No matching documents.')
			return []
		}

		const favorites = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as CONFESSIONSPROPS[]

		setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])

		return favorites
	} catch (error) {
		throw new Error('An error occurred while fetching your favorites')
	}
}
