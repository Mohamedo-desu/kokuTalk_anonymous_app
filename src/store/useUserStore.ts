import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface UserState {
	userData: {
		gender: string
		age: string
		profile: string
		email: string
	}
}

interface AuthActions {
	updateUser: (user: any) => void
}

const initialState: UserState = {
	userData: {} as UserState['userData'],
}

const useUserStore = create<UserState & AuthActions>((set) => ({
	...initialState,
	updateUser: (user: any) => set((state) => ({ userData: { ...state.userData, ...user } })),
}))

export const useUserStoreSelectors = createSelectors(useUserStore)
