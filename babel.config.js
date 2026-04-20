module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
    plugins: [
      require("babel-preset-expo/build/expo-router-plugin").expoRouterBabelPlugin,
      "react-native-reanimated/plugin",
    ],
  };
};
