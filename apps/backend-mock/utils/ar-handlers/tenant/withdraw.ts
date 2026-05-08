import type { ArHandlerMap } from '../index';

import { filterByFields, paginate, wrapOk } from '../../ar-mock-utils';

export const tenantWithdrawHandlers: ArHandlerMap = {
  '/WithdrawOrder/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.tenantId !== null && body.tenantId !== undefined) {
      list = list.filter((i) => i.tenantId === body.tenantId);
    }
    if (Array.isArray(body.withdrawStates) && body.withdrawStates.length > 0) {
      list = list.filter((i) => body.withdrawStates.includes(i.withdrawState));
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawOrder/GetAuditPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.tenantId !== null && body.tenantId !== undefined) {
      list = list.filter((i) => i.tenantId === body.tenantId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawRecord/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.tenantId !== null && body.tenantId !== undefined) {
      list = list.filter((i) => i.tenantId === body.tenantId);
    }
    if (body.userId !== null && body.userId !== undefined) {
      list = list.filter((i) => String(i.userId) === String(body.userId));
    }
    if (body.orderNo) {
      list = list.filter((i) =>
        String(i.orderNo ?? '').includes(body.orderNo.trim()),
      );
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 10));
  },

  '/WithdrawCategory/GetPageList': ({ body, fixture }) => {
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

  '/WithdrawChannel/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    let list: any[] = fixture.data?.list ?? [];
    if (body.channelId !== null && body.channelId !== undefined) {
      list = list.filter((i) => i.channelId === body.channelId);
    }
    return wrapOk(paginate(list, body.pageNo ?? 1, body.pageSize ?? 20));
  },

  '/WithdrawConfigGroup/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },

  '/WithdrawStaticDay/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },
};
