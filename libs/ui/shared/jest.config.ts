module.exports = {
  displayName: 'shared-ui',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/shared',
  preset: '../../../jest.preset.ts',
};
