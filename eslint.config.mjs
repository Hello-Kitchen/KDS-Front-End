import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      "camelcase": [
        "error",
        {
          "ignoreDestructuring": true,
          allow: ["location", "is_ready", "food_ordered", "mods_ingredients", "v7_startTransition", "v7_relativeSplatPath", "access_token"],
        },
      ],
      "semi": ["error"]
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
];
