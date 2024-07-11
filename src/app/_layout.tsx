import { Fonts } from '@/constants/Fonts'
import AuthProvider from '@/providers/AuthProvider'
import CustomThemeProvider from '@/providers/ThemeProvider'
import ToastProvider from '@/providers/ToastProvider'
import '@/unistyle/unistyles'
import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import { Slot, SplashScreen, router, useNavigationContainerRef } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'

SplashScreen.preventAutoHideAsync()

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

Sentry.init({
	dsn: Constants?.expoConfig?.extra?.SENTRY_DSN,
	tracesSampleRate: 0.1,
	_experiments: {
		profilesSampleRate: 0.1,
	},
	debug: false,
	enableAutoSessionTracking: true,
	attachScreenshot: true,
	attachStacktrace: true,
	integrations: [
		new Sentry.ReactNativeTracing({
			routingInstrumentation,
		}),
	],
})

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
})

function useNotificationObserver() {
	useEffect(() => {
		let isMounted = true

		function redirect(notification: Notifications.Notification) {
			const url = notification.request.content.data?.url
			if (url) {
				router.push(url)
			}
		}

		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (!isMounted || !response?.notification) {
				return
			}
			redirect(response?.notification)
		})

		const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
			redirect(response.notification)
		})

		return () => {
			isMounted = false
			subscription.remove()
		}
	}, [])
}

export default function RootLayout() {
	useNotificationObserver()

	const { theme } = useStyles()

	const ref = useNavigationContainerRef()
	const [fontsLoaded, fontError] = useFonts(Fonts)

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync()
		}
		if (ref) {
			routingInstrumentation.registerNavigationContainer(ref)
		}

		UnistylesRuntime.navigationBar.setColor(theme.colors.primary[500])
		return () => {
			UnistylesRuntime.navigationBar.setColor(undefined)
		}
	}, [fontsLoaded, fontError, ref, theme.colors.primary])

	if (!fontsLoaded && !fontError) {
		return null
	}

	return (
		<CustomThemeProvider>
			<AuthProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<ToastProvider>
						<Slot />
					</ToastProvider>
				</GestureHandlerRootView>
			</AuthProvider>
		</CustomThemeProvider>
	)
}
