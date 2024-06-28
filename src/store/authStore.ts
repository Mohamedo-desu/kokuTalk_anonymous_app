import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface AuthState {
	currentUser: any
	didTryAutoLogin: boolean
	isAuthenticated: boolean
	isLoggingOut: boolean
	rTokenTimerIntervalId?: NodeJS.Timeout
}

interface AuthActions {
	setCurrentUser: (user: AuthState['currentUser']) => void
	setDidTryAutoLogin: () => void
	updateUser: (user: any) => void
	authenticateUser: () => void
	setIsLoggingOut: () => void
	logOut: () => void
	setRTokenTimerIntervalId: (id: NodeJS.Timeout | undefined) => void
}

const initialState: AuthState = {
	currentUser: {} as any,
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
	} catch (error) {
		console.error('Failed to sign in:', error)
	} finally {
		setDidTryAutoLogin()
	}
}

export const signUp = async ({ body }: { body: any }) => {
	const setDidTryAutoLogin = useAuthStoreSelectors.getState().setDidTryAutoLogin
	const authenticateUser = useAuthStoreSelectors.getState().authenticateUser
	const setCurrentUser = useAuthStoreSelectors.getState().setCurrentUser
	const setRTokenTimerIntervalId = useAuthStoreSelectors.getState().setRTokenTimerIntervalId

	try {
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
	} catch (error) {
		console.error('Failed to log out:', error)
	}
}
