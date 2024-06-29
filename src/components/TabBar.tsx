import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import TabBarButton from './TabBarButton'

/**
 * Renders a tab bar component with linear gradient background.
 *
 * @param {object} props - The props object containing the following properties:
 *      - state: The state object of the navigation.
 *      - descriptors: The descriptors object of the navigation.
 *      - navigation: The navigation object.
 * @returns {JSX.Element} The rendered tab bar component.
 */
const TabBar = ({
	state,
	descriptors,
	navigation,
}: {
	state: {
		routes: {
			key: string
			name: string
			params?: object
		}[]
		index: number
	}
	descriptors: {
		[key: string]: {
			options: {
				tabBarLabel?: string
				title?: string
			}
		}
	}
	navigation: {
		emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => {
			defaultPrevented: boolean
		}
		navigate: (routeName: string, params?: object) => void
	}
}): JSX.Element => {
	const { theme, styles } = useStyles(stylesheet)
	const insets = useSafeAreaInsets()
	const { routes, index } = state
	const { emit, navigate } = navigation
	const isFocused = (routeName: string) => routes[index].name === routeName

	const handlePress = (routeName: string) => {
		const event = emit({
			type: 'tabPress',
			target: routeName,
			canPreventDefault: true,
		})

		if (!isFocused(routeName) && !event.defaultPrevented) {
			navigate(routeName, routes[index].params)
		}
	}

	return (
		<LinearGradient
			style={[styles.tabBar, { marginBottom: insets.bottom + moderateScale(10) }]}
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0.5, y: 1 }}
			end={{ x: 0.5, y: 0 }}>
			{routes.map((route) => {
				if (['_sitemap', '+not-found'].includes(route.name)) return null

				const { options } = descriptors[route.key]
				const label = options.tabBarLabel || options.title || route.name
				const isCurrent = isFocused(route.name)
				const color = isCurrent ? theme.colors.white : 'rgba(255,255,255,.3)'

				return (
					<TabBarButton
						key={route.name}
						onPress={() => handlePress(route.name)}
						onLongPress={() => emit({ type: 'tabLongPress', target: route.key })}
						isFocused={isCurrent}
						routeName={route.name}
						color={color}
					/>
				)
			})}
		</LinearGradient>
	)
}

const stylesheet = createStyleSheet({
	tabBar: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: moderateScale(55),
		marginHorizontal: moderateScale(15),
		borderRadius: moderateScale(40),
		borderCurve: 'circular',
	},
})

export default TabBar
