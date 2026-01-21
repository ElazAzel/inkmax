import js from "@eslint/js";
import globals from "globals";
import i18nPlugin from "./eslint/i18n-plugin.js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const isI18nLint = process.env.LINT_I18N === "true";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      i18n: i18nPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      "i18n/no-literal-string": isI18nLint
        ? [
            "error",
            {
              markupOnly: true,
              ignoreAttribute: [
                "className",
                "data-testid",
                "data-qa",
                "data-cy",
                "data-state",
                "data-value",
                "id",
                "key",
                "role",
                "type",
                "name",
                "href",
                "to",
                "src",
              ],
              ignorePattern: "^(?:[\\d\\s.,:;!?()\\-]+|LinkMAX|lnkmx|Premium|PRO|Pro|Free|AI)$",
            },
          ]
        : "off",
    },
  },
);
