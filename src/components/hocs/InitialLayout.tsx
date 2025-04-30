import { Colors } from '@/constants/Colors';
import useNetworkState from '@/hooks/useNetworkState';
import { styles } from '@/styles/layouts/InitialLayout.styles';
import { useAuth } from '@clerk/clerk-expo';
import * as Application from 'expo-application';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { isConnected } = useNetworkState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const inPublicLayout = segments[0] === '(public)';
    const inProtectedLayout = segments[0] === '(protected)';

    if (isConnected === false && !inProtectedLayout) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!isSignedIn && !inPublicLayout) {
      router.replace('/(public)');
    } else if (isSignedIn && inPublicLayout) {
      router.replace('/(protected)/(tabs)');
    }
  }, [isLoaded, isSignedIn, router, segments, isConnected]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(true);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isLoaded)
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Share</Text>
          <Text style={styles.text2}>Confessions</Text>
        </View>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        )}

        <Text style={styles.versionCodeText}>{Application.nativeApplicationVersion}</Text>
      </View>
    );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(public)"
        options={{
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="(protected)"
        options={{
          animation: 'none',
        }}
      />
    </Stack>
  );
};

export default InitialLayout;
