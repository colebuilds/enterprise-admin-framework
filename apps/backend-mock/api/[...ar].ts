// apps/backend-mock/api/[...ar].ts
// Catch-all for AR admin API paths. Uses domainUrl header to select admin/tenant fixtures.
import { defineEventHandler, getHeader, getRequestURL } from 'h3';
import { loadArFixture } from '~/utils/ar-fixtures';

export default defineEventHandler((event) => {
  const domainUrl = getHeader(event, 'domainUrl') ?? '';
  const apiPath = getRequestURL(event).pathname.replace(/^\/api/, '') || '/';

  const fixture = loadArFixture(domainUrl, apiPath);
  if (fixture !== null) {
    return fixture;
  }

  return { code: 0, data: null, msg: 'ok (mock stub)' };
});
