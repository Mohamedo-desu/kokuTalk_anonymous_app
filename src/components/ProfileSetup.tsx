import { PROFILE_AVATARS } from '@/constants'
import { useUserStoreSelectors } from '@/store/useUserStore'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ProfileSetup = ({
	handleGoNext,
	handleGoBack,
}: {
	handleGoNext: () => void
	handleGoBack: () => void
}) => {
	const { theme, styles } = useStyles(stylesheet)

	const setProfile = useUserStoreSelectors.use.setProfile()
	const profile = useUserStoreSelectors.use.profile()

	const [isValid, setIsValid] = useState(profile.trim().length > 0 ? true : false)

	const handleSelectprofile = (avatar: string) => {
		setProfile(avatar)
		setIsValid(true)
	}
	return (
		<View style={styles.container}>
			<View style={styles.content}>
				{PROFILE_AVATARS.map((avatar, index) => (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => handleSelectprofile(avatar)}
						style={[
							styles.avatar,
							{
								backgroundColor:
									profile === avatar ? theme.colors.white : theme.colors.primary[400],
							},
						]}>
						<Image
							key={avatar}
							source={{ uri: avatar }}
							contentFit="scale-down"
							transition={100 * index}
							style={styles.image}
							alt="avatar"
						/>
						{profile === avatar && (
							<Ionicons
								name="checkmark-circle"
								size={moderateScale(20)}
								color={theme.colors.primary[500]}
								style={styles.mark}
							/>
						)}
					</TouchableOpacity>
				))}
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

export default ProfileSetup

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
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		alignContent: 'center',
		flexWrap: 'wrap',
		gap: moderateScale(15),
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	avatar: {
		width: moderateScale(100),
		aspectRatio: 1,
		borderRadius: moderateScale(5),
		justifyContent: 'center',
		alignItems: 'center',
	},
	mark: { position: 'absolute', top: '5%', right: '5%' },
	image: { width: moderateScale(80), height: '100%' },
})
