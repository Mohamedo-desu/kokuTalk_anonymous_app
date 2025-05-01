import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native-unistyles';

export const lightTheme = {
  Colors: {
    typography: '#141414',
    background: '#ffffff',
    gray: {
      500: '#9E9E9E',
      400: '#BDBDBD',
      300: '#E0E0E0',
      200: '#EEEEEE',
      100: '#F5F5F5',
      50: '#fafafa',
    },
    ...Colors,
  },
  fonts: Fonts,
};
export const darkTheme = {
  Colors: {
    typography: '#ffffff',
    background: '#141414',
    gray: {
      500: '#B0B0B0',
      400: '#8A8A8A',
      300: '#545454',
      200: '#333333',
      100: '#1B1B1B',
      50: '#1b1a1a',
    },
    ...Colors,
  },
  fonts: Fonts,
};

export const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.black,
    card: Colors.darkGray[100],
    text: Colors.white,
    notification: Colors.secondary,
    border: Colors.darkGray[200],
    ...darkTheme,
  },
};

export const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.white,
    card: Colors.lightGray[100],
    text: Colors.black,
    notification: Colors.secondary,
    border: Colors.lightGray[200],
    ...lightTheme,
  },
};

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  breakpoints,
  themes: appThemes,
});
