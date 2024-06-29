import useSetupForPushNotifications from '@/hooks/useSetupForPushNotifications'
import { Stack } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import React from 'react'

const MainLayout = () => {
	useSetupForPushNotifications()

	return (
		<Drawer screenOptions={{ headerShown: false, drawerType: 'slide' }} backBehavior="history">
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
		</Drawer>
	)
}

export default MainLayout
