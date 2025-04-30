import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";

// Define your navigation integration
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

const sentryConfig = {
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableAutoSessionTracking: true,
  attachStacktrace: true,
  attachScreenshot: true,
  enableAutoPerformanceTracing: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllText: false,
      maskAllImages: false,
      maskAllVectors: false,
      enableExperimentalViewRenderer: true,
      enableFastViewRendering: true,
    }),
    Sentry.spotlightIntegration(),
    navigationIntegration,
  ],
};

export default sentryConfig;
