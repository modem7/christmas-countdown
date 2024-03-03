module.exports = {
  parser: '@babel/eslint-parser',
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
  env: {
    browser: true,
  },
}
