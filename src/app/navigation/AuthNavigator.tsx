import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "./types";
import { stackScreenOptions } from "./navTheme";
import {
  SplashScreen,
  PhoneOtpScreen,
  NamePhotoScreen,
  HealthQuizScreen,
  PickTierScreen,
  CityZoneScreen,
} from "../../features/onboarding";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ ...stackScreenOptions, headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="PhoneOtp" component={PhoneOtpScreen} />
      <Stack.Screen name="NamePhoto" component={NamePhotoScreen} />
      <Stack.Screen name="HealthQuiz" component={HealthQuizScreen} />
      <Stack.Screen name="PickTier" component={PickTierScreen} />
      <Stack.Screen name="CityZone" component={CityZoneScreen} />
    </Stack.Navigator>
  );
}
