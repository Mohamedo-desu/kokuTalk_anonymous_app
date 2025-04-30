import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Colors } from '@/constants/Colors';

const Loader = ({ size = 'large' }: { size?: 'small' | 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.primary} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create(theme => ({
  container: {
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.Colors.background,
  },
}));
