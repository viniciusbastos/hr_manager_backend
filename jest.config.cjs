module.exports = {
  testMatch: ["**/__tests__/**/*.jest.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ],
};