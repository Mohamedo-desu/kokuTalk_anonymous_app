import { Ionicons } from '@expo/vector-icons'
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
	icon?: string | null
	errors?: string
	touched?: boolean
	value: string
	onPressRightIcon?: () => void
	handleChange: (value: string) => void
	handleBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
	autoComplete: TextInputProps['autoComplete']
	maxLength?: number
	keyboardType?: TextInputProps['keyboardType']
	secureTextEntry?: boolean
}

const Input = ({
	title,
	icon,
	errors,
	touched,
	value,
	handleChange,
	handleBlur,
	autoComplete,
	maxLength,
	keyboardType,
	secureTextEntry,
	onPressRightIcon,
}: InputProps): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<View style={{ width: '100%' }}>
			<Text style={[styles.label, { color: theme.colors.white }]}>{title}</Text>
			<View style={styles.inputCon}>
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
				{icon && (
					<Ionicons
						name={icon}
						size={moderateScale(25)}
						color={theme.colors.primary[500]}
						onPress={onPressRightIcon}
					/>
				)}
			</View>
			{errors && touched ? (
				<Text style={[styles.error, { color: theme.colors.error }]}>{errors}</Text>
			) : null}
		</View>
	)
}

export default Input

const stylesheet = createStyleSheet({
	label: {
		opacity: 0.2,
		fontFamily: 'Regular',
		fontSize: moderateScale(15),
	},
	inputCon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'rgba(255,255,255,.05)',
		padding: moderateScale(10),
		borderRadius: moderateScale(5),
		fontSize: moderateScale(16),
	},
	input: {
		flex: 1,
		fontSize: moderateScale(16),
	},
	error: {
		fontFamily: 'Regular',
		fontSize: moderateScale(11),
		marginTop: moderateScale(1),
	},
})
