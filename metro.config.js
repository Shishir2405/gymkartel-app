const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const contractsRoot = path.resolve(projectRoot, "../gymkartel-backend/packages/contracts");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [contractsRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];
config.resolver.unstable_enableSymlinks = true;

module.exports = config;
