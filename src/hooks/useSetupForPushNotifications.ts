import { useAuthStoreSelectors } from '@/store/authStore'
import { saveSecurely } from '@/utils'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { useStyles } from 'react-native-unistyles'

function handleRegistrationError(errorMessage: string) {
	alert(errorMessage)
	throw new Error(errorMessage)
}

const useSetupForPushNotifications = () => {
	const { theme } = useStyles()

	const user = useAuthStoreSelectors.use.currentUser()

	async function registerForPushNotificationsAsync() {
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: theme.colors.primary[500],
			})
		}

		if (Device.isDevice) {
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

				saveSecurely([{ key: 'pushTokenString', value: pushTokenString }])
				return null
			} catch (e: unknown) {
				handleRegistrationError(`${e}`)
			}
		} else {
			// handleRegistrationError('Must use physical device for push notifications')
		}
	}

	useEffect(() => {
		registerForPushNotificationsAsync()
	}, [user])
}

export default useSetupForPushNotifications
