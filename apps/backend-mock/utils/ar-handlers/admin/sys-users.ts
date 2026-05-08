import type { ArHandlerMap } from '../index';

import {
  filterByFields,
  findById,
  paginate,
  wrapOk,
} from '../../ar-mock-utils';

export const adminSysUsersHandlers: ArHandlerMap = {
  '/SysUsers/GetAdminPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(fixture.data?.list ?? [], body.userName, [
      'userName',
      'nickName',
    ]);
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysUsers/GetTenantPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(fixture.data?.list ?? [], body.userName, [
      'userName',
      'nickName',
    ]);
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysUsers/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    const filtered = filterByFields(fixture.data?.list ?? [], body.userName, [
      'userName',
      'nickName',
    ]);
    return wrapOk(paginate(filtered, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/SysUsers/GetInfo': ({ body, loadFixture }) => {
    const listFixture = loadFixture('/SysUsers/GetAdminPageList');
    const list = listFixture?.data?.list ?? [];
    return wrapOk(findById(list, body.userId, 'userId'));
  },

  '/SysUsers/GetSuperAuthUser': ({ fixture }) => fixture ?? wrapOk(null),
};
