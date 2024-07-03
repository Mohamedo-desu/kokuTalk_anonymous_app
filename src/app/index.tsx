import { appName } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SplashScreen = () => {
	const { styles, theme } = useStyles(stylesheet)
	const setDidTryAutoLogin = useAuthStoreSelectors.use.setDidTryAutoLogin()
	useEffect(() => {
		const tryLogin = async () => {
			try {
				setDidTryAutoLogin()
			} catch (error) {
				console.log(error)
			}
		}
		tryLogin()
	}, [])

	return (
		<View
			style={[
				theme.components.screen,
				styles.screen,
				{
					backgroundColor: theme.colors.primary[500],
				},
			]}>
			<Text
				style={{
					fontFamily: 'Bold',
					letterSpacing: 1,
					fontSize: moderateScale(36),
					color: theme.colors.white,
				}}>
				{appName}
			</Text>
		</View>
	)
}

export default SplashScreen

const stylesheet = createStyleSheet({
	screen: {
		justifyContent: 'center',
		alignItems: 'center',
	},
})
