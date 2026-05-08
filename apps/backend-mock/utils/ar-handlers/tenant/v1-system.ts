import type { ArHandlerMap } from '../index';

import { paginate, wrapOk } from '../../ar-mock-utils';

const TENANT_USERNAME = 'org_milo';
const TENANT_PASSWORD = '12345678';

export const tenantV1SystemHandlers: ArHandlerMap = {
  '/Login/Login': ({ body, fixture }) => {
    if (body.userName !== TENANT_USERNAME || body.pwd !== TENANT_PASSWORD) {
      return { code: 1, data: null, msg: '账号或密码错误' };
    }
    return fixture ?? { code: 0, data: { token: 'mock-tenant-token' }, msg: '成功' };
  },


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
