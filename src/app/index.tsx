import { appName } from '@/constants/appDetails'
import { useAuthStoreSelectors } from '@/store/authStore'
import { getStoredValues } from '@/utils/storageUtils'
import { supabase } from '@/utils/supabase'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SplashScreen = () => {
	const { styles, theme } = useStyles(stylesheet)
	const setDidTryAutoLogin = useAuthStoreSelectors.use.setDidTryAutoLogin()

	const updateUser = useAuthStoreSelectors.use.updateUser()
	const setAuthenticated = useAuthStoreSelectors.use.setAuthenticated()
	const setAnonymous = useAuthStoreSelectors.use.setAnonymous()

	useEffect(() => {
		const tryLogin = async () => {
			try {
				const { isAnonymous } = await getStoredValues(['isAnonymous'])

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
							setAuthenticated()
							setDidTryAutoLogin()
						} catch (error) {
							setDidTryAutoLogin()
						}
					} else if (isAnonymous) {
						setAnonymous()
					} else {
						setDidTryAutoLogin()
					}
				})
			} catch (error) {
				console.log(error)
				setDidTryAutoLogin()
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
