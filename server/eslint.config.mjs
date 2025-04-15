import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['dist', 'node_modules'],
    },
    {
        files: ['**/*.{ts,js}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parser: tsParser,
            globals: globals.node,
        },
        plugins: {
            '@typescript-eslint': tseslint,
            prettier,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            'no-console': 'warn',
            'no-debugger': 'error',
        },
    },
];
