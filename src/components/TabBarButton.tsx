import { icons } from '@/assets/icons/icons'
import React, { useEffect } from 'react'
import { Pressable } from 'react-native'
import Animated, {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

const TabBarButton = (props: {
	isFocused: boolean | ((name: string) => boolean)
	routeName: string
	color: string
	onPress: () => void
	onLongPress: () => void
}): JSX.Element => {
	const { isFocused, routeName, color } = props

	const { styles } = useStyles(stylesheet)

	const scale = useSharedValue<number>(0)

	useEffect(() => {
		const focusedValue = typeof isFocused === 'boolean' ? isFocused : isFocused(routeName)
		const focusedValueNumber = focusedValue ? 1 : 0

		scale.value = withTiming(focusedValueNumber, {
			duration: 50,
		})
	}, [scale, isFocused, routeName])

	const animatedIconStyle = useAnimatedStyle(() => {
		const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4])

		return {
			transform: [{ scale: scaleValue }],
		}
	})

	return (
		<Pressable {...props} style={styles.container}>
			<Animated.View style={[animatedIconStyle]}>
				{icons[routeName]({
					color,
					isFocused: typeof isFocused === 'boolean' ? isFocused : isFocused(routeName),
				})}
			</Animated.View>
		</Pressable>
	)
}

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
})

export default TabBarButton
