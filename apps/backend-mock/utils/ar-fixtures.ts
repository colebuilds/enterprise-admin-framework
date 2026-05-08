// apps/backend-mock/utils/ar-fixtures.ts
// Loads AR admin fixtures from apps/web-ar-admin/tools/mock-fixtures/
import fs from 'node:fs';
import path from 'node:path';

const FIXTURES_ROOT = path.resolve(
  import.meta.dirname,
  '../../web-ar-admin/tools/mock-fixtures',
);

function resolveMode(domainUrl = ''): 'admin' | 'tenant' {
  return domainUrl.includes('tenantadmin') ? 'tenant' : 'admin';
}

export function loadArFixture(domainUrl: string, apiPath: string): null | unknown {
  const mode = resolveMode(domainUrl);
  const rel = apiPath.replace(/^\//, '');
  const filePath = path.join(FIXTURES_ROOT, mode, `${rel}.json`);

  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export function hasFixtures(mode: 'admin' | 'tenant'): boolean {
  return fs.existsSync(path.join(FIXTURES_ROOT, mode));
}
