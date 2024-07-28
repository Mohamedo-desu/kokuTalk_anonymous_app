import { Fonts } from '@/constants/Fonts'
import useUpdates from '@/hooks/useUpdates'
import ProtectRoutes from '@/providers/ProtectRoutes'
import CustomThemeProvider from '@/providers/ThemeProvider'
import '@/unistyle/unistyles'
import * as Sentry from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import { Slot, SplashScreen, useNavigationContainerRef } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { UnistylesRuntime, useStyles } from 'react-native-unistyles'

SplashScreen.preventAutoHideAsync()

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

Sentry.init({
	dsn: Constants?.expoConfig?.extra?.SENTRY_DSN,
	tracesSampleRate: 1,
	_experiments: {
		profilesSampleRate: 1,
	},
	debug: false,
	enableAutoSessionTracking: true,
	attachScreenshot: true,
	attachStacktrace: true,
	integrations: [
		new Sentry.ReactNativeTracing({
			routingInstrumentation,
			enableNativeFramesTracking: !isRunningInExpoGo(),
		}),
	],
	enableAutoPerformanceTracing: true,
})

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
})

function RootLayout() {
	const { theme } = useStyles()
	
	if (Device.isDevice) {
      useUpdates();
    }

	const ref = useNavigationContainerRef()
	const [fontsLoaded, fontError] = useFonts(Fonts)

	useEffect(() => {
		if (ref) {
			routingInstrumentation.registerNavigationContainer(ref)
			SplashScreen.hideAsync()
			UnistylesRuntime.navigationBar.setColor(theme.colors.primary[500])
			return () => UnistylesRuntime.navigationBar.setColor(undefined)
		}
	}, [ref, theme.colors.primary])

	if (!fontsLoaded || fontError) return null

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<CustomThemeProvider>
				<ProtectRoutes>
					<Slot />
				</ProtectRoutes>
				<Toast />
			</CustomThemeProvider>
		</GestureHandlerRootView>
	)
}

export default Sentry.wrap(RootLayout)
