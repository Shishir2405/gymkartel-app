module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/.pnpm/(?!(@?react-native.*|@react-navigation.*|expo.*|@expo.*|@expo-google-fonts.*|phosphor-react-native.*|@gymkartel.*|react-clone-referenced-element.*)@)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@gymkartel/contracts$":
      "<rootDir>/../gymkartel-backend/packages/contracts/dist/index.js",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
};
