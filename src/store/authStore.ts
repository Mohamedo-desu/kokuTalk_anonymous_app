import { User } from '@/types'
import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface AuthState {
	didTryAutoLogin: boolean
	isAuthenticated: boolean
	isAnonymous: boolean
	isLoggingOut: boolean
	currentUser: User
}

interface AuthActions {
	updateUser: (user: Partial<AuthState['currentUser']>) => void
	setcurrentUser: (user: AuthState['currentUser']) => void
	setDidTryAutoLogin: () => void
	setAuthenticated: () => void
	setAnonymous: () => void
	setIsLoggingOut: () => void
	logOut: () => void
}

const initialState: AuthState = {
	didTryAutoLogin: false,
	isAnonymous: false,
	isAuthenticated: false,
	isLoggingOut: false,
	currentUser: {} as AuthState['currentUser'],
}

const useAuthStore = create<AuthState & AuthActions>((set) => ({
	...initialState,
	setAuthenticated: () => set({ isAnonymous: false, isAuthenticated: true }),
	setAnonymous: () => set({ isAnonymous: true, isAuthenticated: false }),
	setDidTryAutoLogin: () => set(() => ({ didTryAutoLogin: true })),
	setIsLoggingOut: () => set(() => ({ isLoggingOut: true })),
	setcurrentUser: (currentUser) => set({ currentUser }),
	updateUser: (user: Partial<User>) =>
		set((state) => ({ currentUser: { ...state.currentUser, ...user } })),
	logOut: () => set(() => initialState),
}))

export const useAuthStoreSelectors = createSelectors(useAuthStore)
