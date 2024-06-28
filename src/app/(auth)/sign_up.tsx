import Input from '@/components/Input'
import Loader from '@/components/Loader'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { moderateScale } from 'react-native-size-matters'
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
	userName: Yup.string()
		.test('no-white-space', 'user name cannot contain white spaces', (value) => {
			return !/\s/.test(value as string)
		}) // Test if value contains white spaces
		.matches(/^@[^-]/, 'user name must start with "@" symbol')
		.min(3)
		.max(15)
		.required()
		.label('user name'),
	password: Yup.string()
		.min(8)
		.max(35)
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
			'password must contain at least one uppercase letter, one lowercase letter, and one number',
		)
		.required()
		.label('password'),
})

const SignUpPage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Set the color of the status bar
		UnistylesRuntime.statusBar.setColor(theme.colors.primary[300])
		// Set the color of the navigation bar
		UnistylesRuntime.navigationBar.setColor(theme.colors.primary[400])

		// Reset the color of the navigation bar when the component is unmounted
		return () => {
			UnistylesRuntime.navigationBar.setColor(undefined)
		}
	}, [])

	const handleSignUp = async ({ userName, password }: { userName: string; password: string }) => {
		try {
			router.navigate('/account_setup')
		} catch (error) {}
	}

	const goToSignIn = () => {
		router.back()
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
					initialValues={{ userName: '', password: '' }}
					enableReinitialize
					validationSchema={validationSchema}
					onSubmit={(values) => handleSignUp(values)}>
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
									autoComplete={'username-new'}
									maxLength={15}
								/>
								<Input
									title="password"
									errors={errors.password}
									touched={touched.password}
									value={values.password}
									handleChange={handleChange('password')}
									handleBlur={handleBlur('password')}
									autoComplete={'new-password'}
									maxLength={35}
									secureTextEntry={true}
								/>
							</View>

							<TouchableOpacity
								onPress={handleSubmit as any}
								activeOpacity={0.8}
								style={[styles.signUpButton, { backgroundColor: theme.colors.primary[400] }]}>
								<Text style={[styles.signUpButtonText, { color: theme.colors.white }]}>
									Sign Up
								</Text>
							</TouchableOpacity>
							<View style={{ marginTop: moderateScale(30) }}>
								<TouchableOpacity activeOpacity={0.7} onPress={goToSignIn}>
									<Text style={[styles.signInText, { color: theme.colors.primary[300] }]}>
										Have an account already?{' '}
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
			<Loader text="Signing up..." visible={loading} />
		</LinearGradient>
	)
}

export default SignUpPage

const stylesheet = createStyleSheet({
	error: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
		marginTop: moderateScale(5),
	},
	signUpButton: {
		marginTop: moderateScale(20),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		padding: moderateScale(10),
		borderRadius: moderateScale(5),
	},
	signUpButtonText: {
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
	signInText: {
		fontFamily: 'Italic',
		fontSize: moderateScale(16),
	},
})
