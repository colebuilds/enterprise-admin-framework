import { defineConfig } from '@vben/eslint-config';

export default defineConfig([
  {
    // Legacy ProComponents migrated from old project — suppress style-only rules
    files: [
      'apps/*/src/components/pro/**',
      'apps/*/src/components/table/**',
      'apps/*/src/components/dict-select/**',
    ],
    rules: {
      'vue/require-default-prop': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/custom-event-name-casing': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-dynamic-delete': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prefer-array-some': 'off',
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/no-useless-switch-case': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-ternary': 'off',
      'no-useless-assignment': 'off',
      'eqeqeq': 'off',
      'no-throw-literal': 'off',
      'import/no-duplicates': 'off',
      'unicorn/prefer-number-properties': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'unused-imports/no-unused-vars': 'off',
      'vue/no-mutating-props': 'off',
    },
  },
]);
