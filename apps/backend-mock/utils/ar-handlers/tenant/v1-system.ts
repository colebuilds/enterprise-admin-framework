import type { ArHandlerMap } from '../index';

import { paginate, wrapOk } from '../../ar-mock-utils';

export const tenantV1SystemHandlers: ArHandlerMap = {
  '/v1/System/GetPlatformLogPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/System/GetWebLogPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Finance/GetTabBanksPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },
};
