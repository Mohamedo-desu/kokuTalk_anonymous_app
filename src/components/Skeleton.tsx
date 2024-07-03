import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useMemo, useRef } from 'react'
import { Animated, StyleProp, View, ViewStyle } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

/**
 * Renders a skeleton component with animation.
 * @param {Object} props - The component props.
 * @param {number} props.width - The width of the component.
 * @param {number} props.height - The height of the component.
 * @param {StyleProp<ViewStyle>} props.style - Additional styles for the component.
 * @returns {JSX.Element} The skeleton component.
 */
type SkeletonProps = {
	width: number
	height: number | 'auto' | `${number}%` | undefined
	style?: StyleProp<ViewStyle>
}

const Skeleton: React.FC<SkeletonProps> = React.memo(({ width, height, style }) => {
	const { theme, styles } = useStyles(stylesheet)
	const translateX = useRef(new Animated.Value(-width)).current

	useEffect(() => {
		const loopAnimation = Animated.loop(
			Animated.timing(translateX, {
				toValue: width,
				duration: 400,
				useNativeDriver: true,
			}),
		)

		loopAnimation.start()

		return () => loopAnimation.stop()
	}, [translateX, width])

	const gradientStyles = useMemo(
		() => ({
			width: '100%',
			height: '100%',
			transform: [{ translateX }],
		}),
		[translateX],
	)

	return (
		<View
			style={[styles.skeleton, { backgroundColor: theme.colors.gray[100], width, height }, style]}>
			<Animated.View style={gradientStyles}>
				<LinearGradient
					colors={['transparent', theme.colors.gray[300], 'transparent']}
					style={{ width: '100%', height: '100%' }}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
			</Animated.View>
		</View>
	)
})

export default Skeleton

const stylesheet = createStyleSheet({
	skeleton: {
		borderRadius: moderateScale(10),
		overflow: 'hidden',
	},
})
