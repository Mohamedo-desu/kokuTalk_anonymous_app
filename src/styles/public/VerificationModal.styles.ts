import { Fonts } from '@/constants/Fonts';
import { StyleSheet } from 'react-native-unistyles';

export const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: rt.insets.top + 10,
    paddingBottom: rt.insets.bottom + 10,
    paddingHorizontal: 15,
  },
  modalContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: theme.Colors.background,
    borderRadius: 5,
    alignItems: 'center',
    gap: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.Bold,
    color: theme.Colors.primary,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    backgroundColor: theme.Colors.gray[100],
    borderColor: theme.Colors.gray[200],
    borderRadius: 5,
    paddingHorizontal: 10,
    color: theme.Colors.typography,
    placeholderTextColor: theme.Colors.gray[400],
  },
  btn: {
    width: '100%',
    backgroundColor: theme.Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    color: theme.Colors.white,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
}));
