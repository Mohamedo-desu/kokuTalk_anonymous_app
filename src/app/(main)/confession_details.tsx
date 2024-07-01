import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ConfessionDetails = () => {
	const { id }: { id: string } = useLocalSearchParams()
	const { theme, styles } = useStyles(stylesheet)

	useEffect(() => {
		// TODO: get the confession details
	}, [id])

	return (
		<View style={styles.container}>
			<Text
				style={{
					color: theme.colors.typography,
					fontFamily: 'Medium',
					fontSize: moderateScale(20),
				}}>
				id:{id}
			</Text>
		</View>
	)
}

export default ConfessionDetails

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
})
