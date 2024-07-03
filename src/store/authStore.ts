import { create } from 'zustand'
import { createSelectors } from './createSelectors'
import { useUserStoreSelectors } from './useUserStore'

export interface AuthState {
	currentUser: any
	didTryAutoLogin: boolean
	isAuthenticated: boolean
	isLoggingOut: boolean
}

interface AuthActions {
	setCurrentUser: (user: AuthState['currentUser']) => void
	setDidTryAutoLogin: () => void
	updateUser: (user: any) => void
	authenticateUser: () => void
	setIsLoggingOut: () => void
	logOut: () => void
}

const initialState: AuthState = {
	currentUser: {} as any,
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
}))

export const useAuthStoreSelectors = createSelectors(useAuthStore)

export const signIn = async (body: any) => {
	const setDidTryAutoLogin = useAuthStoreSelectors.getState().setDidTryAutoLogin
	const authenticateUser = useAuthStoreSelectors.getState().authenticateUser
	const updateUser = useUserStoreSelectors.getState().updateUser

	try {
		updateUser(body)
		authenticateUser()
		setDidTryAutoLogin()
	} catch (error) {
		console.error('Failed to sign in:', error)
	}
}

export const signUpStore = async (body: any) => {
	const setDidTryAutoLogin = useAuthStoreSelectors.getState().setDidTryAutoLogin
	const authenticateUser = useAuthStoreSelectors.getState().authenticateUser
	const updateUser = useUserStoreSelectors.getState().updateUser

	try {
		updateUser(body)
		authenticateUser()
		setDidTryAutoLogin()
	} catch (error) {
		console.error('Failed to sign up:', error)
	}
}

export const logOut = async () => {
	const logOut = useAuthStoreSelectors.getState().logOut

	try {
		logOut()
	} catch (error) {
		console.error('Failed to log out:', error)
	}
}
