import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Enforce no-unused-vars for variables and arguments
      'no-unused-vars': [
        'error',
        {
          vars: 'all', // Check for all unused variables
          args: 'none', // Ignore unused function arguments for now (you can customize this)
          ignoreRestSiblings: false, // Don't ignore unused rest variables
          argsIgnorePattern: '^_', // Allow unused arguments starting with '_'
        },
      ],
    },
  },
]

export default eslintConfig
