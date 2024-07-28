import { useAuthStoreSelectors } from '@/store/authStore'
import { router } from 'expo-router'
import { PropsWithChildren, useEffect } from 'react'

const ProtectRoutes = ({ children }: PropsWithChildren) => {
	const isAuthenticated = useAuthStoreSelectors.use.isAuthenticated()
	const didTryAutoLogin = useAuthStoreSelectors.use.didTryAutoLogin()
	const isAnonymous = useAuthStoreSelectors.use.isAnonymous()

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
	}, [isAuthenticated, didTryAutoLogin, isAnonymous])

	return <>{children}</>
}

export default ProtectRoutes
