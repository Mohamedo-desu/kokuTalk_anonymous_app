import { router, useSegments } from 'expo-router'
import { PropsWithChildren, useEffect } from 'react'

import { useAuthStoreSelectors } from '@/store/authStore'

const AuthProvider = ({ children }: PropsWithChildren) => {
	const isAuthenticated = useAuthStoreSelectors.use.isAuthenticated()
	const didTryAutoLogin = useAuthStoreSelectors.use.didTryAutoLogin()

	const rootSegments = useSegments()[0]

	useEffect(() => {
		if (!isAuthenticated && !didTryAutoLogin) {
			router.replace('/')
		} else if (!isAuthenticated && didTryAutoLogin) {
			router.replace('/(auth)/')
		} else if (isAuthenticated && didTryAutoLogin) {
			router.replace('/(main)/(tabs)/')
		} else {
			router.replace('/(auth)/')
		}
	}, [isAuthenticated, rootSegments, didTryAutoLogin])

	return <>{children}</>
}

export default AuthProvider
