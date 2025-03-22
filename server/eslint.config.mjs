import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier"; // Import Prettier

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"]
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier, // Disables ESLint rules that conflict with Prettier
  {
    rules: {
      "no-unused-vars": "off", // Disable unused variable warnings
      "@typescript-eslint/no-unused-vars": "off", // Disable for TypeScript
    },
  },
  {
    ignores: ["dist"], // ✅ Place ignores in its own object
  }
];
