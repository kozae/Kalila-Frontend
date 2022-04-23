module.exports = {
  displayName: 'ui-forms',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/ui/forms',
  preset: '../../../jest.preset.ts',
};
