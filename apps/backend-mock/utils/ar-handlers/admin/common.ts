import type { ArHandlerMap } from '../index';

import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';

export const adminCommonHandlers: ArHandlerMap = {
  '/IpWhitelist/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.ip) {
      list = filterByFields(list, body.ip, ['ip']);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/SysLog/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.keyword) {
      list = filterByFields(list, body.keyword, ['userName', 'operationDesc']);
    }
    if (body.logState !== null && body.logState !== undefined) {
      list = list.filter((i) => i.logState === body.logState);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysDictionary/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },
};
