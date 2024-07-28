import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { Alert, Platform } from 'react-native'

export default function useUpdates() {
	useEffect(() => {
		const checkForUpdates = async () => {
			try {
				const { isAvailable } = await Updates.checkForUpdateAsync()

				if (isAvailable) {
					Alert.alert('Minor updates', 'Would you like to restart now to update ?', [
						{
							text: 'Cancel',
							style: 'cancel',
						},
						{
							text: 'OK',
							onPress: async () => {
								await Updates.fetchUpdateAsync()
								if (Platform.OS === 'web') {
									window.location.reload()
								} else {
									Updates.reloadAsync()
								}
							},
						},
					])
				}
			} catch (error) {
				console.error('Error checking for updates:', error)
				Alert.alert('Update Error', 'An error occurred while checking for updates.')
			}
		}

		checkForUpdates()
	}, [])

	return null
}
