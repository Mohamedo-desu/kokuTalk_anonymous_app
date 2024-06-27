import useSetupForPushNotifications from '@/hooks/useSetupForPushNotifications'
import { Stack } from 'expo-router'
import React from 'react'

const MainLayout = () => {
	useSetupForPushNotifications()

	return <Stack />
}

export default MainLayout
