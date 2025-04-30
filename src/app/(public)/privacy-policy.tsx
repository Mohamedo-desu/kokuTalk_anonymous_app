import { Stack } from 'expo-router';
import React from 'react';
import PrivacyPolicyContent from '@/components/ui/PrivacyPolicyContent';
import { Fonts } from '@/constants/Fonts';

const PrivacyPolicyScreen = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerTitleStyle: { fontFamily: Fonts.Medium },
        }}
      />
      <PrivacyPolicyContent />
    </>
  );
};

export default PrivacyPolicyScreen;
