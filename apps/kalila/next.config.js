// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = (phase) => ({
  images: {
    domains: ['kalila.kozae.de'],
  },
  env: {
    production: phase === PHASE_PRODUCTION_BUILD,
    PHASE_PRODUCTION_BUILD: PHASE_PRODUCTION_BUILD,
    PHASE_DEVELOPMENT_SERVER: PHASE_DEVELOPMENT_SERVER,
    phase,
  },
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
});

module.exports = withNx(nextConfig);
