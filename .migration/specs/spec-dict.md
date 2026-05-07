# 技术方案 E — 字典系统

## 背景

老项目字典体系有五条链路，分散在 `userStore` 和独立 `dynamicDictionaryStore` 里。
业务代码通过 `userStore.*` 直接读取，共 20+ 处调用。

## 五条链路全貌

| 链路 | 接口 | 加载时机 | 存储位置 | 业务调用方式 |
|------|------|---------|---------|------------|
| common | `POST /Common/GetDictionary` | 登录后立即 | `appUserStore.dictionary` | `userStore.getDictionaryList` |
| group | `api.system.getGroupData()` | 登录后立即 | `appUserStore.groupData` | `userStore.getGropuData` |
| v1 | `POST /v1/Common/GetDictionary` | 登录后立即 | `appUserStore.v1Dictionary` | `userStore.getV1Dictionary` |
| platform | `POST /Common/GetPlatformDic` | 部分页面按需 | `appUserStore.platformDic` | `userStore.getPlatformDic` |
| dynamic | `POST /Common/GetDynamicDictionary` | 按 key 懒加载 | `dynamicDictionaryStore.cache` | `dynamicDictionaryStore.load(key)` |

## appUserStore（迁移重点）

### 为什么不用 vben 的 useUserStore

vben 的 `useUserStore` 只有 `userInfo` 和 `userRoles`，供 layout 渲染用。
老项目 `userStore` 承载了**用户信息 + 字典 + 商户列表 + 权限**，是个 God Store。

**策略：新建 `src/store/app-user.ts`，完整迁入老项目 `userStore` 的所有内容**，业务代码全指向这里。vben 的 `useUserStore` 只做最小同步（头像/名称）。

### app-user.ts 关键结构

```ts
// src/store/app-user.ts
import { defineStore } from 'pinia';
import { api } from '#/api';
import type { DictionaryRsp } from '#/api/common';
import type { SysGropDictionaryRsp } from '#/api/system';
import type { DictionaryRsp as V1DictionaryRsp } from '#/api/v1platform';
import type { PlatformDicRsp } from '#/api/common';
import type { HomeSysUserInfoRsp } from '#/api/admin';

export type UserInfoType = HomeSysUserInfoRsp;

export const useAppUserStore = defineStore('app-user', {
  state: () => ({
    // 用户信息
    info: {} as Partial<UserInfoType>,
    // 五类字典
    dictionary: null as DictionaryRsp | null,
    groupData: null as SysGropDictionaryRsp | null,
    v1Dictionary: null as V1DictionaryRsp | null,
    platformDic: null as PlatformDicRsp | null,
    // 当前激活商户
    activeTenantId: null as number | null,
  }),

  getters: {
    // ─── 老项目 userStore getter 完整保留，业务代码零改动 ───
    getToken: (state) => state.info?.token ?? '',
    getAvatar: (state) => state.info?.avatar ?? '',
    getNickname: (state) => state.info?.nickname ?? '',
    getUserInfo: (state) => state.info,
    getPermissions: (state) => state.info?.permissions ?? [],
    // 权限码数组（供 accessStore.setAccessCodes 使用）
    getPermissionCodes: (state): string[] =>
      (state.info?.permissions ?? []).map((p: any) =>
        (p.value ?? p).toLowerCase()
      ),
    getDictionaryList: (state) => state.dictionary,
    getGropuData: (state) => state.groupData,
    getV1Dictionary: (state) => state.v1Dictionary,
    getPlatformDic: (state) => state.platformDic,
    getActiveTenantId: (state) => state.activeTenantId,
    getActiveTenant: (state) => {
      // 从 info.tenants 中找到 activeTenantId 对应的商户
      const tenants = (state.info as any)?.tenants ?? [];
      return tenants.find((t: any) => t.id === state.activeTenantId) ?? null;
    },
    isSuperAuthUser: (state): boolean =>
      Boolean((state.info as any)?.isSuperAuthUser),
    isPlatformUser: (state): boolean =>
      Boolean((state.info as any)?.isPlatformUser),
    getTenantGroups: (state) => {
      // 从老项目迁入 buildTenantGroups 逻辑
      return buildTenantGroups(state.info);
    },
    getTenantFlatList: (state) => {
      const groups = buildTenantGroups(state.info);
      return groups.flatMap(g => g.tenants);
    },
    getTenantRechargeLevelList: (state) =>
      (state.getActiveTenant as any)?.rechargeLevelList ?? [],
    getCurrentTimezone: (state) =>
      (state.info as any)?.timeZoneList?.[0] ?? null,
    getCurrentTimezoneLabel: (state) => {
      const tz = (state.info as any)?.timeZoneList?.[0];
      return tz ? getTimeZoneOffsetLabel(tz.timeZoneCode, tz.timeZoneValue) : '';
    },
    getCurrentCurrency: (state) =>
      (state.info as any)?.currentCurrency ??
      (state.info as any)?.currencyList?.[0]?.currencyCode ?? '',
    getCurrentLanguageName: (state) =>
      (state.info as any)?.languageList?.[0]?.name ?? '',
    getV3OssImageUrl: (state) => (state.info as any)?.v3OssImageUrl ?? '',
  },

  actions: {
    // ─── 用户信息 ───
    async fetchUserInfo() {
      const { data } = await api.admin.homeBasic();
      this.info = data;
      this.activeTenantId = (data as any)?.activeTenantId ?? null;
    },

    setActiveTenantId(id: number | null) {
      this.activeTenantId = id;
    },

    // ─── 字典加载 ───
    async getDictionary() {
      const { data, code } = await api.common.getDictionary();
      if (code !== 0) return;
      this.dictionary = data;
    },

    async getDictionaryDetail() {
      const { data, code } = await api.system.getGroupData();
      if (code !== 0) return;
      this.groupData = data;
    },

    async loadV1Dictionary() {
      const { data, code } = await api.v1platform.getDictionary();
      if (code !== 0) return;
      this.v1Dictionary = data;
    },

    async loadPlatformDic() {
      const { data, code } = await api.common.getPlatformDic();
      if (code !== 0) return;
      this.platformDic = data;
    },

    // 登录后批量加载（common + group + v1）
    async loadBaseDicts() {
      await Promise.allSettled([
        this.getDictionary(),
        this.getDictionaryDetail(),
        this.loadV1Dictionary(),
      ]);
    },

    async logout() {
      this.$reset();
    },

    // ─── 兼容老项目调用方式的别名 ───
    getInfo() {
      return this.fetchUserInfo();
    },
    login() {
      // login 实际在 authStore 里，这里只是类型兼容占位
      throw new Error('use authStore.login instead');
    },
  },
});
```

