import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "../../ui";
import type { MemberTabParamList } from "./types";
import { HomeScreen } from "../../features/home";
import { GymsScreen } from "../../features/gyms";
import { ScannerScreen } from "../../features/checkin";
import { TodayScreen } from "../../features/ledger";
import { ClubHomeScreen } from "../../features/club";

const Tab = createBottomTabNavigator<MemberTabParamList>();

export function MemberTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gyms" component={GymsScreen} />
      <Tab.Screen name="CheckIn" component={ScannerScreen} />
      <Tab.Screen name="Track" component={TodayScreen} />
      <Tab.Screen name="Club" component={ClubHomeScreen} />
    </Tab.Navigator>
  );
}
