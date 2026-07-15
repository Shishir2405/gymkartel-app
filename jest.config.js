module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // pnpm stores packages under node_modules/.pnpm/<name>@<ver>/... so the usual
  // flat-layout ignore patterns miss the RN/Expo ESM packages. Whitelist the
  // ecosystem dirs (scoped names use "+" instead of "/") so babel transforms
  // them; everything else in node_modules stays ignored.
  transformIgnorePatterns: [
    "node_modules/.pnpm/(?!(@?react-native.*|@react-navigation.*|expo.*|@expo.*|@expo-google-fonts.*|phosphor-react-native.*|@gymkartel.*|react-clone-referenced-element.*)@)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Jest's resolver doesn't follow the contract package's exports map; point
    // it straight at the built ESM entry (babel transforms it via the pattern).
    "^@gymkartel/contracts$":
      "<rootDir>/../gymkartel-backend/packages/contracts/dist/index.js",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
};
