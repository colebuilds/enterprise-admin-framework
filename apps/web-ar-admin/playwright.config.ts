import { defineConfig, devices } from '@playwright/test';

import { TENANT_AUTH_FILE } from './e2e/constants';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 8000 },
  retries: 0,
  reporter: [['list']],
  outputDir: 'node_modules/.e2e/test-results',

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    headless: !!process.env.CI,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Runs auth.setup.ts once before the main project; skips if state is fresh
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // All tests run with the saved auth state (商户后台 TENANT)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: TENANT_AUTH_FILE,
      },
      dependencies: ['setup'],
    },
  ],

  // Reuse the dev server started externally (pnpm dev:tenant --mode sit)
  webServer: undefined,
});
