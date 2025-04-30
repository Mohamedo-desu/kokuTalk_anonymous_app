import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: rt.insets.top + 10,
    paddingBottom: rt.insets.bottom + 10,
    paddingHorizontal: 15,
  },
  formContainer: {
    marginVertical: 25,
    gap: 20,
  },
  height: { flex: 1, flexGrow: 1 },
}));
