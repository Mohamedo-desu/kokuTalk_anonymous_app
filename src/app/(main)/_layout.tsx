import DrawerContent from '@/components/DrawerContent'
import { Stack } from 'expo-router'
import { Drawer } from 'expo-router/drawer'

/**
 * MainLayout component.
 *
 * @returns JSX.Element The rendered MainLayout component.
 */
const MainLayout = (): JSX.Element => {
	return (
		<Drawer
			screenOptions={{ headerShown: false, drawerType: 'slide' }}
			backBehavior="history"
			drawerContent={DrawerContent}>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Drawer>
	)
}

export default MainLayout
