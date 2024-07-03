import React from 'react'
import {
	NativeSyntheticEvent,
	Text,
	TextInput,
	TextInputFocusEventData,
	TextInputProps,
	View,
} from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

interface InputProps {
	title: string
	errors?: string
	touched?: boolean
	value: string
	handleChange: (value: string) => void
	handleBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
	autoComplete: TextInputProps['autoComplete']
	maxLength?: number
	keyboardType?: TextInputProps['keyboardType']
	secureTextEntry?: boolean
}

const Input = ({
	title,
	errors,
	touched,
	value,
	handleChange,
	handleBlur,
	autoComplete,
	maxLength,
	keyboardType,
	secureTextEntry,
}: InputProps): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<View style={{ width: '100%' }}>
			<Text style={[styles.label, { color: theme.colors.white }]}>{title}</Text>
			<TextInput
				value={value}
				onChangeText={handleChange}
				onBlur={handleBlur}
				keyboardType={keyboardType || 'default'}
				autoCapitalize="none"
				style={[styles.input, { color: theme.colors.white }]}
				cursorColor={theme.colors.primary[500]}
				autoComplete={autoComplete}
				maxLength={maxLength}
				numberOfLines={1}
				secureTextEntry={secureTextEntry || false}
			/>
			{errors && touched ? (
				<Text style={[styles.error, { color: theme.colors.error }]}>{errors}</Text>
			) : null}
		</View>
	)
}

export default Input

const stylesheet = createStyleSheet({
	label: {
		opacity: 0.3,
		fontFamily: 'Medium',
		fontSize: moderateScale(16),
	},
	input: {
		backgroundColor: 'rgba(255,255,255,.1)',
		padding: moderateScale(10),
		borderRadius: moderateScale(5),
		fontSize: moderateScale(18),
	},
	error: {
		fontFamily: 'Italic',
		fontSize: moderateScale(14),
		marginTop: moderateScale(5),
		opacity: 0.7,
	},
})
