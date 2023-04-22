module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
  ],
    overrides: [
        {
            files: ['*.ts', '*.tsx'], // Your TypeScript files extension
            extends: ['standard-with-typescript',
                'plugin:import/typescript'],
            parserOptions: {
                project: ['./tsconfig.json'], // Specify it only for TypeScript files
            },
        },
  ],
  plugins: [
    'react'
  ],
  rules: {
    // Typescript cpvers this
    'react/prop-types': 0,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  }
}
