import Button from '@/components/common/Button';
import { useAuth } from '@clerk/clerk-expo';

import React from 'react';
import { StyleSheet, View } from 'react-native';

const HomeScreen = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button label="Logout" onPress={() => signOut()} isValid={true} isSubmitting={false} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
