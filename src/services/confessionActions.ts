import { useAuthStoreSelectors } from '@/store/authStore'
import { ADDCONFESSIONPROPS, COMMENTPROPS, CONFESSIONPROPS, REPLYPROPS } from '@/types'
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
import { getUserDataFromFirestore } from './authActions'

export const fetchConfessions = async ({
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
}: {
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
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

		let { unseenConfessions } = await getStoredValues(['unseenConfessions'])

		if (!unseenConfessions || unseenConfessions.length === 0 || !userId) {
			return
		}

		unseenConfessions = JSON.parse(unseenConfessions)

		await deleteStoredValues(['unseenConfessions'])

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

export const uploadReply = async (replyBody: REPLYPROPS | any) => {
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
}: {
	confessionComments: string[] | undefined
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
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
			console.log('No more comments to fetch')

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

export const fetchCommentReplies = async ({
	commentsReplies,
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
}: {
	commentsReplies: string[] | undefined
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
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
			console.log('No more replies to fetch')

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

// CURRENT USER CONFESSION ACTIONS

export const fetchMyConfessions = async ({
	fetchLimit,
	lastDocumentFetched,
	setLastDocumentFetched,
}: {
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
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
}: {
	fetchLimit: number
	lastDocumentFetched: QueryDocumentSnapshot | null
	setLastDocumentFetched: any
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
