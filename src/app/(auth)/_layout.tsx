import { Stack } from 'expo-router'
import React from 'react'

const AuthLayout = () => {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="index" />
			<Stack.Screen
				name="modal"
				options={{
					presentation: 'modal',
					animation: 'slide_from_bottom',
					animationTypeForReplace: 'pop',
				}}
			/>
		</Stack>
	)
}

export default AuthLayout
