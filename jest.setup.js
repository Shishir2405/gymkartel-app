/* eslint-disable */
try {
  require("react-native-reanimated").setUpTests?.();
} catch (e) {
}

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async () => null),
  setItemAsync: jest.fn(async () => undefined),
  deleteItemAsync: jest.fn(async () => undefined),
}));

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MapView = ({ children, ...props }) =>
    React.createElement(View, props, children);
  const Marker = ({ children, ...props }) =>
    React.createElement(View, props, children);
  return { __esModule: true, default: MapView, Marker, PROVIDER_GOOGLE: "google" };
});

jest.mock("react-native-gifted-charts", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    LineChart: (props) =>
      React.createElement(View, { testID: "line-chart-native", ...props }),
  };
});
