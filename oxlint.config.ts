import { oxlintConfig } from '@vben/oxlint-config';

import { defineConfig } from 'oxlint';

export default defineConfig({
  ...oxlintConfig,
  ignorePatterns: [...(oxlintConfig.ignorePatterns ?? []), 'apps/*/tools/**'],
  overrides: [
    ...(oxlintConfig.overrides ?? []),
    {
      files: ['apps/web-ar-admin/src/api/**/*.ts'],
      rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
  ],
});
