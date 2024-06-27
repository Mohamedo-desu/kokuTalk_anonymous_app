import { FormikProps } from 'formik'
import { ColorSchemeName } from 'react-native'

export interface User {
	uid: string
	displayName: string
	email: string
	emailVerified: boolean
	password: string
	photoURL: string
	settings: SettingsProps
	followers: string[]
	followings: string[]
	notifications: NotificationsProps[] | any
	createdAt: string
	updatedAt: string
	pushTokens: string[]
	rTokenTimerIntervalId?: string
	agreedToTerms: boolean
}

export interface SettingsProps {
	theme: ColorSchemeName
	notificationsEnabled: boolean
}
export interface NotificationsProps {
	from: string
	to: string
	content: string
	isNew: boolean
	isCleared: boolean
}

export interface OnboardingSlideProps {
	id: string
	image: string
	title: string
	description: string
}

export type ForgotPasswordProps = { email: string }
export type ResetPasswordProps = {
	resetCode: string
	password: string
	email?: string | string[]
}
export type ForgotPasswordFormikProps = FormikProps<{ email: string }> | null

export type ResetPasswordFormikProps = FormikProps<{
	resetCode: string
	password: string
	confirmPassword: string
}> | null

export type SignInResult = {
	user: User
	rTokenTimerIntervalId: NodeJS.Timeout
}
