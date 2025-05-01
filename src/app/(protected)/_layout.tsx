import { useUser } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

const ProtectedLayout = () => {
  const { user } = useUser();

  if (!user) return <Redirect href={'/(public)'} />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add_confession"
        options={{
          headerTitle: 'Add Confession',
        }}
      />
    </Stack>
  );
};

export default ProtectedLayout;
