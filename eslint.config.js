const { FlatCompat } = require('@eslint/eslintrc');
const { fixupConfigRules } = require('@eslint/compat');
const js = require('@eslint/js');
const globals = require('globals');
const nextPlugin = require('@next/eslint-plugin-next');
const babelEslintParser = require('@babel/eslint-parser');
const reactVersion = require('react/package.json').version;

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', '.yarn/**'],
  },
  js.configs.recommended,
  // airbnb & eslint-plugin-react still use the legacy rule-context API
  // (context.getFilename(), etc.) that ESLint 10 removed; fixupConfigRules
  // patches that back in so the shared configs keep working under flat config.
  ...fixupConfigRules(compat.extends('airbnb', 'plugin:react/recommended')),
  nextPlugin.configs.recommended,
  {
    languageOptions: {
      parser: babelEslintParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          parserOpts: { plugins: ['jsx'] },
        },
      },
      globals: {
        ...globals.browser,
        __PATH_PREFIX__: true,
      },
    },
    settings: {
      react: {
        version: reactVersion,
      },
    },
    rules: {
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/function-component-definition': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
  {
    // Vitest/@vitejs/plugin-react/@testing-library/jest-dom expose their
    // config entry points via package.json "exports" subpaths that
    // eslint-plugin-import's default resolver doesn't follow.
    files: ['vitest.config.js', 'vitest.setup.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
    },
  },
];
