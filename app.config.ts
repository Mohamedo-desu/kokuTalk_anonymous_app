import 'dotenv/config'

export default {
	expo: {
		name: 'KokuTalk-Anonymous',
		slug: 'kokutalk',
		version: '1.0.0',
		scheme: 'kokutalk',
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/favicon.png',
		},
		plugins: [
			'expo-router',
			[
				'expo-updates',
				{
					username: 'mohamedo-desu',
				},
			],
			[
				'expo-notifications',
				{
					icon: './assets/notification-icon.png',
					color: '#6200ff',
					sounds: [],
				},
			],
			[
				'@sentry/react-native/expo',
				{
					url: 'https://sentry.io/',
					organization: process.env.SENTRY_ORG,
					project: process.env.EXPO_PUBLIC_SENTRY_PROJECT,
				},
			],
		],
		experiments: {
			typedRoutes: true,
			tsconfigPaths: true,
		},
		orientation: 'portrait',
		icon: './assets/icon.png',
		userInterfaceStyle: 'automatic',
		splash: {
			image: './assets/splash.png',
			resizeMode: 'cover',
			backgroundColor: '#ffffff',
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: true,
			bundleIdentifier: 'com.mohamedodesu.kokutalk',
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			package: 'com.mohamedodesu.kokutalk',
			googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
		},
		updates: {
			url: 'https://u.expo.dev/911e2d2e-e548-4ba5-94ac-a87712b2bcc9',
		},
		runtimeVersion: {
			policy: 'appVersion',
		},
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: '911e2d2e-e548-4ba5-94ac-a87712b2bcc9',
			},
			SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
			SENTRY_DSN: process.env.SENTRY_DSN,
			SENTRY_ORG: process.env.SENTRY_ORG,
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
			GOOGLE_SERVICES_JSON: process.env.GOOGLE_SERVICES_JSON,
		},
	},
}
