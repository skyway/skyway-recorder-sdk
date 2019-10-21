// See https://jestjs.io/docs/en/configuration.html
module.exports = {
  // test file name should be end with .test.js
  testMatch: ["**/__tests__/**/?(*.)test.js"],
  // default is false: we ensure restoring mock states between every test case
  restoreMocks: true
};
