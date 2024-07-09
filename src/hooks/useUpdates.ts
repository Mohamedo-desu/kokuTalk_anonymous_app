import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { Alert } from 'react-native'

export default function useUpdates() {
	const { isUpdateAvailable } = Updates.useUpdates()

	useEffect(() => {
		if (isUpdateAvailable) {
			Updates.fetchUpdateAsync()
				.then(() => {
					Alert.alert('Minor fixes are available !', ' Would you like to Restart now?', [
						{
							text: 'Cancel',
							style: 'cancel',
						},
						{
							text: 'OK',
							onPress: () => Updates.reloadAsync(),
						},
					])
				})
				.catch(() => {
					Alert.alert('Update error', 'An error occurred while checking for updates.')
				})
		}
	}, [isUpdateAvailable])

	return null
}
