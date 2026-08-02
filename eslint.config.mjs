import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Ported from the former .eslintrc.json, which ESLint 9 silently ignored
    // because flat config takes precedence. These rules had never actually run.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // CLI scripts report to stdout — that is their interface, not a stray debug log.
    files: ["scripts/**/*.{ts,mts,js,mjs}"],
    rules: {
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
