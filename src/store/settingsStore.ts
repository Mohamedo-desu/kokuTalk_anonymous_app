import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface SettingsState {
	theme: string
	isNetwork: boolean | null
}

interface SettingsActions {
	setTheme: (theme: SettingsState['theme']) => void
	setIsNetwork: (theme: SettingsState['isNetwork']) => void
}

const initialState: SettingsState = {
	theme: 'system',
	isNetwork: true,
}

const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
	...initialState,
	setTheme: (theme) => set(() => ({ theme })),
	setIsNetwork: (isNetwork) => set(() => ({ isNetwork })),
}))

export const useSettingsStoreSelectors = createSelectors(useSettingsStore)
