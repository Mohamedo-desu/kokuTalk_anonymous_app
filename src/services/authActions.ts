import { AuthState } from '@/store/authStore'
import { SignInResult, User } from '@/types'
import { deleteStoredValues, saveSecurely } from '@/utils'
import { auth, db } from '@/utils/firebase'
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { getUserDataFromFirestore, removePushToken, uploadImage } from './userActions'

export const startTokenRefreshTimer = () => {
	const interval = setInterval(
		async () => {
			try {
				const user = auth.currentUser
				if (user) {
					await user.getIdTokenResult(true)
				}
			} catch (error) {
				console.error('Error refreshing token:', error)
			}
		},
		55 * 60 * 1000,
	) // Refresh every 55 minutes

	return interval
}

export const signInFirebase = async ({
	email,
	password,
}: {
	email: string
	password: string
}): Promise<SignInResult> => {
	try {
		const authResult = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password)
		const { uid } = authResult.user

		const intervalId = startTokenRefreshTimer()
		const userDoc = await getUserDataFromFirestore(uid)

		saveSecurely([
			{ key: 'userDoc', value: JSON.stringify(userDoc) },
			{ key: 'intervalId', value: intervalId },
		])

		return {
			user: { ...userDoc },
			rTokenTimerIntervalId: intervalId,
		}
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

export const signUpFirebase = async ({ body }: { body: User }): Promise<SignInResult> => {
	try {
		const authResult = await createUserWithEmailAndPassword(
			auth,
			body.email.trim().toLowerCase(),
			body.password,
		)
		const { uid } = authResult.user

		const userDoc = await addUserDataToFirestore({ uid, body: { ...body, uid } })
		await updateProfile(authResult.user, {
			displayName: body.displayName,
			photoURL: body.photoURL,
		})

		const intervalId = startTokenRefreshTimer()

		saveSecurely([
			{ key: 'userDoc', value: JSON.stringify(userDoc) },
			{ key: 'intervalId', value: intervalId },
		])

		return {
			user: { ...userDoc },
			rTokenTimerIntervalId: intervalId,
		}
	} catch (error: any) {
		let message = 'Something went wrong!'

		switch (error.code) {
			case 'auth/email-already-in-use':
				message = 'Email is already in use'
				break
			case 'auth/weak-password':
				message = 'Password is too weak'
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
export const logOutFirebase = async (state: AuthState) => {
	try {
		deleteStoredValues(['rememberMe', 'userDoc', 'pushTokenString', 'intervalId'])

		if (state.rTokenTimerIntervalId) {
			clearInterval(state.rTokenTimerIntervalId)
		}

		if (state.currentUser) {
			await removePushToken(state.currentUser.uid)
		}

		await auth.signOut()
	} catch (error: any) {
		throw new Error(error.message)
	}
}

export const addUserDataToFirestore = async ({ uid, body }: { uid: string; body: User }) => {
	await setDoc(doc(db, 'users', uid), { ...body })
	return { ...body }
}

export const updateUserDataFromFirestore = async ({ uid, body }: { uid: string; body: User }) => {
	await updateDoc(doc(db, 'users', uid), { ...body, updatedAt: new Date().toISOString() })
}

export const updateUserProfilePicture = async ({
	uid,
	result,
}: {
	uid: string
	result: string
}) => {
	const uri = await uploadImage(result, `/users/${uid}/profile/`)

	await updateDoc(doc(db, 'users', uid), {
		photoURL: uri,
		updatedAt: new Date().toISOString(),
	})
	if (auth.currentUser) {
		updateProfile(auth.currentUser, {
			photoURL: uri,
		})
	}

	return uri
}
