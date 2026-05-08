import type { ArHandlerMap } from '../index';

import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';

export const adminRoleHandlers: ArHandlerMap = {
  '/Role/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(fixture.data.list, body.keyword, ['name']);
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 20));
  },
};
