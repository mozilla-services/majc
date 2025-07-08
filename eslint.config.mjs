// @ts-check

import eslint from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import reactPlugin from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    settings: {
      react: {
        version: "19.1",
      },
    },
  },
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      ".tsup/**",
      "dist/**",
      "packages/heyapi/**",
    ],
  },
  eslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  reactHooks.configs["recommended-latest"],
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactRefresh.configs.vite,
  tseslint.configs.recommended,
  stylistic.configs["recommended"],
  stylistic.configs.customize({
    quotes: "double",
  }),
)
