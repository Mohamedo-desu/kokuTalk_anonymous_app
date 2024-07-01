import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const BackIcon = () => {
	const { theme } = useStyles()
	const router = useRouter()

	return (
		<TouchableOpacity onPress={() => router.back()}>
			<Ionicons name={'arrow-back-outline'} size={moderateScale(25)} color={theme.colors.white} />
		</TouchableOpacity>
	)
}

const SettingsIcon = () => {
	const { theme } = useStyles()
	return (
		<TouchableOpacity onPress={() => {}}>
			<Ionicons name="ellipsis-vertical" size={moderateScale(25)} color={theme.colors.white} />
		</TouchableOpacity>
	)
}

const GradientCommentHeader = ({ title }: { title: string }) => {
	const { theme, styles } = useStyles(stylesheet)
	const insets = useSafeAreaInsets()
	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}>
			<View style={[styles.header, { paddingTop: insets.top + moderateScale(5) }]}>
				<BackIcon />
				<Text style={[styles.title, { color: theme.colors.white }]}>{title}</Text>
				<SettingsIcon />
			</View>
		</LinearGradient>
	)
}

export default GradientCommentHeader

const stylesheet = createStyleSheet({
	title: {
		fontFamily: 'Medium',
		fontSize: moderateScale(20),
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBottom: moderateScale(10),
		paddingHorizontal: moderateScale(15),
	},
})
