import { appName } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import { useUserStoreSelectors } from '@/store/useUserStore'
import { supabase } from '@/utils/supabase'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SplashScreen = () => {
	const { styles, theme } = useStyles(stylesheet)
	const setDidTryAutoLogin = useAuthStoreSelectors.use.setDidTryAutoLogin()

	const updateUser = useUserStoreSelectors.use.updateUser()
	const setIsAuthenticated = useAuthStoreSelectors.use.setIsAuthenticated()

	useEffect(() => {
		const tryLogin = async () => {
			try {
				supabase.auth.onAuthStateChange((_event, session) => {
					if (session) {
						try {
							updateUser({
								id: session.user.id,
								displayName: session.user.user_metadata.displayName,
								userName: session.user.user_metadata.userName,
								email: session.user.email,
								gender: session.user.user_metadata.gender,
								photoURL: session.user.user_metadata.photoURL,
								age: session.user.user_metadata.age,
							})
							setIsAuthenticated(true)
							setDidTryAutoLogin()
						} catch (error) {
							setDidTryAutoLogin()
						}
					} else {
						setDidTryAutoLogin()
					}
				})
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
