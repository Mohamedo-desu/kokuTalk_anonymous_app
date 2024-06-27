import * as ImagePicker from 'expo-image-picker'
import { Dimensions, Platform } from 'react-native'
import { MMKV } from 'react-native-mmkv'

// MMKV STORAGE
export const storage = new MMKV()

// Device Dimensions
const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height
const IS_ANDROID = Platform.OS === 'android'

export const saveSecurely = (keyValuePairs: any[]) => {
	try {
		for (const pair of keyValuePairs) {
			if (pair.key && pair.value !== undefined) {
				console.log(pair.key, pair.value)

				storage.set(pair.key, pair.value)
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
			values[key] = storage.getString(key)
		}
	} catch (error) {
		console.error('Error retrieving stored values:', error)
	}

	return values
}

export const deleteStoredValues = (keys: string[]) => {
	try {
		for (const key of keys) {
			storage.delete(key)
		}
	} catch (error) {
		console.error('Error deleting stored values:', error)
	}
}

export { DEVICE_HEIGHT, DEVICE_WIDTH, IS_ANDROID }

// CAPITALIZE WORDS
export const capitalizeWords = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}

// CAMERA AND GALLERY SUPPORT
export const handleCamera = async () => {
	const permission = await ImagePicker.requestCameraPermissionsAsync()
	if (!permission.granted) return
	const result = await ImagePicker.launchCameraAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		quality: 1,
	})

	if (!result.canceled) {
		return result.assets[0].uri
	}
}
export const handleGallery = async () => {
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		quality: 1,
	})

	if (!result.canceled) {
		return result.assets[0].uri
	}
}
