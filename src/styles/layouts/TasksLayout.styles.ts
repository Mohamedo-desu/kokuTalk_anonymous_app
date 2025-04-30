import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    paddingTop: rt.insets.top,
    backgroundColor: theme.Colors.background,
  },
  indicator: {
    position: 'absolute',
    width: 100,
    height: 2,
    backgroundColor: theme.Colors.primary,
    bottom: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabBarLabelStyle: {
    textTransform: 'capitalize',
    fontFamily: theme.fonts.Medium,
    fontSize: 15,
  },
}));
