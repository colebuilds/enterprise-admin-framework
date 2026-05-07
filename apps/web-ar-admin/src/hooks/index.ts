// TODO: Phase 1.3 — implement full useTenantOptions when app-user store is ready
export { usePermission } from './web/usePermission';

export interface TenantOption {
  label: string;
  value: number;
  id: number;
  timezone?: string;
}

export function useTenantOptions() {
  return {
    tenantOptions: [] as TenantOption[],
    tenantMap: {} as Record<number, TenantOption>,
    getTenantLabel: (_id: number) => '',
    getTenantTimezone: (_id: number) => 'UTC',
  };
}
