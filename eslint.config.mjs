// @ts-check

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '.tsup/**',
      'dist/**',
      'packages/heyapi/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs['recommended-flat'],
)
