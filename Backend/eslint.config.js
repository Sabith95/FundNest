const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  // 1. Fully ignore build folders and node_modules
  { 
    ignores: [".dist/**","dist/**", "node_modules/**", "build/**"] 
  },
  
  // 2. Apply standard JavaScript recommended rules
  js.configs.recommended,
  
  // 3. Apply TypeScript recommended rules
  ...tseslint.configs.recommended,
  
  // 4. Custom overrides and backend-specific rules
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json", // Points to your TS config
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Backend specific clean-code preferences
      "no-console": "warn",                // Warns if you leave console.logs in production code
      "prefer-const": "error",             // Forces const over let where possible
      "@typescript-eslint/no-explicit-any": "warn", // Discourages using 'any'
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Allows unused vars if prefixed with _ (e.g., req, _res, next)
    },
  }
);