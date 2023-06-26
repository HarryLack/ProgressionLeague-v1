module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:import/typescript'
  ],
  overrides: [
  ],
  plugins: [
    'react'
  ],
  rules: {
    // Typescript cpvers this
    'react/prop-types': 0
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  }
}