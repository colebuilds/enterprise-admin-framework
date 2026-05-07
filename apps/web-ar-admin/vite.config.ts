import process from 'node:process';

import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  const appType = process.env.VITE_APP_TYPE ?? 'ADMIN';
  const isTenant = appType === 'TENANT';

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
            target: isTenant
              ? process.env.VITE_TENANT_API_URL
              : process.env.VITE_API_BASE_URL,
          },
        },
      },
    },
  };
});
