// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');
const path = require('path');

/**
 * @type {import("@nrwl/next/plugins/with-nx").WithNxOptions}
 **/
const nextConfig = {
  webpack(config, { isServer, dev }) {
    console.log('applying webpack config');
    config.experiments = config.experiments
      ? { ...config.experiments, asyncWebAssembly: true }
      : { asyncWebAssembly: true };

    // In prod mode and in the server bundle (the place where this "chunks" bug
    // appears), use the client static directory for the same .wasm bundle
    config.output.webassemblyModuleFilename =
      isServer && !dev ? '../static/wasm/[id].wasm' : 'static/wasm/[id].wasm';

    // Ensure the filename for the .wasm bundle is the same on both the client
    // and the server (as in any other mode the ID's won't match)
    config.optimization.moduleIds = 'named';
    config.plugins.push(
      new WasmPackPlugin({
        crateDirectory: path.resolve(
          __dirname,
          '../../wasm-libs/facsimile-highlighter/'
        ),
        outDir: path.resolve(__dirname, './wasm-libs/facsimile-highlighter/'),
      })
    );
    return config;
  },
  swcMinify: true,
  staticPageGenerationTimeout: 480,
  experimental: {
    esmExternals: true,
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = withNx(nextConfig);
