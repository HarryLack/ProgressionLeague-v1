module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:react/recommended',
        'standard-with-typescript',
        'plugin:import/typescript',
        'prettier'
    ],
    overrides: [],
    plugins: [
        'react'
    ],
    rules: {
        'react/prop-types': 0
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
    }
}