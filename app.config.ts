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
    // iOS uses Apple Maps (the default react-native-maps provider) — no API key
    // needed, and it inherits the dark UI style from `userInterfaceStyle`.
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
    // react-native-maps on Android uses Google Maps, which needs an API key.
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY ?? "",
      },
    },
  },
  extra: {
    graphqlUrl: process.env.GRAPHQL_URL ?? "https://api.gymkartel.app/graphql",
    // Publishable Razorpay key id (safe on-device; the secret stays server-side).
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
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
    // react-native-maps ships an Expo config plugin — it wires the Android
    // Google Maps SDK (key from android.config.googleMaps.apiKey above) and the
    // iOS map view. Autolinks in a dev-client build; NOT available in Expo Go.
    "react-native-maps",
    // NOTE: react-native-razorpay has NO Expo config plugin. It autolinks via
    // native modules in a dev-client / production build and cannot be added as a
    // plugin string here (Expo would reject it). It also cannot ship over OTA —
    // adding it requires a fresh native build. See README → "Native modules".
  ],
});
