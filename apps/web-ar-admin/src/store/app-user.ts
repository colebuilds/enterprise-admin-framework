import type { HomeSysUserInfoRsp, TenantInfoRsp } from '#/api/admin';
import type { DictionaryRsp, PlatformDicRsp } from '#/api/common';
import type { DictionaryRsp as V1DictionaryRsp } from '#/api/v1platform/types';

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

function flattenTenants(groups: UserTenantGroupItem[]): UserTenantItem[] {
  return groups.flatMap((g) => g.tenants);
}

export interface IAppUserState {
  info: UserInfoType;
  activeTenantId: null | number;
  dictionary: DictionaryRsp | null;
  v1Dictionary: null | V1DictionaryRsp;
  platformDic: null | PlatformDicRsp;
  gropuData: any;
}

export const useAppUserStore = defineStore('app-user', {
  state: (): IAppUserState => ({
    info: {} as UserInfoType,
    activeTenantId: null,
    dictionary: null,
    v1Dictionary: null,
    platformDic: null,
    gropuData: null,
  }),

  getters: {
    getUserInfo: (state): UserInfoType => state.info,
    getActiveTenantId: (state): null | number => state.activeTenantId,
    getDictionaryList: (state): DictionaryRsp | null => state.dictionary,
    getV1Dictionary: (state): null | V1DictionaryRsp => state.v1Dictionary,
    getPlatformDic: (state): null | PlatformDicRsp => state.platformDic,
    getGropuData: (state): any => state.gropuData,

    isPlatformUser: (state): boolean => state.info?.orgId === 0,
    isSuperAuthUser: (state): boolean => Boolean(state.info?.isSuperAuthUser),

    getTenantGroups(): UserTenantGroupItem[] {
      return buildTenantGroups(this.info);
    },
    getTenantFlatList(): UserTenantItem[] {
      return flattenTenants(this.getTenantGroups);
    },
    getTenantMap(): Record<number, UserTenantItem> {
      return Object.fromEntries(this.getTenantFlatList.map((t) => [t.id, t]));
    },
    getTenantById(): (id?: null | number) => null | UserTenantItem {
      return (id) =>
        typeof id === 'number' ? (this.getTenantMap[id] ?? null) : null;
    },
    getActiveTenant(): null | UserTenantItem {
      return this.getTenantById(this.activeTenantId);
    },

    /** Permission codes extracted from menus tree (lowercase). */
    getPermissionCodes(): string[] {
      const codes: string[] = [];
      const walk = (nodes: UserInfoType['menus']) => {
        for (const node of nodes ?? []) {
          if (node.authCode) codes.push(node.authCode.toLowerCase());
          if (node.children?.length) walk(node.children);
        }
      };
      walk(this.info?.menus);
      return codes;
    },
  },

  actions: {
    setUserInfo(info: UserInfoType) {
      this.info = info;
      this._syncActiveTenantId();
    },

    setActiveTenantId(tenantId: null | number) {
      if (tenantId === null) {
        this.activeTenantId = null;
        return;
      }
      const tenants = this.getTenantFlatList;
      const found = tenants.find((t) => t.id === tenantId);
      this.activeTenantId = found ? tenantId : (tenants[0]?.id ?? null);
    },

    _syncActiveTenantId() {
      const tenants = this.getTenantFlatList;
      if (tenants.length === 0) {
        this.activeTenantId = null;
        return;
      }
      const valid = tenants.find((t) => t.id === this.activeTenantId);
      this.activeTenantId = valid
        ? this.activeTenantId
        : (tenants[0]?.id ?? null);
    },

    setDictionary(dictionary: DictionaryRsp) {
      this.dictionary = dictionary;
    },
    setPlatformDic(platformDic: PlatformDicRsp) {
      this.platformDic = platformDic;
    },

    $reset() {
      this.info = {} as UserInfoType;
      this.activeTenantId = null;
      this.dictionary = null;
      this.v1Dictionary = null;
      this.platformDic = null;
      this.gropuData = null;
    },
  },
});
