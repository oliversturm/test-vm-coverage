module.exports = wallaby => ({
  files: ['index.js'],
  tests: ['test/*.test.js'],
  testFramework: 'jest',
  env: { type: 'node' }
});
