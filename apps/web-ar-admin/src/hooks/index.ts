import { h, ref } from 'vue';

export { usePermission } from './usePermission';

export interface TenantOption {
  label: string;
  value: number;
  id: number;
  timezone?: string;
}

// Phase 1 stub — replace with real implementation when tenant store is ready
export function useTenantOptions() {
  const tenantOptions = ref<TenantOption[]>([]);
  const tenantCascaderOptions = ref<any[]>([]);
  const defaultTenantId = ref<null | number>(null);
  const activeTenantId = ref<null | number>(null);
  const loading = ref(false);
  return {
    tenantOptions,
    tenantCascaderOptions,
    tenantMap: {} as Record<number, TenantOption>,
    defaultTenantId,
    activeTenantId,
    loading,
    getTenantLabel: (_id: number, _fallback?: string) => '',
    getTenantTimezone: (_id: number) => 'UTC',
    getTenantTimeZone: (_id: number) => 'UTC',
    getOrgName: (_id: number, _fallback?: string) => '',
    load: async () => {},
    formatTenantDateTime: (
      _date: Date | null | string,
      _tenantId: null | number,
      _format?: string,
      _fallback?: string,
    ) => '',
    renderTenantDateTimeColumnTitle: (
      title: string,
      _tenantId: null | number,
    ) => h('span', title),
  };
}
