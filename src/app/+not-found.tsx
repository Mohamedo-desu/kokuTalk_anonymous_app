import { Link, Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

export default function NotFoundScreen() {
	const { styles } = useStyles(stylesheet)

	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View>
				<Text style={styles.title}>This screen doesn&apos;t exist.</Text>
				<Link href="/" style={styles.link}>
					<Text style={styles.linkText}>Go to home screen!</Text>
				</Link>
			</View>
		</>
	)
}

const stylesheet = createStyleSheet({
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	link: {
		marginTop: 16,
		paddingVertical: 16,
	},
	linkText: {
		fontSize: 14,
		color: '#2e78b7',
	},
})
