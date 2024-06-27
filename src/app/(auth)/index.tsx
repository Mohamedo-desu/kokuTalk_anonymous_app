import React from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { useStyles } from 'react-native-unistyles'

const Auth = () => {
	const { theme } = useStyles()
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text
				style={{ color: theme.colors.typography, fontSize: moderateScale(28), fontFamily: 'Bold' }}>
				Auth
			</Text>
		</View>
	)
}

export default Auth
