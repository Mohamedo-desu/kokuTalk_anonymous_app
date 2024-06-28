import Input from '@/components/Input'
import Loader from '@/components/Loader'
import { SignInValidationSchema } from '@/services/validations'
import { getStoredValues } from '@/utils'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { moderateScale } from 'react-native-size-matters'
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles'

const SignInPage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const [loading, setLoading] = useState(false)

	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')

	useEffect(() => {
		const { userName, password } = getStoredValues(['userName', 'password'])

		setUserName(userName)
		setPassword(password)

		// Set the color of the status bar
		UnistylesRuntime.statusBar.setColor(theme.colors.primary[300])
		// Set the color of the navigation bar
		UnistylesRuntime.navigationBar.setColor(theme.colors.primary[400])

		// Reset the color of the navigation bar when the component is unmounted
		return () => {
			UnistylesRuntime.navigationBar.setColor(undefined)
		}
	}, [])

	const handleSignIn = async ({ userName, password }: { userName: string; password: string }) => {
		try {
		} catch (error) {}
	}

	const goToSignUp = () => {
		router.navigate('/sign_up')
	}
	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={{ flex: 1 }}>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				style={{
					flex: 1,
				}}
				contentContainerStyle={{
					flexGrow: 1,
				}}>
				<Formik
					initialValues={{ userName, password }}
					enableReinitialize
					validationSchema={SignInValidationSchema}
					onSubmit={(values) => handleSignIn(values)}>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<View style={styles.formikContainer}>
							<View style={[styles.form, { backgroundColor: theme.colors.primary[500] }]}>
								<Input
									title="user name"
									errors={errors.userName}
									touched={touched.userName}
									value={values.userName}
									handleChange={handleChange('userName')}
									handleBlur={handleBlur('userName')}
									autoComplete={'username'}
									maxLength={15}
								/>
								<Input
									title="password"
									errors={errors.password}
									touched={touched.password}
									value={values.password}
									handleChange={handleChange('password')}
									handleBlur={handleBlur('password')}
									autoComplete={'password'}
									maxLength={35}
									secureTextEntry={true}
								/>
							</View>

							<TouchableOpacity
								onPress={handleSubmit as any}
								activeOpacity={0.8}
								style={[styles.signInButton, { backgroundColor: theme.colors.primary[400] }]}>
								<Text style={[styles.signInButtonText, { color: theme.colors.white }]}>
									Sign In
								</Text>
							</TouchableOpacity>
							<View style={{ marginTop: moderateScale(30) }}>
								<TouchableOpacity activeOpacity={0.7} onPress={goToSignUp}>
									<Text style={[styles.signUpText, { color: theme.colors.primary[300] }]}>
										Don't have an account?{' '}
										<Text
											style={{
												color: theme.colors.primary[400],
											}}>
											Click here
										</Text>
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</Formik>
			</KeyboardAwareScrollView>
			<Loader text="Authorizing..." visible={loading} />
		</LinearGradient>
	)
}

export default SignInPage

const stylesheet = createStyleSheet({
	error: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
		marginTop: moderateScale(5),
	},
	signInButton: {
		marginTop: moderateScale(20),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: moderateScale(10),
		borderRadius: moderateScale(5),
	},
	signInButtonText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(18),
	},
	form: {
		width: '100%',
		paddingVertical: moderateScale(20),
		paddingHorizontal: moderateScale(15),
		borderRadius: moderateScale(10),
		rowGap: moderateScale(10),
	},
	formikContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: moderateScale(15),
	},
	signUpText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(16),
	},
})
