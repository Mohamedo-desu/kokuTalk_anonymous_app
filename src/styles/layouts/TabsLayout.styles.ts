import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: theme.Colors.background,
    paddingBottom: rt.insets.bottom,
  },
}));
