import { Fonts } from '@/constants/Fonts';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    backgroundColor: theme.Colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: { flexDirection: 'row', gap: 10 },
  text: {
    fontFamily: Fonts.Bold,
    fontSize: 20,
    letterSpacing: 1.5,
    color: theme.Colors.primary,
  },
  text2: {
    fontFamily: Fonts.Bold,
    fontSize: 20,
    letterSpacing: 1.5,
    color: theme.Colors.typography,
  },
  versionCodeText: {
    position: 'absolute',
    bottom: 0,
    marginBottom: rt.insets.bottom + 10,
    fontSize: 12,
    textAlign: 'center',
    color: theme.Colors.gray[500],
    letterSpacing: 1,
  },
  height: {
    flex: 1,
    flexGrow: 1,
  },
  loader: {
    marginTop: 30,
  },
}));
