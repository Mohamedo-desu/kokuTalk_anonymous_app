import { logOutFirebase, signInFirebase, signUpFirebase } from '@/services/authActions'
import { NotificationsProps, User } from '@/types'
import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface AuthState {
	currentUser: User
	didTryAutoLogin: boolean
	isAuthenticated: boolean
	isLoggingOut: boolean
	rTokenTimerIntervalId?: NodeJS.Timeout
}

interface AuthActions {
	setCurrentUser: (user: AuthState['currentUser']) => void
	setDidTryAutoLogin: () => void
	updateUser: (user: User) => void
	authenticateUser: () => void
	setIsLoggingOut: () => void
	logOut: () => void
	setRTokenTimerIntervalId: (id: NodeJS.Timeout | undefined) => void
}

const initialState: AuthState = {
	currentUser: {} as User,
	rTokenTimerIntervalId: undefined,
	didTryAutoLogin: false,
	isAuthenticated: false,
	isLoggingOut: false,
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
	...initialState,
	setCurrentUser: (user) => set(() => ({ currentUser: user })),
	setDidTryAutoLogin: () => set(() => ({ didTryAutoLogin: true })),
	updateUser: (user) =>
		set((state) => ({
			currentUser: state.currentUser ? { ...state.currentUser, ...user } : { ...user },
		})),
	authenticateUser: () => set(() => ({ isAuthenticated: true })),
	setIsLoggingOut: () => set(() => ({ isLoggingOut: true })),
	logOut: () => set(() => initialState),
	setRTokenTimerIntervalId: (id) => set(() => ({ rTokenTimerIntervalId: id })),
}))

export const useAuthStoreSelectors = createSelectors(useAuthStore)

export const signIn = async ({ email, password }: { email: string; password: string }) => {
	const setDidTryAutoLogin = useAuthStoreSelectors.getState().setDidTryAutoLogin
	const authenticateUser = useAuthStoreSelectors.getState().authenticateUser
	const setCurrentUser = useAuthStoreSelectors.getState().setCurrentUser
	const setRTokenTimerIntervalId = useAuthStoreSelectors.getState().setRTokenTimerIntervalId

	try {
		const result = await signInFirebase({ email, password })

		if (result.user) {
			setCurrentUser(result.user)
			setRTokenTimerIntervalId(result.rTokenTimerIntervalId)
			authenticateUser()
		}
	} catch (error) {
		console.error('Failed to sign in:', error)
	} finally {
		setDidTryAutoLogin()
	}
}

export const signUp = async ({ body }: { body: User }) => {
	const setDidTryAutoLogin = useAuthStoreSelectors.getState().setDidTryAutoLogin
	const authenticateUser = useAuthStoreSelectors.getState().authenticateUser
	const setCurrentUser = useAuthStoreSelectors.getState().setCurrentUser
	const setRTokenTimerIntervalId = useAuthStoreSelectors.getState().setRTokenTimerIntervalId

	try {
		const result = await signUpFirebase({ body })

		if (result.user) {
			setCurrentUser(result.user)
			setRTokenTimerIntervalId(result.rTokenTimerIntervalId)
			authenticateUser()
		}
	} catch (error) {
		console.error('Failed to sign up:', error)
	} finally {
		setDidTryAutoLogin()
	}
}

export const logOut = async () => {
	const setIsLoggingOut = useAuthStoreSelectors.getState().setIsLoggingOut
	const logOutAction = useAuthStoreSelectors.getState().logOut

	try {
		setIsLoggingOut()
		const state = useAuthStore.getState()
		await logOutFirebase(state)
		logOutAction()
	} catch (error) {
		console.error('Failed to log out:', error)
	}
}

export const selectUnreadUserNotifications = () => {
	const currentUser = useAuthStoreSelectors.getState().currentUser
	if (!currentUser || !currentUser.notifications) {
		return []
	}
	return currentUser.notifications.filter((notification: NotificationsProps) => notification.new)
}

export const selectUserNotifications = () => {
	const currentUser = useAuthStoreSelectors.getState().currentUser
	if (!currentUser || !currentUser.notifications) {
		return []
	}
	return currentUser.notifications.filter(
		(notification: NotificationsProps) => !notification.cleared,
	)
}
