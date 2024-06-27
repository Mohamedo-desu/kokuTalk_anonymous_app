import { signIn, startTokenRefreshTimer } from '@/services/authActions'
import { getUserDataFromFirestore } from '@/services/userActions'
import { useAppDispatch } from '@/store/store'
import { AUTHENTICATE_USER, SET_CURRENT_USER, SET_DID_TRY_AUTO_LOGIN } from '@/store/userSlice'
import { getStoredValues } from '@/utils'
import { auth } from '@/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
const SplashScreen = () => {
	const { styles, theme } = useStyles(stylesheet)
	const { email, password } = getStoredValues(['email', 'password'])
	const { rememberMe } = getStoredValues(['rememberMe'])

	const dispatch = useAppDispatch()

	useEffect(() => {
		const tryLogin = async () => {
			try {
				if (email && password && rememberMe) {
					onAuthStateChanged(auth, async (user) => {
						if (user) {
							try {
								const userDoc = await getUserDataFromFirestore(user.uid)

								const intervalId = startTokenRefreshTimer()

								dispatch(
									SET_CURRENT_USER({
										...userDoc,
										rTokenTimerIntervalId: intervalId,
									}),
								)
								dispatch(SET_DID_TRY_AUTO_LOGIN())
								dispatch(AUTHENTICATE_USER())
							} catch (error) {
								dispatch(SET_DID_TRY_AUTO_LOGIN())
							}
						} else {
							dispatch(SET_DID_TRY_AUTO_LOGIN())
							await dispatch(signIn({ email, password }))
						}
					})
				} else {
					dispatch(SET_DID_TRY_AUTO_LOGIN())
				}
			} catch (error) {
				dispatch(SET_DID_TRY_AUTO_LOGIN())
			}
		}

		tryLogin()
	}, [dispatch, email, password])

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
