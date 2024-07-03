const colors = {
	primary: {
		500: '#5753C9',
		400: '#6E7FF3',
		300: '#3D4E81',
		200: '#ffa3b1',
		100: '#ffc1cb',
		50: '#ffebee',
	},
	secondary: {
		500: '#c70084',
		400: '#dd008a',
		300: '#f50091',
		200: '#ff0096',
		100: '#ff40ab',
		50: '#ff68bd',
	},
	white: '#ffffff',
	orange: 'orange',
	black: '#141414',
	success: '#7ED321',
	error: '#FF0000',
} as const

const margins = {
	sm: 2,
	md: 4,
	lg: 8,
	xl: 12,
}
export const lightTheme = {
	colors: {
		typography: 'black',
		background: '#ffffff',
		gray: {
			500: '#9E9E9E',
			400: '#BDBDBD',
			300: '#E0E0E0',
			200: '#EEEEEE',
			100: '#F5F5F5',
			50: '#fafafa',
		},
		...colors,
	},
	components: {
		screen: {
			flex: 1,
			flexGrow: 1,
			backgroundColor: colors.white,
		},
	},

	margins,
} as const

export const darkTheme = {
	colors: {
		typography: 'white',
		background: '#141414',
		gray: {
			500: '#B0B0B0',
			400: '#8A8A8A',
			300: '#545454',
			200: '#333333',
			100: '#1B1B1B',
			50: '#1b1a1a',
		},
		...colors,
	},
	components: {
		screen: {
			flex: 1,
			flexGrow: 1,
			backgroundColor: colors.black,
		},
	},

	margins,
} as const
