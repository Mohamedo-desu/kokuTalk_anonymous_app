import { PLACE_HOLDER } from '@/constants/placeHolders'
import { useAuthStoreSelectors } from '@/store/authStore'
import { useSettingsStoreSelectors } from '@/store/settingsStore'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, Switch, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ManageSettings = () => {
	const { theme, styles } = useStyles(stylesheet)
	const insets = useSafeAreaInsets()

	const { photo_url, display_name, age, gender } = useAuthStoreSelectors.use.currentUser()

	const currTheme = useSettingsStoreSelectors.use.theme()
	const setTheme = useSettingsStoreSelectors.use.setTheme()

	const onValueChange = (value: string) => {
		setTheme(value)
	}

	const renderThemeOption = (label: string, value: string) => (
		<View style={styles.optionContainer}>
			<Text style={[styles.optionLabel, { color: theme.colors.gray[400] }]}>{label}</Text>
			<Switch
				style={styles.switch}
				thumbColor={theme.colors.primary[500]}
				trackColor={{ false: theme.colors.gray[100], true: theme.colors.primary[500] }}
				value={currTheme === value}
				onValueChange={() => onValueChange(value)}
			/>
		</View>
	)

	return (
		<LinearGradient
			colors={[theme.colors.background, theme.colors.background]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0 }}
			style={[
				styles.screen,
				{
					paddingBottom: insets.bottom + moderateScale(10),
					backgroundColor: theme.colors.background,
				},
			]}>
			<View style={styles.optionsWrapper}>
				<View>
					<Image
						source={{ uri: photo_url || PLACE_HOLDER }}
						style={styles.profileImage}
						resizeMode="cover"
					/>
				</View>
			</View>
			<View style={styles.optionsWrapper}>
				<Text style={[styles.title, { color: theme.colors.typography }]}>Theme</Text>
				{renderThemeOption('Light', 'light')}
				{renderThemeOption('Dark', 'dark')}
				{renderThemeOption('Use System', 'system')}
			</View>
		</LinearGradient>
	)
}

export default ManageSettings

const stylesheet = createStyleSheet({
	screen: {
		flex: 1,
		paddingTop: moderateScale(10),
		paddingHorizontal: moderateScale(15),
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: moderateScale(50),
		alignSelf: 'center',
	},
	title: {
		fontFamily: 'SemiBold',
		fontSize: moderateScale(18),
	},
	optionsWrapper: {
		marginTop: moderateScale(10),
		gap: moderateScale(5),
	},
	optionContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	optionLabel: {
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
	},
	switch: {},
})
