import React from 'react'
import { ActivityIndicator, Modal, Text, View } from 'react-native'

import { BlurView } from 'expo-blur'
import { moderateScale, moderateVerticalScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const Loader = ({ visible, text }: { visible: boolean; text: string }) => {
	const { theme, styles } = useStyles(stylesheet)
	return (
		<Modal visible={visible} transparent animationType="fade">
			<BlurView intensity={5} style={styles.blurContainer} experimentalBlurMethod="dimezisBlurView">
				<View style={[styles.modalContent, { backgroundColor: theme.colors.gray[200] }]}>
					<ActivityIndicator size={moderateScale(28)} color={theme.colors.primary[500]} />
					{text && (
						<Text
							style={{
								fontFamily: 'Bold',
								fontSize: moderateScale(17),
								color: theme.colors.typography,
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
		width: '50%',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		height: moderateVerticalScale(120),
		borderRadius: moderateScale(10),
	},

	blurContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
})
