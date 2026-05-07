import process from 'node:process';

import { defineConfig } from '@vben/vite-config';

import { loadEnv } from 'vite';

export default defineConfig(async ({ mode } = {}) => {
  const env = loadEnv(mode ?? 'dev', process.cwd());

  // cross-env VITE_APP_TYPE=TENANT takes precedence over env file
  const appType = process.env.VITE_APP_TYPE ?? env.VITE_APP_TYPE ?? 'ADMIN';
  const isTenant = appType === 'TENANT';
  const apiTarget = isTenant ? env.VITE_TENANT_API_URL : env.VITE_API_BASE_URL;

  return {
    application: {},
    vite: {
      define: {
        'import.meta.env.VITE_APP_TYPE': JSON.stringify(appType),
      },
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            secure: false,
            target: apiTarget,
            ws: true,
          },
        },
      },
    },
  };
});
