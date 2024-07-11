import { User } from '@/types'
import { auth, db } from '@/utils/firebase'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const signUpFirebase = async ({
	email,
	password,
	body,
}: {
	email: string
	password: string
	body: User
}) => {
	try {
		const { display_name, photo_url } = body

		const authResult = await createUserWithEmailAndPassword(
			auth,
			email.trim().toLowerCase(),
			password,
		)
		const { uid } = authResult.user

		const userDoc = await addUserDataToFirestore({ id: uid, body: { ...body, id: uid } })
		await updateProfile(authResult.user, {
			displayName: display_name,
			photoURL: photo_url,
		})

		return userDoc
	} catch (error: any) {
		let message = 'Something went wrong!'

		switch (error.code) {
			case 'auth/user-not-found':
			case 'auth/wrong-password':
				message = 'Invalid credentials'
				break
			case 'auth/invalid-email':
				message = 'Invalid email address'
				break
			default:
				break
		}

		throw new Error(message)
	}
}
export const signInFirebase = async ({ email, password }: { email: string; password: string }) => {
	try {
		const authResult = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
		const { uid } = authResult.user

		const userDoc = await getUserDataFromFirestore(uid)

		return userDoc
	} catch (error: any) {
		let message = 'Something went wrong!'

		switch (error.code) {
			case 'auth/user-not-found':
			case 'auth/wrong-password':
				message = 'Invalid credentials'
				break
			case 'auth/invalid-email':
				message = 'Invalid email address'
				break
			default:
				break
		}

		throw new Error(message)
	}
}

export const getUserDataFromFirestore = async (uid: string) => {
	try {
		const userDoc = await getDoc(doc(db, 'users', uid))

		if (userDoc.exists()) {
			const userData = userDoc.data() as User

			return userData
		} else {
			throw new Error('user not found')
		}
	} catch (error) {
		throw new Error('Error fetching user data')
	}
}

export const addUserDataToFirestore = async ({ id, body }: { id: string; body: User }) => {
	try {
		await setDoc(doc(db, 'users', id), { ...body })
		return { ...body }
	} catch (error) {
		throw new Error('Error adding user data')
	}
}
