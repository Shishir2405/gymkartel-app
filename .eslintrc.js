module.exports = {
  root: true,
  extends: ["expo"],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "src/graphql/generated/",
    ".expo/",
  ],
  rules: {
    "import/order": "off",
  },
};
