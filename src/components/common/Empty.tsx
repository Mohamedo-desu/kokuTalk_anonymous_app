import React from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Fonts } from '@/constants/Fonts';

const Empty = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create(theme => ({
  container: { padding: 25, justifyContent: 'center', alignItems: 'center' },
  text: {
    color: theme.Colors.gray[500],
    fontSize: 12,
    fontFamily: Fonts.Medium,
    textAlign: 'center',
    alignSelf: 'center',
  },
}));
