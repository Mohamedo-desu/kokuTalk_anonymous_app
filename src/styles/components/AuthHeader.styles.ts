import { StyleSheet } from 'react-native-unistyles';
import { Fonts } from '@/constants/Fonts';

export const styles = StyleSheet.create(theme => ({
  title: {
    fontSize: 22,
    fontFamily: Fonts.Bold,
    color: theme.Colors.typography,
    marginTop: 15,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    color: theme.Colors.gray[500],
  },
  icon: {
    color: theme.Colors.typography,
  },
  iconBtn: { alignSelf: 'flex-start' },
}));
