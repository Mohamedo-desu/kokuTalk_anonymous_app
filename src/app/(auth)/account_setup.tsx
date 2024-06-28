import AgeSetup from '@/components/AgeSetup'
import GenderSetup from '@/components/GenderSetup'
import ProfileSetup from '@/components/ProfileSetup'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Animated, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { UnistylesRuntime, createStyleSheet, useStyles } from 'react-native-unistyles'

const STEPS = [
	{
		index: 0,
		id: 'gender',
		component: GenderSetup,
	},
	{
		index: 1,
		id: 'Age',
		component: AgeSetup,
	},
	{
		index: 2,
		id: 'Profile',
		component: ProfileSetup,
	},
]

const AccountSetupPage = () => {
	const { theme, styles } = useStyles(stylesheet)
	const [loading, setLoading] = useState(false)
	const [activeOption, setActiveOption] = useState(STEPS[0])

	useEffect(() => {
		// Set the color of the status bar
		UnistylesRuntime.statusBar.setColor(theme.colors.primary[300])
		// Set the color of the navigation bar
		UnistylesRuntime.navigationBar.setColor(theme.colors.primary[400])

		// Reset the color of the navigation bar when the component is unmounted
		return () => {
			UnistylesRuntime.navigationBar.setColor(undefined)
		}
	}, [])

	const handleGoBack = () => {
		if (activeOption.index <= STEPS[0].index) {
			return
		} else {
			setActiveOption(STEPS[activeOption.index - 1])
		}
	}
	const handleGoNext = () => {
		if (activeOption.index >= STEPS.length - 1) {
			return
		} else {
			setActiveOption(STEPS[activeOption.index + 1])
		}
	}
	const RenderOption = (option: (typeof STEPS)[0]) => {
		return <option.component handleGoNext={handleGoNext} handleGoBack={handleGoBack} />
	}

	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					style={{
						flex: 1,
					}}
					contentContainerStyle={{
						flexGrow: 1,
					}}>
					<View style={styles.content}>
						{STEPS.map((step) => (
							<Animated.View
								key={step.id}
								style={[
									styles.step,
									{
										backgroundColor:
											step.index <= activeOption.index
												? theme.colors.primary[400]
												: 'rgba(255, 255, 255, 0.2)',
									},
								]}
							/>
						))}
					</View>
					{RenderOption(activeOption)}
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	)
}

export default AccountSetupPage

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		paddingBottom: moderateScale(10),
		paddingHorizontal: moderateScale(15),
		paddingTop: moderateScale(10),
	},
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		columnGap: moderateScale(5),
	},
	step: {
		height: moderateScale(5),
		flex: 1,
		borderRadius: moderateScale(5),
	},
})
