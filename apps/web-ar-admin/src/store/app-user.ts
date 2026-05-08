import type { HomeSysUserInfoRsp, TenantInfoRsp } from '#/api/admin';

import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

export type UserInfoType = HomeSysUserInfoRsp;

export interface UserTenantItem extends TenantInfoRsp {
  orgName: string;
}

export interface UserTenantGroupItem {
  orgId: number;
  orgName: string;
  tenants: UserTenantItem[];
}

const ACTIVE_TENANT_STORAGE_KEY = 'ar-admin:active-tenant-id';

function pickFirstText(...values: Array<null | string | undefined>): string {
  return values.find((v) => typeof v === 'string' && v.trim() !== '') ?? '';
}

function buildTenantGroups(
  info?: null | Partial<UserInfoType>,
): UserTenantGroupItem[] {
  const groups: UserTenantGroupItem[] = [];
  const groupMap = new Map<number, UserTenantGroupItem>();
  const seenIds = new Set<number>();

  const ensureGroup = (orgId?: number, orgName?: string) => {
    if (typeof orgId !== 'number') return null;
    const existing = groupMap.get(orgId);
    if (existing) {
      if (!existing.orgName && orgName) existing.orgName = orgName;
      return existing;
    }
    const group: UserTenantGroupItem = {
      orgId,
      orgName: pickFirstText(orgName) || String(orgId),
      tenants: [],
    };
    groupMap.set(orgId, group);
    groups.push(group);
    return group;
  };

  for (const item of info?.orgList ?? []) ensureGroup(item.id, item.name);
  ensureGroup(info?.orgId, info?.orgName);

  for (const item of info?.tenantList ?? []) {
    if (seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    const group = ensureGroup(
      item.orgId,
      groupMap.get(item.orgId)?.orgName ?? info?.orgName,
    );
    if (!group) continue;
    group.tenants.push({ ...item, orgName: group.orgName });
  }

  return groups;
}

export const useAppUserStore = defineStore('app-user', () => {
  const info = ref<UserInfoType>({} as UserInfoType);
  const activeTenantId = ref<null | number>(null);

  const isPlatformUser = computed(() => info.value?.orgId === 0);
  const isSuperAuthUser = computed(() => Boolean(info.value?.isSuperAuthUser));

  const getTenantGroups = computed(() => buildTenantGroups(info.value));

  const getTenantFlatList = computed(() =>
    getTenantGroups.value.flatMap((g) => g.tenants),
  );

  const getTenantMap = computed(
    () =>
      new Map<number, UserTenantItem>(
        getTenantFlatList.value.map((t) => [t.id, t]),
      ),
  );

  function getTenantById(id?: null | number): null | UserTenantItem {
    return typeof id === 'number' ? (getTenantMap.value.get(id) ?? null) : null;
  }

  const getActiveTenant = computed(() => getTenantById(activeTenantId.value));

  const getActiveTenantGroup = computed(() => {
    const tenant = getActiveTenant.value;
    if (!tenant) return null;
    return getTenantGroups.value.find((g) => g.orgId === tenant.orgId) ?? null;
  });

  const getPermissionCodes = computed<string[]>(() => {
    const codes: string[] = [];
    const walk = (nodes: UserInfoType['menus']) => {
      for (const node of nodes ?? []) {
        if (node.authCode) codes.push(node.authCode.toLowerCase());
        if (node.children?.length) walk(node.children);
      }
    };
    walk(info.value?.menus);
    return codes;
  });

  function setUserInfo(newInfo: UserInfoType) {
    info.value = newInfo;
    _syncActiveTenantId();
  }

  function setActiveTenantId(tenantId: null | number) {
    if (tenantId === null) {
      activeTenantId.value = null;
      localStorage.removeItem(ACTIVE_TENANT_STORAGE_KEY);
      return;
    }
    const found = getTenantFlatList.value.find((t) => t.id === tenantId);
    activeTenantId.value = found
      ? tenantId
      : (getTenantFlatList.value[0]?.id ?? null);
    if (activeTenantId.value !== null) {
      localStorage.setItem(
        ACTIVE_TENANT_STORAGE_KEY,
        String(activeTenantId.value),
      );
    }
  }

  function _syncActiveTenantId() {
    const tenants = getTenantFlatList.value;
    if (tenants.length === 0) {
      activeTenantId.value = null;
      return;
    }
    const stored = localStorage.getItem(ACTIVE_TENANT_STORAGE_KEY);
    const storedId = stored === null ? null : Number(stored);
    const preferred =
      storedId === null ? undefined : tenants.find((t) => t.id === storedId);
    const valid =
      preferred ?? tenants.find((t) => t.id === activeTenantId.value);
    activeTenantId.value = valid ? valid.id : (tenants[0]?.id ?? null);
  }

  function $reset() {
    info.value = {} as UserInfoType;
    activeTenantId.value = null;
    localStorage.removeItem(ACTIVE_TENANT_STORAGE_KEY);
  }

  return {
    info,
    activeTenantId,
    isPlatformUser,
    isSuperAuthUser,
    getTenantGroups,
    getTenantFlatList,
    getTenantMap,
    getTenantById,
    getActiveTenant,
    getActiveTenantGroup,
    getPermissionCodes,
    setUserInfo,
    setActiveTenantId,
    $reset,
  };
});
