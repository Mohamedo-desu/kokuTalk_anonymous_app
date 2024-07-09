import * as Yup from 'yup'

export const SignUpValidationSchema = Yup.object().shape({
	display_name: Yup.string().min(3).max(15).required().label('display name'),
	email: Yup.string()
		.email()
		.required()
		.label('email')
		.test('email', 'Invalid email address', (value) => {
			return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
		}),
	user_name: Yup.string()
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
export const SignInValidationSchema = Yup.object().shape({
	email: Yup.string().email().required().label('email'),
	password: Yup.string().min(8).max(35).required().label('password'),
})
