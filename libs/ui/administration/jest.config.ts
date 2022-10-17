/* eslint-disable */
export default {
  displayName: 'ui-administration',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/administration',
  preset: '../../../jest.preset.js',
};
