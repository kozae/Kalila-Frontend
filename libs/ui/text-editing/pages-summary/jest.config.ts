module.exports = {
  displayName: 'ui-text-editing-pages-summary',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/ui/text-editing/pages-summary',
  preset: '../../../../jest.preset.ts',
};
