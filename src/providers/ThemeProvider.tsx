import { useSettingsStoreSelectors } from '@/store/settingsStore'
import { Colors } from '@/unistyle/theme'
import {
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
	ThemeProvider,
} from '@react-navigation/native'
import React, { PropsWithChildren, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import {
	MD3DarkTheme as PaperDarkTheme,
	DefaultTheme as PaperDefaultTheme,
	Provider as PaperProvider,
} from 'react-native-paper'
import { UnistylesRuntime } from 'react-native-unistyles'

const CustomThemeProvider = ({ children }: PropsWithChildren) => {
	const theme = useSettingsStoreSelectors.use.theme()
	const colorScheme = useColorScheme()

	useEffect(() => {
		const selectedTheme: any = theme === 'system' ? colorScheme : theme

		UnistylesRuntime.setTheme(selectedTheme)
	}, [theme, colorScheme])

	const isDarkTheme = theme === 'system' ? colorScheme === 'dark' : theme === 'dark'
	const navigationTheme = isDarkTheme ? NavigationDarkTheme : NavigationDefaultTheme
	const paperTheme = isDarkTheme ? PaperDarkTheme : PaperDefaultTheme

	const combinedTheme = {
		...navigationTheme,
		colors: {
			...navigationTheme.colors,
			...paperTheme.colors,
			primary: Colors.primary[500],
		},
	}

	return (
		<ThemeProvider value={combinedTheme}>
			<PaperProvider theme={combinedTheme}>{children}</PaperProvider>
		</ThemeProvider>
	)
}

export default CustomThemeProvider
