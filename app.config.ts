import { ConfigContext, ExpoConfig } from 'expo/config'

const EAS_PROJECT_ID = "6cb5993b-e14b-45b4-af0c-6cb0b89a39a0"
const PROJECT_SLUG = 'share_confessions'
const OWNER = 'mohamedo-desu'

// App production config
const APP_NAME = 'Share Confessions'
const BUNDLE_IDENTIFIER = `com.mohamedodesu.${PROJECT_SLUG}`
const PACKAGE_NAME = `com.mohamedodesu.${PROJECT_SLUG}`
const ICON = './assets/icon.png'
const ADAPTIVE_ICON = './assets/adaptive-icon.png'
const SCHEME = PROJECT_SLUG

export default ({ config }: ConfigContext): ExpoConfig => {
	console.log('⚙️ Building app for environment:', process.env.APP_ENV)
	const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } = getDynamicAppConfig(
		(process.env.APP_ENV as 'development' | 'preview' | 'production') || 'development',
	)

	return {
		...config,
		name: name,
		version: '1.0.0',
		slug: PROJECT_SLUG,
		orientation: 'portrait',
		userInterfaceStyle: 'automatic',
		newArchEnabled: true,
		icon: icon,
		scheme: scheme,
		ios: {
			supportsTablet: true,
			bundleIdentifier: bundleIdentifier,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: adaptiveIcon,
				backgroundColor: '#ffffff',
			},
			package: packageName,
			softwareKeyboardLayoutMode: 'pan',
			edgeToEdgeEnabled: true,
		},
		updates: {
			url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
		},
		runtimeVersion: {
			policy: 'appVersion',
		},
		extra: {
			eas: {
				projectId: EAS_PROJECT_ID,
			},
		},
		plugins: [
			'expo-router',
			[
				'expo-splash-screen',
				{
					image: './assets/splash-icon.png',
					imageWidth: 80,
					resizeMode: 'contain',	
					backgroundColor:'#DDDDF4'
				},
			],
			[
				'@sentry/react-native/expo',
				{
					organization: 'mohamedo-apps-desu',
					project: PROJECT_SLUG,
					url: 'https://sentry.io',
				},
			],
			[
				'expo-font',
				{
					fonts: [
						'./assets/fonts/NotoSans-Bold.ttf',
						'./assets/fonts/NotoSans-Medium.ttf',
						'./assets/fonts/NotoSans-Regular.ttf',
					],
				},
			],

			[
				'expo-notifications',
				{
					icon: './assets/notification-icon.png',
					color: '#5753C9',
					defaultChannel: 'default',
					sounds: [],
					enableBackgroundRemoteNotifications: true,
				},
			],

			[
				'react-native-edge-to-edge',
				{
					android: {
						parentTheme: 'Light',
						enforceNavigationBarContrast: false,
					},
				},
			],
			'expo-secure-store',
			 "expo-web-browser"
		],
		experiments: {
			reactCompiler: false,
			typedRoutes: true,
			reactCanary: true,
			remoteBuildCache: {
				provider: 'eas',
			},
		},
		owner: OWNER,
	}
}

export const getDynamicAppConfig = (environment: 'development' | 'preview' | 'production') => {
	if (environment === 'production') {
		return {
			name: APP_NAME,
			bundleIdentifier: BUNDLE_IDENTIFIER,
			packageName: PACKAGE_NAME,
			icon: ICON,
			adaptiveIcon: ADAPTIVE_ICON,
			scheme: SCHEME,
		}
	}

	if (environment === 'preview') {
		return {
			name: `${APP_NAME}`,
			bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
			packageName: `${PACKAGE_NAME}.preview`,
			icon: './assets/icon.png',
			adaptiveIcon: './assets/adaptive-icon.png',
			scheme: `${SCHEME}-prev`,
		}
	}

	return {
		name: `${APP_NAME} Development`,
		bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
		packageName: `${PACKAGE_NAME}.dev`,
		icon: './assets/icon.png',
		adaptiveIcon: './assets/adaptive-icon.png',
		scheme: `${SCHEME}-dev`,
	}
}
