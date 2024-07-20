import SignInPage from '@/components/SignIn'
import SignUpPage from '@/components/SignUp'
import { DEVICE_WIDTH } from '@/utils'
import React, { memo, useCallback, useRef } from 'react'
import { FlatList } from 'react-native'
import Animated from 'react-native-reanimated'

const PAGES = [
	{
		id: 'signin',
		component: SignInPage,
	},
	{
		id: 'signup',
		component: SignUpPage,
	},
]

const Auth = memo(() => {
	const flatListRef = useRef<FlatList<(typeof PAGES)[number]>>(null)

	const renderItem = useCallback(({ item }: { item: (typeof PAGES)[number] }) => {
		return <item.component ref={flatListRef} />
	}, [])

	return (
		<Animated.FlatList
			ref={flatListRef}
			data={PAGES}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			horizontal
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			scrollEnabled={false}
			keyboardShouldPersistTaps="handled"
			style={{ flex: 1 }}
			contentContainerStyle={{ flexGrow: 1 }}
			decelerationRate="fast"
			scrollEventThrottle={16}
			snapToInterval={DEVICE_WIDTH}
		/>
	)
})

export default Auth
