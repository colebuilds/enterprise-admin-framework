import path from 'node:path';

export const TENANT_AUTH_FILE = path.join(
  import.meta.dirname,
  '../playwright/.auth/tenant.json',
);

export const ADMIN_AUTH_FILE = path.join(
  import.meta.dirname,
  '../playwright/.auth/admin.json',
);
