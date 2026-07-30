import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Ignore build outputs and non-source test scripts
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Root-level debug/test scripts — not part of the app source
    "test_axios.js",
    "test_axios.mjs",
  ]),

  {
    rules: {
      // ── Next.js rules ────────────────────────────────────────────────────
      "@next/next/no-img-element": "off",
      "react/no-ref-prop": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",

      // ── React Compiler rules (react-hooks v5+, experimental) ─────────────
      // These are new rules introduced in react-hooks v5 (React Compiler).
      // They flag valid patterns in existing code.
      // Turned OFF because eslint-config-next file-glob configs override "warn".
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/purity": "off",

      // ── TypeScript rules ─────────────────────────────────────────────────
      // Unused vars are non-blocking warnings
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
    }
  }
]);

export default eslintConfig;
