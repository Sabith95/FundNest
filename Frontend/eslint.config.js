import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist',"node_modules","coverage"]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
        rules: {
      // 🔹 Relax TypeScript strictness (VERY IMPORTANT)
      '@typescript-eslint/no-explicit-any': 'warn', // change from error → warn
      '@typescript-eslint/no-unused-vars': 'warn',

      // 🔹 Disable annoying Vite rule (common practice)
      'react-refresh/only-export-components': 'off',

      // 🔹 Optional improvements
      'prefer-const': 'warn',
      'no-useless-escape': 'warn',
    },
  },
])
