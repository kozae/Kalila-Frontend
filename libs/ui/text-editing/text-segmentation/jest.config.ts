/* eslint-disable */
export default {
  displayName: 'ui-text-editing-text-segmentation',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/ui/text-editing/text-segmentation',
  preset: '../../../../jest.preset.js',
};
