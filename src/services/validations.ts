import * as Yup from 'yup'

export const SignUpValidationSchema = Yup.object().shape({
	email: Yup.string()
		.email()
		.required()
		.label('email')
		.test('email', 'Invalid email address', (value) => {
			return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
		}),
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
