module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    'complexity': ['warn', { max: 10 }],
    'max-depth': ['error', { max: 4 }],
    'max-params': ['warn', { max: 4 }],
    'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-nested-callbacks': ['warn', { max: 3 }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/**', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
      },
    },
  ],
};
