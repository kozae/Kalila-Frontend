const rootMain = require('../../../../.storybook/main');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const path = require('path');
module.exports = {
  ...rootMain,

  core: { ...rootMain.core, builder: 'webpack5' },
  staticDirs: ['./static'],
  stories: [
    ...rootMain.stories,
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [...rootMain.addons, '@nrwl/react/plugins/storybook'],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }
    config.experiments = config.experiments
      ? { ...config.experiments, asyncWebAssembly: true }
      : { asyncWebAssembly: true };

    // add your own webpack tweaks if needed
    config.plugins.push(
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, '../rust-src/'),
        outDir: path.resolve(__dirname, '../src/lib/wasm/'),
        forceWatch: true,
        forceMode: 'production',
        outName: 'index',
      })
    );

    return config;
  },
};
