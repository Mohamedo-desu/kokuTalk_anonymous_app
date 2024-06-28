import { useAuthStoreSelectors } from '@/store/authStore'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
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
					backgroundColor: theme.colors.white[500],
				},
			]}>
			<ActivityIndicator size={'large'} color={theme.colors.primary[500]} />
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
