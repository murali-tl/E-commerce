const globals = require("globals");
const pluginJs = require("@eslint/js");

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // Additional rules specific to your project
  },
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        // Specific rules for JavaScript files
      },
    },
  ],
};