## dynamicDictionaryStore（直接搬，不重构）

老项目 `src/store/modules/dynamicDictionary.ts` 设计完善：
- 按 key 缓存（STALE_AFTER_MS = 5分钟）
- in-flight 去重（pending map）
- 批量拉取（loadMany）
- 强类型 Map（DynamicDictionaryItemMap）

**迁移步骤：**
1. 整块复制到 `src/store/dynamic-dictionary.ts`
2. 修改 import 路径：`@/api/common` → `#/api/common`
3. 不改任何业务逻辑

## useDictionary hook（直接搬）

老项目 `src/components/DictSelect/useDictionary.ts` 整块迁入：
- 修改 import：`@/store/modules` → `#/store/app-user`
- `useUserStore` → `useAppUserStore`
- 其余不变

## DictSelect 组件（直接搬）

整块迁入 `src/components/DictSelect/`，只改 import 路径。
主题色使用 CSS 变量（检查有无硬编码颜色，如有替换为 `var(--primary-color)`）。

## 调用方兼容清单

业务代码里 `userStore.xxx` → 迁移后 `appUserStore.xxx`，getter/action 名称不变：

| 老调用 | 新调用 | 次数 |
|--------|--------|------|
| `userStore.info` | `appUserStore.info` | 24 |
| `userStore.isSuperAuthUser` | `appUserStore.isSuperAuthUser` | 15 |
| `userStore.getActiveTenantId` | `appUserStore.getActiveTenantId` | 10 |
| `userStore.getDictionaryList` | `appUserStore.getDictionaryList` | 2 |
| `userStore.getDictionary()` | `appUserStore.getDictionary()` | 3 |
| `userStore.getDictionaryDetail()` | `appUserStore.getDictionaryDetail()` | 3 |
| `userStore.getGropuData` | `appUserStore.getGropuData` | 3 |
| `userStore.loadPlatformDic()` | `appUserStore.loadPlatformDic()` | 3 |
| `userStore.isPlatformUser` | `appUserStore.isPlatformUser` | 5 |
| `userStore.getPermissions` | `appUserStore.getPermissions` | 5 |
| `userStore.logout()` | `authStore.logout()` | 4 |
| `userStore.getTenantGroups` | `appUserStore.getTenantGroups` | 3 |
| `userStore.getTenantFlatList` | `appUserStore.getTenantFlatList` | 3 |
| `userStore.getCurrentTimezone` | `appUserStore.getCurrentTimezone` | 3 |

**迁移工具**：用全局替换 `from '@/store/modules'` → `from '#/store'`，并将 `useUserStore` 调用改为 `useAppUserStore`（注意区分 vben 的 `useUserStore` 和老项目的，import 来源不同）。

## 验证方法

1. 登录后：`appUserStore.dictionary` 有值，`appUserStore.groupData` 有值
2. 进入依赖 platformDic 的页面（operations/siteList）：`appUserStore.platformDic` 被加载
3. `dynamicDictionaryStore.load('withdrawCategoryList')` 返回数据
4. `DictSelect` 组件在表单里能渲染下拉选项
5. e2e: `smoke/dict-loading.spec.ts` 通过
