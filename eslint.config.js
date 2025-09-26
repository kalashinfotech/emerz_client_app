// @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      // Override to allow or enforce array type style
      '@typescript-eslint/array-type': [
        'off',
        {
          default: 'generic', // enforce Array<T> over T[]
          readonly: 'generic',
        },
      ],
      'import/order': ['off', {}], // Prettier handles auto import so linting is not required. Can think about it in future.
    },
  },
  {
    files: ['package.json'],
    rules: {
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: ['src/components/ui/**'], // or './components/ui/**'
  },
]
