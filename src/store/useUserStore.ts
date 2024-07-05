import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface UserState {
	userData: {
		id: string
		displayName: string
		userName: string
		email: string
		gender: string
		age: string
		photoURL: string
	}
}

interface AuthActions {
	updateUser: (user: Partial<UserState['userData']>) => void
	setUserData: (user: UserState['userData']) => void
}

const initialState: UserState = {
	userData: {} as UserState['userData'],
}

const useUserStore = create<UserState & AuthActions>((set) => ({
	...initialState,
	setUserData: (userData) => set({ userData }),
	updateUser: (user: any) => set((state) => ({ userData: { ...state.userData, ...user } })),
}))

export const useUserStoreSelectors = createSelectors(useUserStore)
