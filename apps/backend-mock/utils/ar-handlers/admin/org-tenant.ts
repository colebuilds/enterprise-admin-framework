import type { ArHandlerMap } from '../index';

import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';

export const adminOrgTenantHandlers: ArHandlerMap = {
  '/Organization/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(fixture.data?.list ?? [], body.name, [
      'name',
    ]);
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/Tenant/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.name) {
      list = filterByFields(list, body.name, ['name']);
    }
    if (body.state !== null && body.state !== undefined) {
      list = list.filter((i) => i.state === body.state);
    }
    if (body.orgId !== null && body.orgId !== undefined) {
      list = list.filter((i) => i.orgId === body.orgId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },
};
