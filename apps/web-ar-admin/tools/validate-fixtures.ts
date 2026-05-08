// apps/web-ar-admin/tools/validate-fixtures.ts
// Usage: pnpm --filter @vben/web-ar-admin run validate:fixtures

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { ADMIN_READ_ENDPOINTS } from './endpoints/admin-read.js';
import { TENANT_READ_ENDPOINTS } from './endpoints/tenant-read.js';

const FIXTURES_ROOT = path.join(import.meta.dirname, 'mock-fixtures');

// These are vben-internal dev-server routes, not AR backend API routes.
// They have no fixture files and should not be validated.
const SKIP_PATHS = new Set([
  '/.well-known/openid-configuration',
  '/auth/codes',
  '/menu/all',
  '/user/info',
]);

interface Result {
  detail?: string;
  mode: 'admin' | 'tenant';
  path: string;
  status: 'bad-code' | 'missing' | 'ok';
}

function check(mode: 'admin' | 'tenant', apiPath: string): Result {
  const rel = apiPath.replace(/^\//, '');
  const fp = path.join(FIXTURES_ROOT, mode, ...rel.split('/')) + '.json';

  if (!fs.existsSync(fp)) {
    return { detail: fp, mode, path: apiPath, status: 'missing' };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return { detail: 'invalid JSON', mode, path: apiPath, status: 'bad-code' };
  }

  if (parsed.code !== 0) {
    return {
      detail: `code=${parsed.code} msg=${parsed.msg ?? ''}`,
      mode,
      path: apiPath,
      status: 'bad-code',
    };
  }

  return { mode, path: apiPath, status: 'ok' };
}

const results: Result[] = [];

for (const ep of ADMIN_READ_ENDPOINTS) {
  if (SKIP_PATHS.has(ep.path)) continue;
  results.push(check('admin', ep.path));
}
for (const ep of TENANT_READ_ENDPOINTS) {
  if (SKIP_PATHS.has(ep.path)) continue;
  results.push(check('tenant', ep.path));
}

const missing = results.filter((r) => r.status === 'missing');
const badCode = results.filter((r) => r.status === 'bad-code');
const ok = results.filter((r) => r.status === 'ok');

console.log('\n=== Fixture Coverage Report ===');
console.log(`Endpoints checked : ${results.length}`);
console.log(`  ✅ OK       : ${ok.length}`);
console.log(`  ❌ MISSING  : ${missing.length}`);
console.log(`  ❌ BAD CODE : ${badCode.length}`);

if (missing.length > 0) {
  console.log('\nMissing fixtures:');
  for (const r of missing) console.log(`  [${r.mode}] ${r.path}`);
}
if (badCode.length > 0) {
  console.log('\nBad-code fixtures (code !== 0):');
  for (const r of badCode)
    console.log(`  [${r.mode}] ${r.path}  (${r.detail})`);
}

if (missing.length === 0 && badCode.length === 0) {
  console.log('\n✅ 100% coverage — all fixtures present and code=0\n');
  process.exit(0);
} else {
  console.log(
    `\n❌ ${missing.length + badCode.length} fixture(s) need attention.\n`,
  );
  process.exit(1);
}
