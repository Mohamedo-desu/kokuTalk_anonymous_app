import { useAuthStoreSelectors } from '@/store/authStore'

const useIsAnonymous = () => {
	const isAnonymous = useAuthStoreSelectors.use.isAnonymous()
	return isAnonymous
}

export default useIsAnonymous
