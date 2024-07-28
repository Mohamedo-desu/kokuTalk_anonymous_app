import { useAuthStoreSelectors } from '@/store/authStore'
import { NOTIFICATIONPROPS } from '@/types'
import { db } from '@/utils/firebase'
import { deleteStoredValues, getStoredValues, saveSecurely } from '@/utils/storageUtils'
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDocs,
	limit,
	query,
	QueryDocumentSnapshot,
	startAfter,
	updateDoc,
	where,
} from 'firebase/firestore'
import { Dispatch, SetStateAction } from 'react'
import { getUserDataFromFirestore } from './authActions'

export const uploadPushToken = async (
	pushTokenString: string,
	pushTokens: string[],
	uid: string,
) => {
	await saveSecurely([{ key: 'pushTokenString', value: pushTokenString }])

	if (pushTokens?.includes(pushTokenString)) {
		return
	} else {
		await updateDoc(doc(db, 'users', uid), {
			pushTokens: arrayUnion(pushTokenString),
			updated_at: new Date().toISOString(),
		})
	}
}
export const removePushToken = async (uid: string) => {
	const { pushTokenString } = await getStoredValues(['pushTokenString'])

	await updateDoc(doc(db, 'users', uid), {
		pushTokens: arrayRemove(pushTokenString || ''),
		updated_at: new Date().toISOString(),
	})

	await deleteStoredValues(['pushTokenString'])
}

export const blockUser = async ({ uid, blockUserId }: { uid: string; blockUserId: string }) => {
	await updateDoc(doc(db, 'users', uid), {
		blocked_users: arrayUnion(blockUserId),
		updated_at: new Date().toISOString(),
	})
}
export const sendPushNotifications = async (
	pushToken: string,
	title: string,
	body: string,
	url: string,
) => {
	const message = {
		to: pushToken,
		sound: 'default',
		title,
		body,
		data: { url },
	}

	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	})
}

export const sendNotification = async ({
	url,
	title,
	body,
	from,
	to,
	type,
}: {
	url: string
	title: string
	body: string
	from: string
	to: string
	type: string
}) => {
	const notificationCollectionRef = collection(db, 'notifications')

	const notificationRef = await addDoc(notificationCollectionRef, {
		url,
		title,
		body,
		from,
		to,
		type,
		isCleared: false,
		isNew: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	})
	await updateDoc(doc(db, 'users', to), {
		notifications: arrayUnion(notificationRef.id),
		updatedAt: new Date().toISOString(),
	})
}

export const fetchNotifications = async ({
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
		const { id: userId } = useAuthStoreSelectors.getState().currentUser

		if (!userId) return []

		const notificationsRef = collection(db, 'notifications')

		let q

		if (lastDocumentFetched) {
			q = query(
				notificationsRef,
				where('to', '==', userId),
				startAfter(lastDocumentFetched),
				limit(fetchLimit),
			)
		} else {
			q = query(notificationsRef, where('to', '==', userId), limit(fetchLimit))
		}
		const snapshot = await getDocs(q)

		if (snapshot.empty) {
			return []
		}

		const notifications = await Promise.all(
			snapshot.docs.map(async (confessDoc) => {
				const notification = confessDoc.data() as NOTIFICATIONPROPS

				if (notification.from) {
					const userDoc = await getUserDataFromFirestore(notification.from)
					notification.avatar = userDoc.photo_url
				}

				return notification
			}),
		)

		setLastDocumentFetched(snapshot.docs[snapshot.docs.length - 1])

		return notifications
	} catch (error) {
		console.error('Error getting notifications: ', error)
		throw new Error('Error getting notifications')
	}
}
