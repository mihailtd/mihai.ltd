import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const tsStrict = typescriptEslint.configs["flat/strict-type-checked-only"].map(
  (config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: ["./tsconfig.json"],
        tsconfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
  }),
);

export default createConfigForNuxt({}, tsStrict, eslintConfigPrettier);
