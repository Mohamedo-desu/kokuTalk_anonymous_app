import { IS_ANDROID } from '@/utils'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const TabsLayout = () => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: styles.tabBarStyle,
				tabBarActiveTintColor: theme.colors.primary[500],
				tabBarInactiveTintColor: theme.colors.gray[200],
			}}>
			<Tabs.Screen
				name="(home)"
				options={{
					tabBarLabel: ({ focused }) =>
						focused ? (
							<Text
								style={[styles.tabBarLabel, { color: theme.colors.primary[500] }]}
								numberOfLines={1}>
								Home
							</Text>
						) : null,
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="account"
				options={{
					tabBarLabel: ({ focused }) =>
						focused ? (
							<Text
								style={[styles.tabBarLabel, { color: theme.colors.primary[500] }]}
								numberOfLines={1}>
								Account
							</Text>
						) : null,
					tabBarIcon: ({ color, size, focused }) => (
						<Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	)
}

export default TabsLayout

const stylesheet = createStyleSheet({
	tabBarLabel: {
		fontFamily: 'Bold',
		fontSize: moderateScale(18),
		marginTop: IS_ANDROID ? 0 : 5,
	},
	tabBarStyle: {
		height: IS_ANDROID ? 70 : 85,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: IS_ANDROID ? 5 : 25,
		paddingTop: IS_ANDROID ? 0 : 5,
	},
})
