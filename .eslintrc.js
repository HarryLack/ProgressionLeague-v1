module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks'],
    overrides: [],
    rules: {
        'react/prop-types': 0,
        // babel takes care of this
        'react/react-in-jsx-scope': 0,
        // This is dumb
        'max-len': 0,
        'react/function-component-definition': 0,
        '@typescript-eslint/naming-convention': 1,
        'linebreak-style': ['error', 'windows'],
        // Redux relies on this, TODO figure out workaround
        'no-param-reassign': 0,
        "no-underscore-dangle":0
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
    }
}