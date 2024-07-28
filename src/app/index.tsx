import { appName } from '@/constants/appDetails'
import { getUserDataFromFirestore } from '@/services/authActions'
import { useAuthStoreSelectors } from '@/store/authStore'
import { auth } from '@/utils/firebase'
import { getStoredValues } from '@/utils/storageUtils'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import Toast from 'react-native-toast-message'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SplashScreen = () => {
	const { styles, theme } = useStyles(stylesheet)
	const setDidTryAutoLogin = useAuthStoreSelectors.use.setDidTryAutoLogin()

	const setAuthenticated = useAuthStoreSelectors.use.setAuthenticated()
	const setAnonymous = useAuthStoreSelectors.use.setAnonymous()
	const updateUser = useAuthStoreSelectors.use.updateUser()

	useEffect(() => {
		const tryLogin = async () => {
			try {
				const { isAnonymous } = await getStoredValues(['isAnonymous'])

				onAuthStateChanged(auth, async (user) => {
					if (user) {
						try {
							const userDoc = await getUserDataFromFirestore(user.uid)

							updateUser(userDoc)

							setAuthenticated()
							setDidTryAutoLogin()
						} catch (error) {
							setDidTryAutoLogin()
							Toast.show({
								type: 'danger',
								text1: `${error}`,
							})
						}
					} else if (isAnonymous) {
						setAnonymous()
					} else {
						setDidTryAutoLogin()
					}
				})
			} catch (error: any) {
				setDidTryAutoLogin()
				Toast.show({
					type: 'danger',
					text1: `${error}`,
				})
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
