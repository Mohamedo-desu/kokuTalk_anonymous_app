// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript plugin recommended rules
  ...compat.extends('plugin:@typescript-eslint/recommended'),

  // React plugin recommended rules
  ...compat.extends('plugin:react/recommended'),

  // React Hooks plugin recommended rules
  ...compat.extends('plugin:react-hooks/recommended'),

  // React Native plugin recommended rules
  ...compat.extends('plugin:react-native/all'),

  // Prettier plugin recommended rules
  ...compat.extends('plugin:prettier/recommended'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // TypeScript-specific rules      
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-require-imports': 'off',

      // React-specific rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native rules
      'react-native/no-inline-styles': 'warn',
      'react-native/split-platform-components': 'warn',

      // Import rules
      'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],

      // Prettier integration
      'prettier/prettier': 'error',

    },
  },
];
