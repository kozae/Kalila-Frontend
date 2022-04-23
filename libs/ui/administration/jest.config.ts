module.exports = {
  displayName: 'ui-administration',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/administration',
  preset: '../../../jest.preset.ts',
};
