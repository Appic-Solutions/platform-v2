import globals from 'globals';
import unusedImports from 'eslint-plugin-unused-imports';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';

export default [
  {
    plugins: {
      'globals': globals,
      'unused-imports': unusedImports,
      '@typescript-eslint': typescriptEslint,
      'recommended': js.configs.recommended,
      'all': js.configs.all,
    },

    languageOptions: { globals: { ...globals.browser } },

    ignores: [
      '**/*.test.js',
      '**/dist',
      '**/.husky',
      '.next/**',
      'out/**',
      'coverage/**',
      '**/build/**',
      '**/public/**',
      '**/lib/**',
    ],

    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'linebreak-style': 'off',

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      'react/prop-types': 'off',
    },
  },
];
