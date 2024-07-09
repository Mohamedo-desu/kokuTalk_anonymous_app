import { useAuthStoreSelectors } from '@/store/authStore'
import { deleteStoredValues } from '@/utils/storageUtils'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Modal, Text, TouchableOpacity } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const GuestModal = ({ visible, onPress }: { visible: boolean; onPress: () => void }) => {
	const { theme, styles } = useStyles(stylesheet)

	const logOut = useAuthStoreSelectors.use.logOut()

	const handleContinue = async () => {
		await deleteStoredValues(['isAnonymous'])
		logOut()
	}
	return (
		<Modal visible={visible} transparent animationType="fade">
			<BlurView intensity={5} style={styles.blurContainer} experimentalBlurMethod="dimezisBlurView">
				<TouchableOpacity style={styles.gradientWrapper} activeOpacity={0.8} onPress={onPress}>
					<LinearGradient
						colors={[theme.colors.primary[400], theme.colors.primary[500]]}
						start={{ x: 0.5, y: 1 }}
						end={{ x: 0.5, y: 0 }}
						style={styles.content}>
						<Text style={[styles.title, { color: theme.colors.white }]}>
							You are Guest Browsing!
						</Text>
						<Text style={[styles.subTitle, { color: theme.colors.white }]}>
							Please Signin to continue
						</Text>
						<TouchableOpacity
							activeOpacity={0.8}
							onPress={handleContinue}
							style={[styles.button, { backgroundColor: theme.colors.primary[500] }]}>
							<Text style={[styles.buttonText, { color: theme.colors.white }]}>Sign In</Text>
						</TouchableOpacity>
					</LinearGradient>
				</TouchableOpacity>
			</BlurView>
		</Modal>
	)
}

export default GuestModal

const stylesheet = createStyleSheet({
	content: {
		width: '80%',
		padding: moderateScale(10),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: moderateScale(10),
	},
	blurContainer: {
		flex: 1,
		overflow: 'hidden',
	},
	gradientWrapper: { flex: 1, flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
	title: {
		fontSize: moderateScale(22),
		fontFamily: 'Bold',
		textAlign: 'center',
	},
	subTitle: {
		fontSize: moderateScale(16),
		fontFamily: 'Regular',
		textAlign: 'center',
		marginTop: moderateScale(10),
	},
	button: {
		padding: moderateScale(15),
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: moderateScale(10),
	},
	buttonText: {
		fontSize: moderateScale(18),
		fontFamily: 'Medium',
		textAlign: 'center',
	},
})
