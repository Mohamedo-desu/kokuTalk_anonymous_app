import Input from '@/components/Input'
import Loader from '@/components/Loader'
import { signInFirebase } from '@/services/authActions'
import { SignInValidationSchema } from '@/services/validations'
import { useAuthStoreSelectors } from '@/store/authStore'
import { DEVICE_WIDTH } from '@/utils'
import { getStoredValues, saveSecurely } from '@/utils/storageUtils'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { moderateScale } from 'react-native-size-matters'
import { Toast } from 'react-native-toast-notifications'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SignInPage = forwardRef((_, ref: ForwardedRef<FlatList<any> | null>) => {
	const { theme, styles } = useStyles(stylesheet)
	const [loading, setLoading] = useState(false)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const updateUser = useAuthStoreSelectors.use.updateUser()

	const handleSignIn = async ({ email, password }: { email: string; password: string }) => {
		try {
			setLoading(true)

			saveSecurely([
				{ key: 'email', value: email },
				{ key: 'password', value: password },
			])

			const user = await signInFirebase({
				email,
				password,
			})

			updateUser(user)

			setLoading(false)
		} catch (error) {
			setLoading(false)
			Toast.show(`${error}`, {
				type: 'danger',
			})
		}
	}

	const goToSignUp = () => {
		if (ref && 'current' in ref && ref.current) {
			ref.current.scrollToEnd({ animated: true })
		}
	}

	useEffect(() => {
		const fetchStoredValues = async () => {
			const { email, password } = await getStoredValues(['email', 'password'])

			setEmail(email || '')
			setPassword(password || '')
		}
		fetchStoredValues()
	}, [])

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
					initialValues={{ email, password }}
					enableReinitialize
					validationSchema={SignInValidationSchema}
					onSubmit={(values) => handleSignIn(values)}>
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
			<Loader text="Signing in..." visible={loading} />
		</LinearGradient>
	)
})

export default SignInPage

const stylesheet = createStyleSheet({
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
		fontFamily: 'Regular',
		fontSize: moderateScale(13),
	},
})
