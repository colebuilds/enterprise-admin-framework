import type { ArHandlerMap } from '../index';

import {
  filterByFields,
  findById,
  paginate,
  wrapOk,
} from '../../ar-mock-utils';

export const tenantV1UsersHandlers: ArHandlerMap = {
  '/v1/Users/GetUserPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.userName) {
      list = filterByFields(list, body.userName, ['userName', 'nickName']);
    }
    if (body.userId !== null && body.userId !== undefined) {
      list = list.filter((i) => String(i.userId) === String(body.userId));
    }
    if (body.userState !== null && body.userState !== undefined) {
      list = list.filter((i) => i.userState === body.userState);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/v1/Users/GetOnlineUserPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUserDetail': ({ body, loadFixture }) => {
    const listFixture = loadFixture('/v1/Users/GetUserPageList');
    const list = listFixture?.data?.list ?? [];
    return wrapOk(findById(list, body.userId, 'userId'));
  },

  '/v1/Users/GetUserBankCardPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUPIPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUserCpfPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUserRealNamePageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUserUsdtPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUserWalletPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetSubsetUserPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetUserRelativePageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 10),
    );
  },

  '/v1/Users/GetBankTypeList': ({ fixture }) => fixture,
  '/v1/Users/GetCpfTypeList': ({ fixture }) => fixture,
  '/v1/Users/GetUsdtTypeList': ({ fixture }) => fixture,
  '/v1/Users/GetWalletTypeList': ({ fixture }) => fixture,

  '/v1/Users/GetUserBetTotal': ({ fixture }) => fixture,
};
