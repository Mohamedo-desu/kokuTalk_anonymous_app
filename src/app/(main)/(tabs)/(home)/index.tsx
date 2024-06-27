import { Text, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
const HomePage = () => {
	const { theme, styles } = useStyles(stylesheet)

	return (
		<View style={styles.container}>
			<Text>Home</Text>
		</View>
	)
}

export default HomePage
const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		padding: moderateScale(3),
	},
})
