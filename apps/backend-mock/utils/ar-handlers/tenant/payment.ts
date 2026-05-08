import type { ArHandlerMap } from '../index';

import { paginate, wrapOk } from '../../ar-mock-utils';

export const tenantPaymentHandlers: ArHandlerMap = {
  '/ThirdPayMerchant/GetPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },

  '/PaymentReport/GetChannelPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },

  '/PaymentReport/GetTenantPageList': ({ body, fixture }) => {
    if (!fixture || fixture.code !== 0) return fixture;
    return wrapOk(
      paginate(fixture.data?.list ?? [], body.pageNo ?? 1, body.pageSize ?? 20),
    );
  },
};
