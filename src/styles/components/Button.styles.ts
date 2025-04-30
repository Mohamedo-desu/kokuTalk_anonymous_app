import { StyleSheet } from 'react-native-unistyles';
import { Fonts } from '@/constants/Fonts';

export const styles = StyleSheet.create(theme => ({
  btn: canLogin => ({
    width: '100%',
    backgroundColor: canLogin ? theme.Colors.primary : theme.Colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  }),
  btnText: canLogin => ({
    color: canLogin ? theme.Colors.white : theme.Colors.gray[300],
    fontFamily: Fonts.Medium,
    fontSize: 14,
    textAlign: 'center',
  }),
}));
