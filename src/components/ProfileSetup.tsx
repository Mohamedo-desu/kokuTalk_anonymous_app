import { FEMALE_AVATARS, MALE_AVATARS } from '@/constants/userAvatars'
import { signUpStore } from '@/store/authStore'
import { useUserStoreSelectors } from '@/store/useUserStore'
import { DEVICE_WIDTH } from '@/utils'
import { Ionicons } from '@expo/vector-icons'

import { ForwardedRef, forwardRef, useMemo, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const ProfileSetup = forwardRef(
	({ activeIndex }: { activeIndex: number }, ref: ForwardedRef<FlatList<any> | null>) => {
		const { theme, styles } = useStyles(stylesheet)

		const updateUser = useUserStoreSelectors.use.updateUser()
		const { profile, age, gender, userName, password, email, displayName } =
			useUserStoreSelectors.use.userData()

		const PROFILE_AVATARS = useMemo(() => {
			return gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS
		}, [gender])

		const [isValid, setIsValid] = useState(profile?.trim().length > 0 ? true : false)

		const handleSelectprofile = (profile: string) => {
			updateUser({ profile })
			setIsValid(true)
		}

		const handleSignUp = async () => {
			if (!isValid) return

			signUpStore({ displayName, email, userName, password, gender, age, profile })
		}
		const handleGoBack = async () => {
			if (ref && 'current' in ref && ref.current) {
				ref?.current?.scrollToIndex({ index: activeIndex - 1, animated: true })
			}
		}

		return (
			<View style={styles.container}>
				<View style={styles.content}>
					{PROFILE_AVATARS.map((avatar, index) => (
						<TouchableOpacity
							key={avatar}
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
								resizeMode="contain"
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
						onPress={handleSignUp}
						style={[styles.button, { backgroundColor: theme.colors.primary[400] }]}>
						<Text style={[styles.buttonText, { color: theme.colors.white }]}>NEXT</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	},
)

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
		width: DEVICE_WIDTH,
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
		width: '95%',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '95%',
	},
	avatar: {
		width: moderateScale(100),
		aspectRatio: 1,
		borderRadius: moderateScale(5),
		justifyContent: 'center',
		alignItems: 'center',
		margin: moderateScale(5),
	},
	mark: { position: 'absolute', top: '5%', right: '5%' },
	image: { width: moderateScale(80), height: '100%' },
})
