import { appName } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { useDrawerStatus } from '@react-navigation/drawer'
import { DrawerActions } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { moderateScale } from 'react-native-size-matters'
import { useStyles } from 'react-native-unistyles'

const MenuIcon = () => {
	const { theme } = useStyles()
	const navigation = useNavigation()
	const isDrawerOpen = useDrawerStatus() === 'open'
	return (
		<TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
			<Ionicons
				name={isDrawerOpen ? 'close-outline' : 'menu-outline'}
				size={moderateScale(25)}
				color={theme.colors.white}
			/>
		</TouchableOpacity>
	)
}
const AddButton = () => {
	const { theme } = useStyles()
	return (
		<TouchableOpacity onPress={() => {}}>
			<Ionicons name="add-sharp" size={moderateScale(25)} color={theme.colors.white} />
		</TouchableOpacity>
	)
}

const GradientHeader = () => {
	const { theme } = useStyles()
	const insets = useSafeAreaInsets()
	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					paddingTop: insets.top,
					paddingBottom: moderateScale(10),
					paddingHorizontal: moderateScale(15),
				}}>
				<MenuIcon />
				<Text
					style={{
						fontFamily: 'Medium',
						fontSize: moderateScale(20),
						color: theme.colors.white,
					}}>
					{appName}
				</Text>
				<AddButton />
			</View>
		</LinearGradient>
	)
}

export default GradientHeader
