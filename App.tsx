import React, { useCallback } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { AppProviders } from "./src/app/providers/AppProviders";
import { RootNavigator } from "./src/app/navigation/RootNavigator";
import { useAppFonts } from "./src/app/providers/useAppFonts";
import { colors } from "./src/ui";

void SplashScreen.preventAutoHideAsync();

/**
 * Gym Kartel root. Loads the two type families, mounts every provider, then the
 * gated navigator. We hold the native splash until fonts are ready so the big
 * Barlow figures never flash a fallback.
 */
export default function App() {
  const fontsLoaded = useAppFonts();

  const onLayout = useCallback(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg.base }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.base }} onLayout={onLayout}>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </View>
  );
}
