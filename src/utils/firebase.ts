import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import { initializeApp } from 'firebase/app'
import { AppState } from 'react-native'

// Optionally import the services that you want to use
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Initialize Firebase
const firebaseConfig = {
	apiKey: Constants?.expoConfig?.extra?.FIREBASE_API_KEY,
	authDomain: Constants?.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
	databaseURL: Constants?.expoConfig?.extra?.FIREBASE_DATABASE_URL,
	projectId: Constants?.expoConfig?.extra?.FIREBASE_PROJECT_ID,
	storageBucket: Constants?.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: Constants?.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
	appId: Constants?.expoConfig?.extra?.FIREBASE_APP_ID,
	measurementId: Constants?.expoConfig?.extra?.FIREBASE_MEASUREMENT_ID,
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const storage = getStorage(firebaseApp)
const auth = initializeAuth(firebaseApp, {
	persistence: getReactNativePersistence(AsyncStorage),
})

export default firebaseApp

export { auth, db, storage }

AppState.addEventListener('change', (state) => {
	if (state === 'active') {
		startTokenRefresh()
	}
})

const startTokenRefresh = () => {
	const user = auth.currentUser

	if (user) {
		user
			.getIdToken(true)
			.then((token) => {
				console.log('Refreshed token:', token)
			})
			.catch((error) => {
				console.error('Error refreshing token:', error)
			})
	}
}
