import React, { PropsWithChildren } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { ToastProvider as Toast } from 'react-native-toast-notifications'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ToastProvider = ({ children }: PropsWithChildren) => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<Toast
			placement="top"
			duration={5000}
			animationType="zoom-in"
			animationDuration={100}
			successColor={theme.colors.success}
			dangerColor={theme.colors.error}
			warningColor={theme.colors.warning}
			normalColor={theme.colors.gray[200]}
			style={styles.toast}
			textStyle={styles.text}
			swipeEnabled>
			{children}
		</Toast>
	)
}

export default ToastProvider

const stylesheet = createStyleSheet({
	text: {
		textAlign: 'center',
		fontFamily: 'Regular',
		fontSize: moderateScale(12),
	},
	toast: {
		top: '10%',
		borderRadius: moderateScale(10),
	},
})
