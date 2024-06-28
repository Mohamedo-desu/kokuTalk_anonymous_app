import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface UserState {
	gender: string
	age: string
	profile: string
}

interface AuthActions {
	setGender: (user: UserState['gender']) => void
	setAge: (user: UserState['age']) => void
	setProfile: (user: UserState['profile']) => void
}

const initialState: UserState = {
	gender: '',
	age: '',
	profile: '',
}

const useUserStore = create<UserState & AuthActions>((set) => ({
	...initialState,
	setGender: (gender) => set(() => ({ gender: gender })),
	setAge: (age) => set(() => ({ age: age })),
	setProfile: (profile) => set(() => ({ profile: profile })),
}))

export const useUserStoreSelectors = createSelectors(useUserStore)
