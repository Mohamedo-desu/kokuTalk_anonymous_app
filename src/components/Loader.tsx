import { BlurView } from 'expo-blur'
import React from 'react'
import { ActivityIndicator, Modal, Text, View } from 'react-native'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const Loader = ({ visible, text }: { visible: boolean; text?: string }) => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<Modal visible={visible} transparent animationType="fade">
			<BlurView intensity={4} style={styles.blurContainer} experimentalBlurMethod="dimezisBlurView">
				<View style={[styles.modalContent, { backgroundColor: theme.colors.primary[300] }]}>
					<ActivityIndicator size={moderateScale(28)} color={theme.colors.primary[400]} />
					{text && (
						<Text
							style={{
								fontFamily: 'Regular',
								fontSize: moderateScale(14),
								color: theme.colors.white,
							}}>
							{text}
						</Text>
					)}
				</View>
			</BlurView>
		</Modal>
	)
}

export default Loader

const stylesheet = createStyleSheet({
	modalContent: {
		width: '40%',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		height: moderateVerticalScale(100),
		borderRadius: moderateScale(10),
	},

	blurContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
})
