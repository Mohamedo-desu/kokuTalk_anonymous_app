import AgeSetup from '@/components/AgeSetup'
import GenderSetup from '@/components/GenderSetup'
import ProfileSetup from '@/components/ProfileSetup'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Animated, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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

	const renderOption = (option: any) => {
		return <option.component />
	}

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

	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={{ flex: 1 }}>
			<SafeAreaView
				style={{
					flex: 1,
					paddingBottom: moderateScale(10),
					paddingHorizontal: moderateScale(15),
				}}>
				<ScrollView
					keyboardShouldPersistTaps="handled"
					style={{
						flex: 1,
					}}
					contentContainerStyle={{
						flexGrow: 1,
					}}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							width: '100%',
							columnGap: moderateScale(5),
						}}>
						{STEPS.map((step) => (
							<Animated.View
								key={step.id}
								style={{
									backgroundColor:
										step.index <= activeOption.index
											? theme.colors.primary[400]
											: 'rgba(255, 255, 255, 0.2)',
									height: moderateScale(5),
									flex: 1,
									borderRadius: moderateScale(5),
								}}
							/>
						))}
					</View>
					{renderOption(activeOption)}
				</ScrollView>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}>
					<TouchableOpacity
						onPress={handleGoBack}
						activeOpacity={0.7}
						style={[styles.button, { backgroundColor: theme.colors.primary[400] }]}>
						<Text style={[styles.buttonText, { color: theme.colors.white }]}>BACK</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={handleGoNext}
						style={[styles.button, { backgroundColor: theme.colors.primary[400] }]}>
						<Text style={[styles.buttonText, { color: theme.colors.white }]}>NEXT</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</LinearGradient>
	)
}

export default AccountSetupPage

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
})
