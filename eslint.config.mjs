import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Enforce tree-shaking: allow only react-icons/<set> (e.g. react-icons/lu), not barrel "react-icons"
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-icons",
              message:
                'Import from a specific set instead, e.g. "react-icons/lu", "react-icons/io", "react-icons/fc", "react-icons/ai" for tree-shaking.',
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
