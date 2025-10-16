module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'node',

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  setupFilesAfterEnv: [
    '@testing-library/react/cleanup-after-each',
    '@testing-library/jest-dom/extend-expect',
  ],

  eslintConfig: {
    extends: ['react-app', 'react-app/jest'],
  },
  moduleNameMapper: {
    '\\.(css)$': 'jest-css-modules',
  },

  testRegex: '(/.*\\.test\\.tsx?$)',

  transformIgnorePatterns: ['node_modules/(?!react-dnd|d3|d3-array))/'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
