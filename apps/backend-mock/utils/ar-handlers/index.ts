import { loadArFixture, resolveMode } from '../ar-fixtures';
import { genericHandler } from './_generic';
import { adminCommonHandlers } from './admin/common';
import { adminMenuTreeHandlers } from './admin/menu-tree';
import { adminOrgTenantHandlers } from './admin/org-tenant';
import { adminRoleHandlers } from './admin/role';
import { adminSysUsersHandlers } from './admin/sys-users';
import { tenantPaymentHandlers } from './tenant/payment';
import { tenantRechargeHandlers } from './tenant/recharge';
import { tenantV1SystemHandlers } from './tenant/v1-system';
import { tenantV1UsersHandlers } from './tenant/v1-users';
import { tenantWithdrawHandlers } from './tenant/withdraw';

export type ArHandler = (ctx: {
  body: Record<string, any>;
  fixture: any;
  loadFixture: (path: string) => any;
}) => any;

export type ArHandlerMap = Record<string, ArHandler>;

const registry: Record<'admin' | 'tenant', ArHandlerMap> = {
  admin: {
    ...adminSysUsersHandlers,
    ...adminRoleHandlers,
    ...adminOrgTenantHandlers,
    ...adminCommonHandlers,
    ...adminMenuTreeHandlers,
  },
  tenant: {
    ...tenantWithdrawHandlers,
    ...tenantRechargeHandlers,
    ...tenantPaymentHandlers,
    ...tenantV1UsersHandlers,
    ...tenantV1SystemHandlers,
  },
};

const ADMIN_DOMAIN = 'sit-adminapi';
const TENANT_DOMAIN = 'sit-tenantadmin';

function modeToUrl(mode: 'admin' | 'tenant'): string {
  return mode === 'admin' ? ADMIN_DOMAIN : TENANT_DOMAIN;
}

export function dispatchArHandler(
  domainUrl: string,
  apiPath: string,
  body: Record<string, any>,
): unknown {
  const mode = resolveMode(domainUrl);
  const fixture = loadArFixture(domainUrl, apiPath);
  const loadFixture = (p: string) => loadArFixture(modeToUrl(mode), p);

  const handler = registry[mode]?.[apiPath];
  if (handler) {
    return handler({ body, fixture, loadFixture });
  }

  const result = genericHandler({ body, fixture });
  if (result !== null) return result;

  return { code: 0, data: null, msg: 'ok' };
}
