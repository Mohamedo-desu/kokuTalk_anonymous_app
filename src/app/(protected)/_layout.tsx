import { useUser } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

const ProtectedLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={'/(public)'} />;

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default ProtectedLayout;
