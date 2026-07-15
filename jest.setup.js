/* eslint-disable */
// Reanimated mock for tests.
try {
  require("react-native-reanimated").setUpTests?.();
} catch (e) {
  // reanimated not installed in the test env — logic tests don't need it.
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

// react-native-maps is a native module (no JS impl in the test env). Mock it to
// lightweight Views so map screens render in component tests instead of the
// native-less fallback, and so a bare require never crashes.
jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MapView = ({ children, ...props }) =>
    React.createElement(View, props, children);
  const Marker = ({ children, ...props }) =>
    React.createElement(View, props, children);
  return { __esModule: true, default: MapView, Marker, PROVIDER_GOOGLE: "google" };
});

// react-native-gifted-charts renders via react-native-svg; stub the chart to a
// View so the ledger/progress screens render fast and deterministically.
jest.mock("react-native-gifted-charts", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    LineChart: (props) =>
      React.createElement(View, { testID: "line-chart-native", ...props }),
  };
});
