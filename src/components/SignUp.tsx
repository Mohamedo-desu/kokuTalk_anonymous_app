import Input from '@/components/Input'
import { SignUpValidationSchema } from '@/services/validations'
import { useAuthStoreSelectors } from '@/store/authStore'
import { DEVICE_WIDTH } from '@/utils'
import { saveSecurely } from '@/utils/storageUtils'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Formik } from 'formik'
import React, { ForwardedRef, forwardRef, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import Loader from './Loader'

const SignUpPage = forwardRef((_, ref: ForwardedRef<FlatList<any> | null>) => {
	const { theme, styles } = useStyles(stylesheet)
	const [loading, setLoading] = useState(false)
	const [loadingText, setLoadingText] = useState('')

	const [showPassword, setShowPassword] = useState(false)

	const updateUser = useAuthStoreSelectors.use.updateUser()
	const setAnonymous = useAuthStoreSelectors.use.setAnonymous()

	const handleSignUp = async ({ email, password }: { email: string; password: string }) => {
		updateUser({ email, password })
		router.navigate('/(auth)/modal')
	}

	const goToSignIn = () => {
		if (ref && 'current' in ref && ref.current) {
			ref.current.scrollToIndex({ index: 0, animated: true })
		}
	}
	const handleSkip = async () => {
		setLoadingText('Skipping...')
		setLoading(true)
		await saveSecurely([{ key: 'isAnonymous', value: 'true' }])

		setLoadingText('')
		setLoading(false)
		setAnonymous()
	}

	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={{ flex: 1, width: DEVICE_WIDTH }}>
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				style={{
					flex: 1,
				}}
				contentContainerStyle={{
					flexGrow: 1,
				}}>
				<Formik
					initialValues={{
						email: '',
						password: '',
					}}
					enableReinitialize
					validationSchema={SignUpValidationSchema}
					onSubmit={(values) => handleSignUp(values)}>
					{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
						<View style={styles.formikContainer}>
							<View style={[styles.form, { backgroundColor: theme.colors.primary[500] }]}>
								<Input
									title="Email"
									errors={errors.email}
									touched={touched.email}
									value={values.email}
									handleChange={handleChange('email')}
									handleBlur={handleBlur('email')}
									autoComplete={'email'}
								/>

								<Input
									title="Password"
									errors={errors.password}
									touched={touched.password}
									value={values.password}
									handleChange={handleChange('password')}
									handleBlur={handleBlur('password')}
									autoComplete={'new-password'}
									maxLength={35}
									secureTextEntry={!showPassword}
									icon={showPassword ? 'eye-off' : 'eye'}
									onPressRightIcon={() => setShowPassword(!showPassword)}
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
							<TouchableOpacity
								onPress={handleSkip}
								activeOpacity={0.8}
								style={[styles.signUpButton, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
								<Text style={[styles.signUpButtonText, { color: 'rgba(255, 255, 255, 0.8)' }]}>
									Skip
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
							<View style={styles.privacyContainer}>
								<TouchableOpacity activeOpacity={0.7} onPress={goToSignIn}>
									<Text style={[styles.text, { color: theme.colors.primary[300] }]}>
										By continuing, you acknowledge that you have read and agree to our{' '}
										<Text
											style={[styles.linkText, { color: theme.colors.primary[400] }]}
											onPress={() => {}}>
											Terms & Conditions
										</Text>{' '}
										and{' '}
										<Text
											style={[styles.linkText, { color: theme.colors.primary[400] }]}
											onPress={() => {}}>
											Privacy Policy
										</Text>
										.
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</Formik>
			</KeyboardAwareScrollView>
			<Loader visible={loading} text={loadingText} />
		</LinearGradient>
	)
})

export default SignUpPage

const stylesheet = createStyleSheet({
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
		fontFamily: 'Regular',
		fontSize: moderateScale(13),
	},
	privacyContainer: {
		position: 'absolute',
		bottom: '10%',
		left: '5%',
		right: '5%',
		alignItems: 'center',
	},
	text: {
		fontSize: 14,
		textAlign: 'center',
	},
	linkText: {
		fontWeight: 'bold',
	},
})
