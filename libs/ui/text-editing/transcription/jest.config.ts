/* eslint-disable */
export default {
  displayName: 'ui-text-editing-transcription',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/ui/text-editing/transcription',
  preset: '../../../../jest.preset.js',
};
