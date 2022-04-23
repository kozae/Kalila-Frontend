module.exports = {
  displayName: 'ui-table',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/table',
  preset: '../../../jest.preset.ts',
};
