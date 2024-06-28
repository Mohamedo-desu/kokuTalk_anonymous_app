import { useUserStoreSelectors } from '@/store/useUserStore'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const GenderSetup = ({
	handleGoNext,
	handleGoBack,
}: {
	handleGoNext: () => void
	handleGoBack: () => void
}) => {
	const { theme, styles } = useStyles(stylesheet)

	const setGender = useUserStoreSelectors.use.setGender()
	const gender = useUserStoreSelectors.use.gender()

	const [isValid, setIsValid] = useState(gender.trim().length > 0 ? true : false)

	const handleSelectGender = (gender: string) => {
		setGender(gender)
		setIsValid(true)
	}
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<TouchableOpacity
					onPress={() => handleSelectGender('female')}
					activeOpacity={0.7}
					style={{ alignItems: 'center', rowGap: moderateScale(20) }}>
					<View
						style={[
							styles.iconButton,
							{
								backgroundColor: gender === 'female' ? theme.colors.white : 'rgba(255,255,255,.1)',
							},
						]}>
						<SimpleLineIcons
							name="symbol-female"
							size={moderateScale(60)}
							color={theme.colors.primary[500]}
						/>
					</View>
					<Text
						style={[
							styles.iconButtonText,
							{ color: gender === 'female' ? theme.colors.white : 'rgba(255,255,255,.3)' },
						]}>
						Female
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => handleSelectGender('male')}
					activeOpacity={0.7}
					style={{ alignItems: 'center', rowGap: moderateScale(20) }}>
					<View
						style={[
							styles.iconButton,
							{
								backgroundColor: gender === 'male' ? theme.colors.white : 'rgba(255,255,255,.1)',
							},
						]}>
						<SimpleLineIcons
							name="symbol-male"
							size={moderateScale(60)}
							color={theme.colors.primary[500]}
						/>
					</View>
					<Text
						style={[
							styles.iconButtonText,
							{ color: gender === 'male' ? theme.colors.white : 'rgba(255,255,255,.3)' },
						]}>
						Male
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.footer}>
				<TouchableOpacity
					onPress={handleGoBack}
					activeOpacity={0.7}
					style={[styles.button, { backgroundColor: theme.colors.primary[400] }]}>
					<Text style={[styles.buttonText, { color: theme.colors.white }]}>BACK</Text>
				</TouchableOpacity>
				<TouchableOpacity
					disabled={!isValid}
					activeOpacity={0.7}
					onPress={handleGoNext}
					style={[styles.button, { backgroundColor: theme.colors.primary[400] }]}>
					<Text style={[styles.buttonText, { color: theme.colors.white }]}>NEXT</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default GenderSetup

const stylesheet = createStyleSheet({
	button: {
		width: moderateScale(100),
		aspectRatio: 1,
		borderRadius: moderateScale(50),
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(18),
		letterSpacing: 1,
	},
	container: {
		flex: 1,
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		flexGrow: 1,
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	iconButton: {
		width: moderateScale(150),
		aspectRatio: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: moderateScale(75),
	},
	iconButtonText: {
		fontFamily: 'Medium',
		fontSize: moderateScale(24),
	},
})
