// apps/web-ar-admin/tools/endpoints/admin-read.ts
export interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  body?: Record<string, unknown>;
  idFrom?: { extractId: (data: any) => Record<string, unknown>; listPath: string; };
}

export const ADMIN_READ_ENDPOINTS: Endpoint[] = [
  // ── Core auth ──────────────────────────────────────────────
  { method: 'POST', path: '/Login/Login', body: { userName: 'sys_milo', pwd: '12345678' } },
  { method: 'GET',  path: '/menu/all' },
  { method: 'GET',  path: '/user/info' },
  { method: 'GET',  path: '/auth/codes' },
  { method: 'POST', path: '/Home/GetSysUserInfo', body: {} },
  { method: 'POST', path: '/Home/GetVersion', body: {} },
  { method: 'POST', path: '/Home/CheckHealth', body: {} },
  { method: 'POST', path: '/Login/HomeBasic', body: {} },
  { method: 'GET',  path: '/.well-known/openid-configuration' },
  // ── Auth/Common ────────────────────────────────────────────
  { method: 'POST', path: '/Auth/CheckAuth', body: {} },
  { method: 'POST', path: '/Auth/GetOrgTenantList', body: {} },
  { method: 'POST', path: '/Common/GetDictionary', body: {} },
  { method: 'POST', path: '/Common/GetPlatformDic', body: {} },
  { method: 'POST', path: '/Common/GetDynamicDictionary', body: { key: 'roleList' } },
  { method: 'POST', path: '/Common/GetDateTimeScopeTypes', body: {} },
  { method: 'POST', path: '/Common/GetListBasicTable', body: {} },
  { method: 'POST', path: '/Common/GetSettingByKey', body: { key: 'SiteSetting' } },
  { method: 'POST', path: '/Common/GetListRedisKey', body: { keyPattern: '*', pageIndex: 1, pageSize: 20 } },
  // ── System ─────────────────────────────────────────────────
  { method: 'POST', path: '/IpWhitelist/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/Menu/Get', body: {} },
  { method: 'POST', path: '/Role/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/SysDictionary/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/SysLog/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/SysUsers/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/SysUsers/GetAdminPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/SysUsers/GetTenantPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/SysUsers/GetSuperAuthUser', body: {} },
  // ── Tenant mgmt ────────────────────────────────────────────
  { method: 'POST', path: '/Country/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  {
    method: 'POST', path: '/Country/Get',
    idFrom: { listPath: '/Country/GetPageList', extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }) },
  },
  { method: 'POST', path: '/Currency/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  {
    method: 'POST', path: '/Currency/Get',
    idFrom: { listPath: '/Currency/GetPageList', extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }) },
  },
  { method: 'POST', path: '/Language/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  {
    method: 'POST', path: '/Language/Get',
    idFrom: { listPath: '/Language/GetPageList', extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }) },
  },
  { method: 'POST', path: '/Organization/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  {
    method: 'POST', path: '/Organization/Get',
    idFrom: { listPath: '/Organization/GetPageList', extractId: (d) => ({ id: d?.data?.list?.[0]?.id ?? 1 }) },
  },
  { method: 'POST', path: '/Tenant/GetPageList', body: { pageIndex: 1, pageSize: 20 } },
  { method: 'POST', path: '/Tenant/GetV3Mode', body: {} },
  // ── Hub ────────────────────────────────────────────────────
  { method: 'POST', path: '/hub/domains/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/assets/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/jobs/stats', body: {} },
  { method: 'POST', path: '/hub/job-logs/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/runners/list', body: {} },
  { method: 'POST', path: '/hub/themes/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/layouts/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/tabbars/list', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/hub/merchant/sites', body: {} },
  { method: 'POST', path: '/hub/web/config', body: {} },
  { method: 'POST', path: '/hub/web/game', body: {} },
  { method: 'POST', path: '/hub/debug/scheduler/org-tenant-list', body: {} },
  // ── Event ──────────────────────────────────────────────────
  { method: 'POST', path: '/event/metrics', body: {} },
  { method: 'POST', path: '/event/options', body: {} },
  { method: 'POST', path: '/event/admin/card-page', body: {} },
  { method: 'POST', path: '/event/admin/project', body: {} },
  { method: 'POST', path: '/event/admin/init/status', body: {} },
  { method: 'POST', path: '/event/admin/alarm/stats', body: {} },
  { method: 'POST', path: '/event/traffic/health', body: {} },
  { method: 'POST', path: '/event/traffic/metrics', body: {} },
  { method: 'POST', path: '/event/traffic/summary', body: {} },
  { method: 'POST', path: '/event/traffic/trend', body: {} },
  { method: 'POST', path: '/event/traffic/nodes', body: {} },
  // ── AI Assistant ────────────────────────────────────────────
  { method: 'POST', path: '/ai/metrics', body: {} },
  { method: 'POST', path: '/ai/health', body: {} },
  { method: 'POST', path: '/ai/chat/config', body: {} },
  { method: 'POST', path: '/ai/chat/sessions', body: { page: 1, pageSize: 20 } },
  { method: 'POST', path: '/ai/knowledge/queue/stats', body: {} },
  { method: 'POST', path: '/ai/knowledge/search', body: { q: 'test', limit: 5 } },
  { method: 'POST', path: '/ai/admin/escalation/stats', body: {} },
  { method: 'POST', path: '/ai/admin/feedback/stats', body: {} },
  { method: 'POST', path: '/ai/report/sessions', body: { page: 1, pageSize: 10 } },
  { method: 'POST', path: '/ai/report/alerts/config', body: {} },
  { method: 'POST', path: '/ai/report/failed-queries', body: { page: 1, pageSize: 10 } },
  { method: 'POST', path: '/ai/report/planner/stats', body: {} },
];
