import { db, storage } from '@/utils/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

import {
	arrayRemove,
	arrayUnion,
	collection,
	endAt,
	getDocs,
	orderBy,
	query,
	startAt,
	updateDoc,
	where,
} from 'firebase/firestore'

import { User } from '@/types'
import { getStoredValues } from '@/utils'

// Function to get all documents from a collection based on a query
const getDocumentsFromCollection = async (collectionName: string, field: string, value: string) => {
	const q = query(collection(db, collectionName), where(field, '==', value))
	const querySnapshot = await getDocs(q)
	return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getUserDataFromFirestore = async (uid: string) => {
	try {
		const userDoc = await getDoc(doc(db, 'users', uid))

		if (userDoc.exists()) {
			const userData = userDoc.data() as User

			return userData
		} else {
			throw new Error('User document not found in Firestore')
		}
	} catch (error) {
		console.error('Error fetching user data: ', error)
		throw new Error('Error fetching user data')
	}
}

export const uploadImage = async (image: string, path: string) => {
	try {
		const response = await fetch(image)
		const blob = await response.blob()
		const fileName = image.split('/').pop()

		const storageRef = ref(storage, `${path}/${fileName}`)
		await uploadBytesResumable(storageRef, blob)

		const downloadURL = await getDownloadURL(storageRef)

		return downloadURL
	} catch (error) {
		console.error('Error uploading image:', error)
		throw error
	}
}

export const deleteImage = async (path: string) => {
	try {
		if (path) {
			const fileRef = ref(storage, path)
			await deleteObject(fileRef)
			console.log('Image deleted successfully')
		}
	} catch (error) {
		console.error('Error deleting image:', error)
		throw error
	}
}

export const searchUsers = async (searchPhrase: string, uid: string) => {
	try {
		// Trim the search phrase to remove leading and trailing whitespaces
		const trimmedSearchPhrase = searchPhrase.trim().toLowerCase()

		// Check if the trimmed search phrase is empty
		if (!trimmedSearchPhrase) {
			return []
		}

		// Query users collection
		const usersRef = collection(db, 'users')

		// Construct a query for searching by displayName using startAt and endAt for prefix matching
		const fullNameQuery = query(
			usersRef,
			orderBy('displayName'),
			startAt(trimmedSearchPhrase),
			endAt(trimmedSearchPhrase + '\uf8ff'),
			where('uid', '!=', uid),
		)

		// Execute the query asynchronously
		const fullNameQueryResults = await getDocs(fullNameQuery)

		// Map the results to an array of user objects
		const results = fullNameQueryResults.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

		return results
	} catch (error) {
		console.error('Error fetching users from Firestore:', error)
		throw error
	}
}

export const uploadPushToken = async (pushToken: string, pushTokens: string[], uid: string) => {
	if (pushTokens?.includes(pushToken)) {
		return
	} else {
		await updateDoc(doc(db, 'users', uid), {
			pushTokens: arrayUnion(pushToken),
			updatedAt: new Date().toISOString(),
		})
	}
}
export const removePushToken = async (uid: string) => {
	const { pushTokenString } = getStoredValues(['pushTokenString'])

	await updateDoc(doc(db, 'users', uid), {
		pushTokens: arrayRemove(pushTokenString || ''),
		updatedAt: new Date().toISOString(),
	})
}
export const sendPushNotifications = async (
	pushToken: string,
	title: string,
	body: string,
	data: any,
) => {
	const message = {
		to: pushToken,
		sound: 'default',
		title,
		body,
		data,
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

export const fetchNotifications = async ({ uid }: { uid: string }) => {
	try {
		// Query for all notifications that belong to the user
		const notificationsQuery = query(collection(db, 'notifications'), where('to.uid', '==', uid))
		const querySnapshot = await getDocs(notificationsQuery)

		return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
	} catch (error) {
		console.error('Error updating notifications: ', error)
		throw new Error('Error updating notifications')
	}
}
