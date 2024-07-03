import { Dimensions, Platform } from 'react-native'

// Device Dimensions
const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = Dimensions.get('window').height
const IS_ANDROID = Platform.OS === 'android'

export { DEVICE_HEIGHT, DEVICE_WIDTH, IS_ANDROID }
