import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface AuthState {
	didTryAutoLogin: boolean
	isAuthenticated: boolean
	isAnonymous: boolean
	authUser: {
		access_token: string | undefined
		refresh_token: string | undefined
	}
	isLoggingOut: boolean
}

interface AuthActions {
	setAuthUser: (authUser: AuthState['authUser']) => void
	setDidTryAutoLogin: () => void
	setIsAuthenticated: (isAuthenticated: AuthState['isAuthenticated']) => void
	setIsAnonymous: (isAnonymous: AuthState['isAnonymous']) => void
	setIsLoggingOut: () => void
	logOut: () => void
}

const initialState: AuthState = {
	didTryAutoLogin: false,
	isAnonymous: false,
	authUser: {
		access_token: undefined,
		refresh_token: undefined,
	},
	isAuthenticated: false,
	isLoggingOut: false,
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
	...initialState,
	setAuthUser: (authUser) => set(() => ({ authUser })),
	setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
	setIsAnonymous: (isAnonymous) => set(() => ({ isAnonymous })),
	setDidTryAutoLogin: () => set(() => ({ didTryAutoLogin: true })),
	setIsLoggingOut: () => set(() => ({ isLoggingOut: true })),
	logOut: () => set(() => initialState),
}))

export const useAuthStoreSelectors = createSelectors(useAuthStore)
