// apps/backend-mock/utils/ar-fixtures.ts
// Loads AR admin fixtures from apps/web-ar-admin/tools/mock-fixtures/
import fs from 'node:fs';
import path from 'node:path';

function getFixturesRoot(): string {
  // In Nitro dev, import.meta.url points to .nitro/dev/index.mjs (bundled).
  // We resolve relative to the original source file when dirname is available,
  // otherwise fall back to process.cwd() which is apps/backend-mock/ in Nitro dev.
  if (import.meta.dirname) {
    return path.resolve(
      import.meta.dirname,
      '../../web-ar-admin/tools/mock-fixtures',
    );
  }
  // Bundled Nitro dev: cwd is apps/backend-mock/
  return path.resolve(
    process.cwd(),
    '../web-ar-admin/tools/mock-fixtures',
  );
}

export function resolveMode(domainUrl = ''): 'admin' | 'tenant' {
  return domainUrl.includes('tenantadmin') ? 'tenant' : 'admin';
}

export function loadArFixture(
  domainUrl: string,
  apiPath: string,
): null | unknown {
  const mode = resolveMode(domainUrl);
  const rel = apiPath.replace(/^\//, '');
  const filePath = path.join(getFixturesRoot(), mode, `${rel}.json`);

  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export function hasFixtures(mode: 'admin' | 'tenant'): boolean {
  return fs.existsSync(path.join(getFixturesRoot(), mode));
}
