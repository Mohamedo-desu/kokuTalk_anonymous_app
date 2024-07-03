import * as ImagePicker from 'expo-image-picker'

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
