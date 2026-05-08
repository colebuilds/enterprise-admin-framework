import type { ArHandlerMap } from '../index';

import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';

export const tenantRechargeHandlers: ArHandlerMap = {
  '/RechargeCategory/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.customName) {
      list = filterByFields(list, body.customName, ['customName', 'name']);
    }
    if (body.state !== null && body.state !== undefined) {
      list = list.filter((i) => i.state === body.state);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeChannel/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.channelId !== null && body.channelId !== undefined) {
      list = list.filter((i) => i.channelId === body.channelId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/RechargeLocalBank/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },

  '/RechargeLocalEWallet/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },

  '/RechargeLocalUpi/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },

  '/RechargeLocalUsdt/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },
};
