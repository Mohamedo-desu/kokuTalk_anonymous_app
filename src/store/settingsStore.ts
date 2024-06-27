import { create } from 'zustand'
import { createSelectors } from './createSelectors'

export interface SettingsState {
	theme: string
}

interface SettingsActions {
	setTheme: (theme: SettingsState['theme']) => void
}

const initialState: SettingsState = {
	theme: 'system',
}

const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
	...initialState,
	setTheme: (theme) => set(() => ({ theme: theme })),
}))

export const useSettingsStoreSelectors = createSelectors(useSettingsStore)
