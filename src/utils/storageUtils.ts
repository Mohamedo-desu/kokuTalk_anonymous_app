import * as SecureStore from 'expo-secure-store'

export const saveSecurely = async (keyValuePairs: { key: string; value: string }[]) => {
	try {
		for (const pair of keyValuePairs) {
			if (pair.key && pair.value !== undefined) {
				await SecureStore.setItemAsync(pair.key, pair.value)
			}
		}
	} catch (error) {
		console.error('Error saving values securely:', error)
	}
}

export const getStoredValues = async (keys: string[]) => {
	const values: any = {}

	try {
		for (const key of keys) {
			values[key] = await SecureStore.getItemAsync(key)
		}
	} catch (error) {
		console.error('Error retrieving stored values:', error)
	}

	return values
}

export const deleteStoredValues = async (keys: string[]) => {
	try {
		for (const key of keys) {
			await SecureStore.deleteItemAsync(key)
		}
	} catch (error) {
		console.error('Error deleting stored values:', error)
	}
}
