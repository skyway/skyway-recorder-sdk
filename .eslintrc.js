module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: [],
  extends: [
    'eslint:recommended',
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-dupe-class-members": "off",
    "no-else-return": "error",
    "no-self-compare": "error",
    "no-void": "error",
    "no-var": "error",
    "no-lonely-if": "error",
    "prefer-const": "error",
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true
  },
};
