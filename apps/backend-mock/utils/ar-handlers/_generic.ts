// apps/backend-mock/utils/ar-handlers/_generic.ts
import { paginate, wrapOk } from '../ar-mock-utils';

export function genericHandler(ctx: {
  body: Record<string, any>;
  fixture: any;
}): any {
  const { body, fixture } = ctx;

  // No fixture → caller returns write stub
  if (fixture === null || fixture === undefined) return null;

  // Non-zero code → return error fixture as-is
  if (fixture.code !== 0) return fixture;

  const data = fixture.data;

  // List fixture + pageNo in request → auto-paginate
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.list) &&
    body.pageNo !== null &&
    body.pageNo !== undefined
  ) {
    return wrapOk(paginate(data.list, body.pageNo, body.pageSize ?? 20));
  }

  // Everything else (trees, dicts, single objects) → passthrough
  return fixture;
}
