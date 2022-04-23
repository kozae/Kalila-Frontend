// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import("@nrwl/next/plugins/with-nx").WithNxOptions}
 **/
const nextConfig = {
  webpack(config) {
    console.log('applying webpack config');
    config.experiments = config.experiments
      ? { ...config.experiments, asyncWebAssembly: true }
      : { asyncWebAssembly: true };

    return config;
  },
  swcMinify: true,
  staticPageGenerationTimeout: 480,
  experimental: {
    esmExternals: false,
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = withNx(nextConfig);
