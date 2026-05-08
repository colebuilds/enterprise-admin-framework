// apps/web-ar-admin/tools/capture-mock-data.ts
// Usage:
//   pnpm --filter web-ar-admin exec esno tools/capture-mock-data.ts --mode admin
//   pnpm --filter web-ar-admin exec esno tools/capture-mock-data.ts --mode tenant

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { ADMIN_READ_ENDPOINTS } from './endpoints/admin-read.js';
import { TENANT_READ_ENDPOINTS } from './endpoints/tenant-read.js';
import { CaptureClient } from './lib/capture-client.js';

const MODE = (process.argv
  .find((a) => a.startsWith('--mode='))
  ?.split('=')[1] ??
  (process.argv.includes('--mode')
    ? process.argv[process.argv.indexOf('--mode') + 1]
    : null) ??
  'admin') as 'admin' | 'tenant';

const CONFIG = {
  admin: {
    baseUrl: 'https://sit-adminapi.lottotest6688.com/api',
    endpoints: ADMIN_READ_ENDPOINTS,
    loginPath: '/Login/Login',
    loginBody: { userName: 'sys_milo', pwd: '12345678' },
  },
  tenant: {
    baseUrl: 'https://sit-tenantadmin.lottotest6688.com/api',
    endpoints: TENANT_READ_ENDPOINTS,
    loginPath: '/Login/Login',
    loginBody: { userName: 'org_milo', pwd: '12345678' },
  },
} as const;

const cfg = CONFIG[MODE];
const FIXTURES_DIR = path.join(import.meta.dirname, `mock-fixtures/${MODE}`);

function fixturePathFor(apiPath: string): string {
  const parts = apiPath.replace(/^\//, '').split('/');
  const dir = path.join(FIXTURES_DIR, ...parts.slice(0, -1));
  fs.mkdirSync(dir, { recursive: true });
  return path.join(FIXTURES_DIR, `${parts.join('/')}.json`);
}

async function run() {
  console.log(`\n[capture] mode=${MODE}  baseUrl=${cfg.baseUrl}\n`);

  const domainUrl = cfg.baseUrl.replace(/\/api$/, '');
  const client = new CaptureClient({ baseUrl: cfg.baseUrl, domainUrl });

  console.log(`[login] POST ${cfg.loginPath}`);
  let loginResp: any;
  try {
    loginResp = await client.post(
      cfg.loginPath,
      cfg.loginBody as Record<string, unknown>,
    );
  } catch (error) {
    console.error('[login] FAILED:', error);
    process.exit(1);
  }
  const token: string = loginResp?.data?.token ?? loginResp?.token ?? '';
  if (!token) {
    console.error(
      '[login] No token in response:',
      JSON.stringify(loginResp).slice(0, 200),
    );
    process.exit(1);
  }
  client.setToken(token);
  console.log(`[login] OK  token=${token.slice(0, 20)}...`);

  fs.writeFileSync(
    fixturePathFor(cfg.loginPath),
    JSON.stringify(loginResp, null, 2),
  );

  const log: Array<{ note?: string; path: string; status: 'error' | 'ok' }> =
    [];
  const listCache = new Map<string, any>();

  const endpoints = cfg.endpoints.filter((e) => e.path !== cfg.loginPath);

  for (const ep of endpoints) {
    let body = ep.body ?? {};

    if (ep.idFrom) {
      const cached = listCache.get(ep.idFrom.listPath);
      if (cached) {
        body = ep.idFrom.extractId(cached);
      } else {
        console.log(`  [skip-id] ${ep.path} — list not yet captured`);
        log.push({
          path: ep.path,
          status: 'error',
          note: 'idFrom list not captured',
        });
        continue;
      }
    }

    try {
      const resp =
        ep.method === 'GET'
          ? await client.get(ep.path)
          : await client.post(ep.path, body as Record<string, unknown>);

      fs.writeFileSync(fixturePathFor(ep.path), JSON.stringify(resp, null, 2));
      listCache.set(ep.path, resp);
      console.log(`  [ok] ${ep.method} ${ep.path}`);
      log.push({ path: ep.path, status: 'ok' });
    } catch (error: any) {
      console.warn(
        `  [err] ${ep.method} ${ep.path}  ${error?.message ?? error}`,
      );
      log.push({
        path: ep.path,
        status: 'error',
        note: error?.message ?? String(error),
      });
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'capture-log.json'),
    JSON.stringify(
      { mode: MODE, capturedAt: new Date().toISOString(), results: log },
      null,
      2,
    ),
  );

  const ok = log.filter((l) => l.status === 'ok').length;
  const err = log.filter((l) => l.status === 'error').length;
  console.log(`\n[capture] Done. OK=${ok} ERR=${err}`);
  console.log(`[capture] Fixtures saved to ${FIXTURES_DIR}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
