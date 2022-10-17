/* eslint-disable */
export default {
  displayName: 'ui-forms',

  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/forms',
  preset: '../../../jest.preset.js',
};
