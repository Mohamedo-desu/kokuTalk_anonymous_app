import GradientHeader from '@/components/GradientHeader'
import TabBar from '@/components/TabBar'
import { appName } from '@/constants/appDetails'

import { Tabs } from 'expo-router'
import React from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const TabsLayout = () => {
	const { theme } = useStyles(stylesheet)
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: theme.colors.primary[300],
				},
			}}
			tabBar={(props: any) => <TabBar {...props} />}>
			<Tabs.Screen
				name="(home)"
				options={{
					headerShown: true,
					header: () => <GradientHeader title={appName} />,
				}}
			/>

			<Tabs.Screen
				name="explore"
				options={{
					headerShown: true,
					header: () => <GradientHeader title={'Explore'} />,
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					headerShown: true,
					header: () => <GradientHeader title={'Notifications'} />,
				}}
			/>
		</Tabs>
	)
}

export default TabsLayout

const stylesheet = createStyleSheet({})
