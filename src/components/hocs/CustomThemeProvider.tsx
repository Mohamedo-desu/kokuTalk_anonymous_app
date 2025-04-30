import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { PropsWithChildren, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { customDarkTheme, customLightTheme } from '../../../unistyles';

const CustomThemeProvider = ({ children }: PropsWithChildren) => {
  const colorScheme = useColorScheme();

  const currentNavigationTheme = useMemo(
    () => (colorScheme === 'dark' ? customDarkTheme : customLightTheme),
    [colorScheme]
  );

  return (
    <NavigationThemeProvider value={currentNavigationTheme}>
      {children}

      <SystemBars style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
};

export default CustomThemeProvider;
