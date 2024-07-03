import * as SecureStore from 'expo-secure-store'

export const saveSecurely = (keyValuePairs: any[]) => {
	try {
		for (const pair of keyValuePairs) {
			if (pair.key && pair.value !== undefined) {
				console.log(pair.key, pair.value)

				SecureStore.setItemAsync(pair.key, pair.value)
			}
		}
	} catch (error) {
		console.error('Error saving values securely:', error)
	}
}

export const getStoredValues = (keys: string[]) => {
	const values: any = {}

	try {
		for (const key of keys) {
			values[key] = SecureStore.getItemAsync(key)
		}
	} catch (error) {
		console.error('Error retrieving stored values:', error)
	}

	return values
}

export const deleteStoredValues = (keys: string[]) => {
	try {
		for (const key of keys) {
			SecureStore.deleteItemAsync(key)
		}
	} catch (error) {
		console.error('Error deleting stored values:', error)
	}
}
