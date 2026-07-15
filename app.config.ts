import type { ExpoConfig, ConfigContext } from "expo/config";

/**
 * Gym Kartel — Expo app config.
 * Dev-client capable (not managed-only) so vision-camera + secure-store native
 * modules link. Targets: iOS 390x844 (iPhone 13/14) and Android 360x800.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Gym Kartel",
  slug: "gymkartel-app",
  scheme: "gymkartel",
  version: "0.1.0",
  orientation: "portrait",
  userInterfaceStyle: "dark",
  backgroundColor: "#141416",
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.gymkartel.app",
    supportsTablet: false,
    buildNumber: "1",
    infoPlist: {
      NSCameraUsageDescription:
        "Gym Kartel uses the camera to scan the QR code at the gym door to check you in.",
      NSLocationWhenInUseUsageDescription:
        "Gym Kartel uses your location to show nearby gyms and, only during a coach session you booked, to share your live location for safety.",
    },
  },
  android: {
    package: "com.gymkartel.app",
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: "#141416",
    },
    permissions: ["CAMERA", "ACCESS_FINE_LOCATION", "VIBRATE"],
  },
  extra: {
    graphqlUrl: process.env.GRAPHQL_URL ?? "https://api.gymkartel.app/graphql",
  },
  plugins: [
    [
      "react-native-vision-camera",
      {
        cameraPermissionText:
          "Gym Kartel needs the camera to scan the door QR code to check you in.",
        enableCodeScanner: true,
      },
    ],
    "expo-secure-store",
    "expo-sqlite",
  ],
});
