import AgeSetup from '@/components/AgeSetup'
import ExpandingDots from '@/components/ExpandingDots'
import GenderSetup from '@/components/GenderSetup'
import ProfileSetup from '@/components/ProfileSetup'
import { DEVICE_WIDTH } from '@/utils'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale } from 'react-native-size-matters'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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
	const flatListRef = useRef<FlatList<(typeof STEPS)[0]>>(null)
	const [activeIndex, setActiveIndex] = useState(0)
	const scrollX = useSharedValue(0)
	const onViewRef = useRef(({ viewableItems }: any) => {
		setActiveIndex(viewableItems[0]?.index || 0)
	})

	const renderItem = useCallback(
		({ item }: { item: (typeof STEPS)[0] }) => {
			return <item.component ref={flatListRef} activeIndex={activeIndex} />
		},
		[activeIndex],
	)
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x
		},
	})

	const RenderContent = () => (
		<Animated.FlatList
			ref={flatListRef}
			data={STEPS}
			onViewableItemsChanged={onViewRef.current}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			horizontal
			onScroll={scrollHandler}
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			scrollEnabled={false}
			alwaysBounceHorizontal
			automaticallyAdjustKeyboardInsets
			centerContent
			directionalLockEnabled
			endFillColor={theme.colors.primary[400]}
			initialNumToRender={2}
			keyboardDismissMode="on-drag"
			keyboardShouldPersistTaps="handled"
			style={styles.container}
			contentContainerStyle={styles.content}
			snapToAlignment="center"
			decelerationRate="normal"
			scrollEventThrottle={16}
			snapToInterval={DEVICE_WIDTH}
		/>
	)
	const RenderSteps = () => (
		<ExpandingDots
			data={STEPS}
			scrollX={scrollX}
			activeDotColor={theme.colors.primary[400]}
			inActiveDotColor={'rgba(255, 255, 255, 0.1)'}
		/>
	)
	return (
		<LinearGradient
			colors={[theme.colors.primary[300], theme.colors.primary[500], theme.colors.primary[400]]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				{RenderSteps()}
				{RenderContent()}
			</SafeAreaView>
		</LinearGradient>
	)
}

export default AccountSetupPage

const stylesheet = createStyleSheet({
	container: {
		flex: 1,
		width: DEVICE_WIDTH,
	},
	content: {
		flexGrow: 1,
		paddingBottom: moderateScale(10),
		paddingTop: moderateScale(10),
	},
})
