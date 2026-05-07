import path from 'node:path';

export const AUTH_FILE = path.join(
  import.meta.dirname,
  '../playwright/.auth/state.json',
);
