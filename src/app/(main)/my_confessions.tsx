import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
const MyConfessions = () => {
	const { theme, styles } = useStyles(stylesheet)

	useEffect(() => {
		//TODO fetch my confessions
	}, [])

	return (
		<View style={styles.container}>
			<Text
				style={{
					color: theme.colors.typography,
					fontFamily: 'Medium',
					fontSize: moderateScale(20),
				}}>
				My Confessions
			</Text>
		</View>
	)
}

export default MyConfessions

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
