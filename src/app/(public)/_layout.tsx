import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

const AuthLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href={'/(protected)/(tabs)'} />;

  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="privacy-policy"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="verificationModal"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
