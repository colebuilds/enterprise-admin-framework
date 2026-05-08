// apps/web-ar-admin/tools/endpoints/tenant-read.ts
import type { Endpoint } from './admin-read.js';

export const TENANT_READ_ENDPOINTS: Endpoint[] = [
  // ── Core auth ──────────────────────────────────────────────
  { method: 'POST', path: '/Login/Login', body: { userName: 'org_milo', pwd: '12345678' } },
  { method: 'GET',  path: '/menu/all' },
  { method: 'GET',  path: '/user/info' },
  { method: 'GET',  path: '/auth/codes' },
  { method: 'POST', path: '/Home/GetSysUserInfo', body: {} },
  { method: 'POST', path: '/Login/HomeBasic', body: {} },
  // ── Auth/Common ────────────────────────────────────────────
  { method: 'POST', path: '/Auth/CheckAuth', body: {} },
  { method: 'POST', path: '/Auth/GetOrgTenantList', body: {} },
  { method: 'POST', path: '/Common/GetDictionary', body: {} },
  { method: 'POST', path: '/Common/GetPlatformDic', body: {} },
  { method: 'POST', path: '/Common/GetDynamicDictionary', body: { key: 'roleList' } },
  { method: 'POST', path: '/Common/GetDateTimeScopeTypes', body: {} },
  { method: 'POST', path: '/v1/Common/GetDictionary', body: {} },
  // ── Recharge ───────────────────────────────────────────────
  { method: 'POST', path: '/RechargeCategory/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/RechargeChannel/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/RechargeLocalBank/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/RechargeLocalEWallet/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/RechargeLocalUpi/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/RechargeLocalUsdt/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/ThirdPayMerchant/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  // ── Withdraw ───────────────────────────────────────────────
  { method: 'POST', path: '/WithdrawCategory/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/WithdrawChannel/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/WithdrawConfigGroup/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/WithdrawOrder/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/WithdrawOrder/GetAuditPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/WithdrawRecord/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/WithdrawStaticDay/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  // ── Report ─────────────────────────────────────────────────
  { method: 'POST', path: '/PaymentReport/GetChannelPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/PaymentReport/GetTenantPageList', body: { pageIndex: 1, pageSize: 20 } },
  // ── v1 Finance ─────────────────────────────────────────────
  { method: 'POST', path: '/v1/Finance/GetTabBanksPageList', body: { pageIndex: 1, pageSize: 20 } },
  // ── v1 Users ───────────────────────────────────────────────
  { method: 'POST', path: '/v1/Users/GetUserPageList', body: { pageIndex: 1, pageSize: 20 } },
  {
    method: 'POST', path: '/v1/Users/GetUserDetail',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? d?.data?.list?.[0]?.userId ?? 1 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserBetTotal',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? d?.data?.list?.[0]?.userId ?? 1 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserBankCardPageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserRelativePageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  { method: 'POST', path: '/v1/Users/GetSubsetUserPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/v1/Users/GetOnlineUserPageList', body: { pageIndex: 1, pageSize: 20 } },
  {
    method: 'POST', path: '/v1/Users/GetUPIPageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserCpfPageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserRealNamePageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserUsdtPageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  {
    method: 'POST', path: '/v1/Users/GetUserWalletPageList',
    idFrom: { listPath: '/v1/Users/GetUserPageList', extractId: (d) => ({ userId: d?.data?.list?.[0]?.id ?? 1, pageIndex: 1, pageSize: 20 }) },
  },
  { method: 'POST', path: '/v1/Users/GetBankTypeList', body: {} },
  { method: 'POST', path: '/v1/Users/GetCpfTypeList', body: {} },
  { method: 'POST', path: '/v1/Users/GetUsdtTypeList', body: {} },
  { method: 'POST', path: '/v1/Users/GetWalletTypeList', body: {} },
  // ── v1 System logs ─────────────────────────────────────────
  { method: 'POST', path: '/v1/System/GetPlatformLogPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/v1/System/GetWebLogPageList', body: { pageIndex: 1, pageSize: 20 } },
  // ── Hub (same as admin) ────────────────────────────────────
  { method: 'POST', path: '/hub/domains/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/assets/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/stats', body: {} },
  { method: 'POST', path: '/hub/themes/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/layouts/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/tabbars/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/merchant/sites', body: {} },
  { method: 'POST', path: '/hub/web/config', body: {} },
  // ── Event ──────────────────────────────────────────────────
  { method: 'POST', path: '/event/metrics', body: {} },
  { method: 'POST', path: '/event/traffic/health', body: {} },
  { method: 'POST', path: '/event/traffic/summary', body: {} },
  // ── AI ─────────────────────────────────────────────────────
  { method: 'POST', path: '/ai/metrics', body: {} },
  { method: 'POST', path: '/ai/health', body: {} },
];
