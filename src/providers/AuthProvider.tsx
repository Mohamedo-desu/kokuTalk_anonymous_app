import { useAuthStoreSelectors } from '@/store/authStore'
import { router, useSegments } from 'expo-router'
import { PropsWithChildren, useEffect, useState } from 'react'

const AuthProvider = ({ children }: PropsWithChildren) => {
	const segments = useSegments()
	const [rootSegment, setRootSegment] = useState<string | undefined>(segments[0])

	// Selectors
	const isAuthenticated = useAuthStoreSelectors.use.isAuthenticated()
	const didTryAutoLogin = useAuthStoreSelectors.use.didTryAutoLogin()
	const isAnonymous = useAuthStoreSelectors.use.isAnonymous()

	useEffect(() => {
		if (segments[0] !== rootSegment && segments[0]) {
			setRootSegment(segments[0])
		}
	}, [segments, rootSegment])

	useEffect(() => {
		const getRoute = () => {
			if (isAnonymous) {
				return '/(main)/(tabs)/(home)'
			} else if (!isAuthenticated && !didTryAutoLogin) {
				return '/'
			} else if (!isAuthenticated && didTryAutoLogin) {
				return '/(auth)/'
			} else if (isAuthenticated && didTryAutoLogin) {
				return '/(main)/(tabs)/(home)'
			} else {
				return '/(auth)/'
			}
		}

		router.replace(getRoute())
	}, [isAuthenticated, didTryAutoLogin, isAnonymous, rootSegment])

	return <>{children}</>
}

export default AuthProvider
