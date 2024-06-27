import { signIn, useAuthStoreSelectors } from '@/store/authStore'
import { deleteStoredValues, getStoredValues } from '@/utils'
import { auth } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SplashScreen = () => {
	const { styles, theme } = useStyles(stylesheet)
	const { email, password, userDoc, rememberMe } = getStoredValues([
		'email',
		'password',
		'userDoc',
		'rememberMe',
	])

	const setDidTryAutoLogin = useAuthStoreSelectors.use.setDidTryAutoLogin()
	const setCurrentUser = useAuthStoreSelectors.use.setCurrentUser()
	const authenticateUser = useAuthStoreSelectors.use.authenticateUser()

	useEffect(() => {
		const tryLogin = async () => {
			try {
				if (email && password && rememberMe && userDoc) {
					onAuthStateChanged(auth, async (user) => {
						if (user) {
							try {
								setCurrentUser(JSON.parse(userDoc))
								authenticateUser()
								setDidTryAutoLogin()
							} catch (error) {
								setDidTryAutoLogin()
							}
						} else {
							deleteStoredValues(['intervalId', 'userDoc'])
							await signIn({ email, password })
						}
					})
				} else {
					setDidTryAutoLogin()
				}
			} catch (error) {
				console.log(error)
				setDidTryAutoLogin()
			}
		}

		tryLogin()
	}, [email, password, rememberMe, userDoc])

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
