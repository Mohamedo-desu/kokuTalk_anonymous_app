import { useAuthStoreSelectors } from '@/store/authStore'
import { getStoredValues } from '@/utils/storageUtils'

import { uploadPushToken } from '@/services/userActions'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import useIsAnonymous from './useIsAnonymous'

function handleRegistrationError(errorMessage: string) {
	console.error(errorMessage)
}

const useSetupForPushNotifications = () => {
	const { theme } = useStyles()
	const isAnonymous = useIsAnonymous()

	const user = useAuthStoreSelectors.use.currentUser()

	async function registerForPushNotificationsAsync() {
		const { pushTokenString } = await getStoredValues(['pushTokenString'])

		if (isAnonymous || pushTokenString) return

		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: theme.colors.primary[500],
			})
		}

		const { status: existingStatus } = await Notifications.getPermissionsAsync()
		let finalStatus = existingStatus
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync()
			finalStatus = status
		}
		if (finalStatus !== 'granted') {
			handleRegistrationError('Permission not granted to get push token for push notification!')
			return
		}
		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
		if (!projectId) {
			handleRegistrationError('Project ID not found')
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data

			return uploadPushToken(pushTokenString, user.pushTokens, user.id)
		} catch (e: unknown) {
			handleRegistrationError(`${e}`)
		}
	}

	useEffect(() => {
		registerForPushNotificationsAsync()
	}, [user, isAnonymous])
}

export default useSetupForPushNotifications
