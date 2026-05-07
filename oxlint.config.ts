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
    {
      // Legacy ProComponents migrated from old project — suppress style-only rules
      files: [
        'apps/web-ar-admin/src/components/pro/**',
        'apps/web-ar-admin/src/components/table/**',
        'apps/web-ar-admin/src/components/dict-select/**',
      ],
      rules: {
        eqeqeq: 'off',
        'no-useless-assignment': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/prefer-array-some': 'off',
        'unicorn/prefer-add-event-listener': 'off',
        'unicorn/prefer-code-point': 'off',
        'unicorn/no-useless-switch-case': 'off',
        'unicorn/prefer-set-has': 'off',
        'unicorn/prefer-ternary': 'off',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/unified-signatures': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-invalid-void-type': 'off',
        'unicorn/prefer-number-properties': 'off',
        'import/no-duplicates': 'off',
      },
    },
  ],
});
