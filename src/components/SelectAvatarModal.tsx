import { BLUR_HASH, FEMALE_AVATARS, MALE_AVATARS } from '@/constants'
import { useUserStoreSelectors } from '@/store/useUserStore'
import { Ionicons } from '@expo/vector-icons'
import { DrawerActions } from '@react-navigation/native'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from 'expo-router'
import React, { useMemo } from 'react'
import { Modal, TouchableOpacity } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const SelectAvatarModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
	const { theme, styles } = useStyles(stylesheet)
	const navigation = useNavigation()
	const { profile, gender } = useUserStoreSelectors.use.userData()
	const updateUser = useUserStoreSelectors.use.updateUser()

	const handleSelectprofile = React.useCallback(
		(profile: string) => {
			updateUser({ profile })
			navigation.dispatch(DrawerActions.closeDrawer())
			onClose()
		},
		[onClose, navigation],
	)

	const PROFILE_AVATARS = useMemo(() => {
		return gender === 'male' ? MALE_AVATARS : FEMALE_AVATARS
	}, [gender])

	return (
		<Modal visible={visible} transparent animationType="slide">
			<BlurView intensity={5} style={styles.blurContainer} experimentalBlurMethod="dimezisBlurView">
				<LinearGradient
					colors={[theme.colors.background, theme.colors.gray[100]]}
					start={{ x: 0.5, y: 1 }}
					end={{ x: 0.5, y: 0 }}
					style={styles.content}>
					{PROFILE_AVATARS.map((avatar, index) => (
						<TouchableOpacity
							key={avatar}
							activeOpacity={0.7}
							onPress={() => handleSelectprofile(avatar)}
							style={[
								styles.avatar,
								{
									backgroundColor:
										profile === avatar ? theme.colors.primary[500] : 'rgba(255,255,255,0.1)',
								},
							]}>
							<Image
								key={avatar}
								source={{ uri: avatar }}
								contentFit="contain"
								transition={100 * index}
								style={styles.image}
								alt="avatar"
								placeholder={BLUR_HASH}
							/>
							{profile === avatar && (
								<Ionicons
									name="checkmark-circle"
									size={moderateScale(20)}
									color={theme.colors.white}
									style={styles.mark}
								/>
							)}
						</TouchableOpacity>
					))}
				</LinearGradient>
			</BlurView>
		</Modal>
	)
}

export default SelectAvatarModal

const stylesheet = createStyleSheet({
	content: {
		width: '95%',
		padding: moderateScale(10),
		gap: moderateScale(10),
		borderRadius: moderateScale(10),
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		alignContent: 'center',
		flexWrap: 'wrap',
	},
	blurContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	avatar: {
		width: moderateScale(100),
		aspectRatio: 1,
		borderRadius: moderateScale(5),
		justifyContent: 'center',
		alignItems: 'center',
	},
	mark: { position: 'absolute', top: '2%', right: '2%' },
	image: { width: moderateScale(80), height: '100%' },
})
