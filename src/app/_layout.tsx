import ClerkAndConvexProvider from '@/components/hocs/ClerkAndConvexProvider';
import CustomThemeProvider from '@/components/hocs/CustomThemeProvider';
import InitialLayout from '@/components/hocs/InitialLayout';
import NetworkStatusToast from '@/components/ui/NetworkStatusToast';
import useNetworkState from '@/hooks/useNetworkState';
import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import sentryConfig from '../../sentry.config';

LogBox.ignoreLogs(['Clerk: Clerk has been loaded with development keys.']);

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

const manifest = Updates.manifest;
const metadata = 'metadata' in manifest ? manifest.metadata : undefined;
const extra = 'extra' in manifest ? manifest.extra : undefined;
const updateGroup = metadata && 'updateGroup' in metadata ? metadata.updateGroup : undefined;

Sentry.init(sentryConfig);

const scope = Sentry.getGlobalScope();

scope.setTag('expo-update-id', Updates.updateId);
scope.setTag('expo-is-embedded-update', Updates.isEmbeddedLaunch);

if (typeof updateGroup === 'string') {
  scope.setTag('expo-update-group-id', updateGroup);

  const owner = extra?.expoClient?.owner ?? '[account]';
  const slug = extra?.expoClient?.slug ?? '[project]';
  scope.setTag(
    'expo-update-debug-url',
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  );
} else if (Updates.isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  scope.setTag('expo-update-debug-url', 'not applicable for embedded updates');
}

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

function RootLayout() {
  const ref = useNavigationContainerRef();
  const { isConnected } = useNetworkState();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    translateY.value = withSpring(isConnected === false ? 60 : 0, {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    });
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <ClerkAndConvexProvider>
      <GestureHandlerRootView style={styles.container}>
        <CustomThemeProvider>
          <NetworkStatusToast />
          <Animated.View style={[styles.content, animatedStyle]}>
            <InitialLayout />
          </Animated.View>
        </CustomThemeProvider>
      </GestureHandlerRootView>
    </ClerkAndConvexProvider>
  );
}

export default Sentry.wrap(RootLayout);

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
