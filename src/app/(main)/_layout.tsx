import DrawerContent from '@/components/DrawerContent'
import GradientCommentHeader from '@/components/GradientCommentHeader'
import useNetworkState from '@/hooks/useNetworkState'
import useScheduleAll from '@/hooks/useScheduleAll'
import { Stack } from 'expo-router'
import { Drawer } from 'expo-router/drawer'

/**
 * MainLayout component.
 *
 * @returns JSX.Element The rendered MainLayout component.
 */
const MainLayout = (): JSX.Element => {
	useNetworkState()
	useScheduleAll()
	//useUpdates()

	return (
		<Drawer
			screenOptions={{ headerShown: false, drawerType: 'slide', swipeEnabled: true }}
			backBehavior="history"
			drawerContent={(props) => <DrawerContent {...props} />}>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="confession_details"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title="Comments" />,
					animation: 'slide_from_right',
					animationTypeForReplace: 'pop',
					presentation: 'modal',
				}}
			/>
			<Stack.Screen
				name="my_confessions"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title={'My Confessions'} />,
				}}
			/>
			<Stack.Screen
				name="saved_confessions"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title={'Saved Confessions'} />,
				}}
			/>
			<Stack.Screen
				name="add_confession"
				options={{
					headerShown: true,
					header: () => <GradientCommentHeader title={'Add Confession'} />,
					presentation: 'modal',
					animation: 'slide_from_bottom',
					animationTypeForReplace: 'push',
				}}
			/>
		</Drawer>
	)
}

export default MainLayout
