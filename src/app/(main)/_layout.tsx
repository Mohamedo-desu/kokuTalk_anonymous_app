import DrawerContent from '@/components/DrawerContent'
import GradientCommentHeader from '@/components/GradientCommentHeader'
import useNetworkState from '@/hooks/useNetworkState'
import { useNotificationObserver } from '@/hooks/useNotificationObserver'
import useScheduleAll from '@/hooks/useScheduleAll'
import useSetupForPushNotifications from '@/hooks/useSetupForPushNotifications'
import { Drawer } from 'expo-router/drawer'
import 'react-native-gesture-handler'
import 'react-native-reanimated'

/**
 * MainLayout component.
 *
 * @returns JSX.Element The rendered MainLayout component.
 */

const MainLayout = (): JSX.Element => {
	useNotificationObserver()
	useNetworkState()
	useScheduleAll()
	useSetupForPushNotifications()
	//useUpdates()

	return (
		<Drawer
			screenOptions={{
				headerShown: false,
				drawerType: 'slide',
				swipeEnabled: true,
			}}
			initialRouteName="(tabs)"
			backBehavior="history"
			drawerContent={(props) => <DrawerContent {...props} />}>
			<Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
			<Drawer.Screen
				name="confession_details"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title="Comments" />,
				}}
			/>
			<Drawer.Screen
				name="my_confessions"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title="My Confessions" />,
				}}
			/>
			<Drawer.Screen
				name="saved_confessions"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title="Saved Confessions" />,
				}}
			/>
			<Drawer.Screen
				name="add_confession"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title="Add Confession" />,
				}}
			/>
			<Drawer.Screen
				name="manage_settings"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title="Settings" />,
				}}
			/>
		</Drawer>
	)
}

export default MainLayout
