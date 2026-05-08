import type { ArHandlerMap } from '../index';

export const adminMenuTreeHandlers: ArHandlerMap = {
  '/Menu/GetMenuTreeByRoleId': ({ fixture }) =>
    fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetMenuTreeByOrgId': ({ fixture }) =>
    fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetAdminMenuTree': ({ fixture }) =>
    fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetMenuTree': ({ fixture }) =>
    fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetOrgMenuTree': ({ fixture }) =>
    fixture ?? { code: 0, data: [], msg: '' },

  '/Menu/GetMenuTreeByCurrentSysUser': ({ fixture }) =>
    fixture ?? { code: 0, data: [], msg: '' },
};
