/* eslint-disable */
export default {
  displayName: 'shared-ui',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/shared',
  preset: '../../../jest.preset.js',
};
