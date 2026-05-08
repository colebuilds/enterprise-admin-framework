# Tenant Switch + Multi-Timezone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the tenant-switching header widget (with per-tenant live timezone clock) to the new vben-based app.

**Architecture:** `useAppUserStore` already holds tenant groups and `setActiveTenantId`; we add `getActiveTenantGroup` (computed) + localStorage persistence so the selected tenant survives the `router.go(0)` full-page reload that switching triggers. `HeaderTenant.vue` is a near-verbatim port of the old component (`feat1-ar_platform_admin/src/layout/components/Header/HeaderTenant.vue`) with import paths and store references updated. It mounts via the vben `header-left-10` slot in `layouts/basic.vue`.

**Tech Stack:** Vue 3 Composition API, Pinia, Naive UI (NPopover/NTag/NInput/NIcon), @vueuse/core (useWindowSize), vue-i18n, vue-router, @vicons/antd

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/web-ar-admin/src/store/app-user.ts` | Modify | Add `getActiveTenantGroup` computed; add localStorage read/write for `activeTenantId` |
| `apps/web-ar-admin/src/utils/dateUtil.ts` | Modify | Remove `as any` cast; use proper `HomeSysUserInfoRsp.timeZoneList` type |
| `apps/web-ar-admin/src/layouts/components/HeaderTenant.vue` | Create | Tenant-switcher header widget; ported from old project |
| `apps/web-ar-admin/src/layouts/basic.vue` | Modify | Mount HeaderTenant via `<template #header-left-10>` |

---

### Task 1: Update useAppUserStore — getActiveTenantGroup + localStorage

**Files:**
- Modify: `apps/web-ar-admin/src/store/app-user.ts`

**Context:** After `setActiveTenantId(id)` the app calls `router.go(0)` for a full page reload. The store re-initializes from scratch, and `_syncActiveTenantId()` currently defaults to `tenants[0]` — losing the user's selection. We persist to localStorage so the selection survives the reload.

`getActiveTenantGroup` is used by `HeaderTenant.vue` to display the org/group name for the active tenant. The old project already calls `userStore.getActiveTenantGroup?.orgName` in `tenantDisplay`.

- [ ] **Step 1: Replace `apps/web-ar-admin/src/store/app-user.ts` with the updated implementation**

```ts
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
    const storedId = stored !== null ? Number(stored) : null;
    const preferred =
      storedId !== null ? tenants.find((t) => t.id === storedId) : undefined;
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/web-ar-admin && pnpm run type-check 2>&1 | head -30`

Expected: No new errors related to `app-user.ts`.

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/src/store/app-user.ts
git commit -m "feat(@vben/web-ar-admin): add getActiveTenantGroup + localStorage persistence to useAppUserStore"
```

---

### Task 2: Fix dateUtil.ts timeZoneList type

**Files:**
- Modify: `apps/web-ar-admin/src/utils/dateUtil.ts`

**Context:** `HomeSysUserInfoRsp` already has `timeZoneList: CountAndTimeZoneInfoRsp[]` typed. The `as any` cast and TODO comments are no longer needed.

- [ ] **Step 1: Remove `as any` casts in `getCurrentTimeZoneCode` and `getCurrentTimeZoneValue`**

In `getCurrentTimeZoneCode` (around line 37), replace:
```ts
// TODO: fix type — useAppUserStore has no timeZoneList; wire to user info when available
return (useAppUserStore().info as any)?.timeZoneList?.[0]?.timeZoneCode ?? '';
```
With:
```ts
return useAppUserStore().info.timeZoneList?.[0]?.timeZoneCode ?? '';
```

In `getCurrentTimeZoneValue` (around line 46), replace:
```ts
// TODO: fix type — useAppUserStore has no timeZoneList; wire to user info when available
return (
  (useAppUserStore().info as any)?.timeZoneList?.[0]?.timeZoneValue ?? ''
);
```
With:
```ts
return useAppUserStore().info.timeZoneList?.[0]?.timeZoneValue ?? '';
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/web-ar-admin && pnpm run type-check 2>&1 | grep -i dateUtil`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/src/utils/dateUtil.ts
git commit -m "fix(@vben/web-ar-admin): remove as-any cast for timeZoneList in dateUtil"
```

---

### Task 3: Create HeaderTenant.vue

**Files:**
- Create: `apps/web-ar-admin/src/layouts/components/HeaderTenant.vue`

**Context:** Port of `feat1-ar_platform_admin/src/layout/components/Header/HeaderTenant.vue`.
Changes from old project:
1. `import { useUserStore } from '@/store/modules'` → `import { useAppUserStore } from '#/store/app-user'`
2. `import { ..., } from '@/utils/dateUtil'` → `from '#/utils/dateUtil'`
3. All `userStore.` → `appUserStore.`

The live clock update (`setInterval` → direct DOM mutation on `clockTextRef.value.textContent`) is intentional — it avoids Naive UI NPopover slot re-render warnings by bypassing Vue's reactivity for the 1-second tick.

All i18n keys used (`common.header.*`, `common.profile.*`, `common.noData`) are already present in both `zh-CN/common.json` and `en-US/common.json`.

- [ ] **Step 1: Create `apps/web-ar-admin/src/layouts/components/HeaderTenant.vue`**

```vue
<template>
  <n-popover
    trigger="click"
    :disabled="!canSwitchTenant"
    placement="bottom-start"
    :show-arrow="false"
    class="tenant-popover-overlay"
    content-style="padding: 0; background: transparent; box-shadow: none; border: 0;"
    raw
    v-model:show="popoverVisible"
    @update:show="handlePopoverVisibleChange"
  >
    <template #trigger>
      <button
        ref="tenantTriggerRef"
        type="button"
        class="header-tenant inline-flex h-full min-w-0 items-center justify-center rounded border-0 bg-transparent px-3 max-[1180px]:px-2"
        :class="{
          'header-tenant--clickable': canSwitchTenant,
          'header-tenant--open': popoverVisible,
        }"
        :style="tenantPanelWidthStyle"
        :title="tenantTitle"
      >
        <div
          class="header-tenant__identity flex w-full max-w-full min-w-0 flex-col items-center justify-center text-center"
        >
          <div
            class="header-tenant__time flex max-w-full items-center gap-1 whitespace-nowrap text-[12px] font-semibold leading-[1.35] max-[1180px]:hidden"
            :title="timezoneTitle"
          >
            <n-icon size="12" class="header-tenant__clock-icon opacity-85">
              <ClockCircleOutlined />
            </n-icon>
            <span ref="clockTextRef" class="header-tenant__clock-text tracking-[0.5px]">{{
              formattedTime
            }}</span>
            <span
              v-if="clockTimezoneLabel"
              class="header-tenant__clock-zone text-[11px] font-medium opacity-75"
            >
              {{ clockTimezoneLabel }}
            </span>
          </div>
          <div
            class="header-tenant__meta flex max-w-full items-center justify-center gap-1.5 whitespace-nowrap text-[12px] font-medium leading-[1.35]"
          >
            <span class="truncate max-w-[112px]" :title="tenantDisplay.groupName">
              {{ tenantDisplay.groupName }}
            </span>
            <span
              v-if="!isPlatformSide"
              class="header-tenant__pill inline-flex min-w-0 items-center gap-1 rounded-full px-2 text-[11px] font-semibold"
              :title="tenantDisplay.tenantTitle"
            >
              <span class="truncate">{{ tenantDisplay.tenantName }}</span>
            </span>
            <span
              v-if="canSwitchTenant"
              class="header-tenant__switch inline-flex items-center gap-0.5"
              :title="switchTitle"
            >
              <span class="text-[11px] font-medium">{{
                t('common.header.switchTenantShort')
              }}</span>
              <n-icon
                size="12"
                class="header-tenant__arrow opacity-72 transition-transform duration-200"
                :class="popoverVisible ? 'rotate-180' : ''"
              >
                <DownOutlined />
              </n-icon>
            </span>
          </div>
        </div>
      </button>
    </template>
    <n-el tag="div" class="tenant-popover" :style="tenantPopoverStyle">
      <div class="tenant-popover__search px-2 pb-2 pt-2">
        <n-input
          v-model:value="tenantKeyword"
          size="small"
          clearable
          :placeholder="t('common.header.searchTenantPlaceholder')"
        >
          <template #prefix>
            <n-icon size="14" class="tenant-popover__search-icon">
              <SearchOutlined />
            </n-icon>
          </template>
        </n-input>
      </div>
      <div class="tenant-popover__body">
        <template v-if="visibleTenantGroups.length">
          <section
            v-for="group in visibleTenantGroups"
            :key="group.orgId"
            class="tenant-popover__group"
          >
            <div class="flex items-center justify-between gap-2.5 px-2 pb-1">
              <span class="tenant-popover__group-name min-w-0 truncate text-[12px] font-semibold">
                {{ group.orgName }}
              </span>
              <span
                class="tenant-popover__group-count min-w-[22px] shrink-0 rounded-full px-1.5 text-center text-[11px] leading-[18px]"
              >
                {{ group.tenants.length }}
              </span>
            </div>
            <div class="tenant-popover__tenant-grid">
              <button
                v-for="tenant in group.tenants"
                :key="tenant.id"
                type="button"
                class="tenant-popover__item relative flex w-full items-center rounded-lg border-0 bg-transparent py-2 pl-2.5 pr-[30px] text-left text-inherit"
                :class="{ 'tenant-popover__item--active': tenant.id === currentTenantId }"
                @click="handleTenantChange(tenant.id)"
              >
                <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span class="tenant-popover__tenant-name truncate text-[13px] font-semibold">
                    {{ tenant.name }}
                  </span>
                  <span
                    class="tenant-popover__tenant-meta flex min-w-0 items-center gap-1.5 text-[11px] tracking-[0.04em]"
                  >
                    <span>#{{ tenant.id }}</span>
                    <n-tag
                      v-if="tenant.supportSysCurrency"
                      size="small"
                      type="success"
                      class="tenant-popover__currency-tag"
                    >
                      {{ tenant.supportSysCurrency }}
                    </n-tag>
                    <span v-if="tenant.timeZone" class="tenant-popover__timezone truncate">{{
                      resolveTenantTimezone(tenant.timeZone)
                    }}</span>
                  </span>
                </span>
                <n-icon
                  v-if="tenant.id === currentTenantId"
                  size="14"
                  class="tenant-popover__check"
                >
                  <CheckOutlined />
                </n-icon>
              </button>
            </div>
          </section>
        </template>
        <div
          v-else
          class="tenant-popover__empty flex min-h-[120px] items-center justify-center px-4 text-center"
        >
          {{ t('common.header.noTenantMatch') }}
        </div>
      </div>
    </n-el>
  </n-popover>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';

import { CheckOutlined, ClockCircleOutlined, DownOutlined, SearchOutlined } from '@vicons/antd';
import { useWindowSize } from '@vueuse/core';
import { NEl, NIcon, NInput, NPopover, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useAppUserStore } from '#/store/app-user';
import {
  formatToCurrentZone,
  formatToTimeZone,
  getTimeZoneOffsetLabel,
} from '#/utils/dateUtil';

const TENANT_PANEL_COMPACT_BREAKPOINT = 1180;

const { t } = useI18n();
const router = useRouter();
const appUserStore = useAppUserStore();

const { width: viewportWidth } = useWindowSize();
const popoverVisible = ref(false);
const tenantKeyword = ref('');
const tenantTriggerRef = ref<HTMLElement | null>(null);
const lockedTenantWidth = ref<string>();
const isPlatformSide = computed(() => appUserStore.isPlatformUser);
const isCompactViewport = computed(
  () => viewportWidth.value <= TENANT_PANEL_COMPACT_BREAKPOINT,
);

const tenantGroups = computed(() =>
  appUserStore.getTenantGroups.filter((item) => item.tenants.length),
);
const tenantFlatList = computed(() => appUserStore.getTenantFlatList);
const currentTenant = computed(() =>
  isPlatformSide.value
    ? null
    : appUserStore.getActiveTenant || tenantFlatList.value[0] || null,
);
const currentTenantId = computed(() => currentTenant.value?.id ?? null);
const currentTenantOrgId = computed(() => currentTenant.value?.orgId ?? null);
const canSwitchTenant = computed(
  () => !isPlatformSide.value && tenantFlatList.value.length > 1,
);

// Live clock: direct DOM update avoids Naive UI NPopover slot re-render warnings.
const clockTextRef = ref<HTMLElement | null>(null);
const timestamp = shallowRef(Date.now());
let _clockTimer: ReturnType<typeof setInterval> | null = null;

function formatTimeForTenant(value: number): string {
  const tz = currentTenant.value?.timeZone;
  return tz ? formatToTimeZone(value, tz) : String(formatToCurrentZone(value));
}

onMounted(() => {
  _clockTimer = setInterval(() => {
    if (!clockTextRef.value) return;
    clockTextRef.value.textContent = formatTimeForTenant(Date.now());
  }, 1000);
});
onUnmounted(() => {
  if (_clockTimer !== null) clearInterval(_clockTimer);
});

const formattedTime = computed(() => formatTimeForTenant(timestamp.value));
const clockTimezoneLabel = computed(() => {
  const tz = currentTenant.value?.timeZone;
  return tz ? getTimeZoneOffsetLabel(tz, tz) : '';
});
const timezoneTitle = computed(() => {
  const label = clockTimezoneLabel.value;
  return label
    ? `${t('common.header.timezone')}: ${label}`
    : t('common.header.timezone');
});

function resolveTenantTimezone(raw?: string): string {
  return raw ? getTimeZoneOffsetLabel(raw, raw) : '';
}

const tenantDisplay = computed(() => {
  const platformSideLabel = t('common.profile.platformSide');
  const systemSideLabel = t('common.profile.systemSide');

  if (isPlatformSide.value) {
    return {
      groupName: appUserStore.info.orgName || platformSideLabel,
      metaLabel: systemSideLabel,
      tenantName: platformSideLabel,
      tenantTitle: `${systemSideLabel}: ${platformSideLabel}`,
    };
  }

  const tenant = currentTenant.value;
  const groupName =
    tenant?.orgName ||
    appUserStore.getActiveTenantGroup?.orgName ||
    tenantGroups.value.find((item) => item.orgId === tenant?.orgId)?.orgName ||
    appUserStore.info.orgName ||
    '--';

  return {
    groupName,
    metaLabel: t('common.header.tenant'),
    tenantName: tenant ? `(${tenant.id})${tenant.name}` : '--',
    tenantTitle: tenant
      ? `${tenant.name} (#${tenant.id})`
      : t('common.noData'),
  };
});

const tenantTitle = computed(() =>
  [tenantDisplay.value.groupName, tenantDisplay.value.tenantTitle, timezoneTitle.value]
    .filter(Boolean)
    .join(' · '),
);
const switchTitle = computed(() =>
  t('common.header.switchTenant', { count: tenantFlatList.value.length }),
);
const normalizedTenantKeyword = computed(() => normalizeKeyword(tenantKeyword.value));

const tenantPanelWidthStyle = computed(() => {
  if (!lockedTenantWidth.value) return undefined;
  const width = lockedTenantWidth.value;
  return { maxWidth: width, minWidth: width, width };
});
const tenantPopoverStyle = computed(() => {
  if (!lockedTenantWidth.value) return undefined;
  const baseWidth = Number.parseFloat(lockedTenantWidth.value);
  if (!Number.isFinite(baseWidth)) return tenantPanelWidthStyle.value;
  const width = `min(${Math.round(baseWidth * 2)}px, calc(100vw - 24px))`;
  return { maxWidth: 'calc(100vw - 24px)', minWidth: width, width };
});

const visibleTenantGroups = computed(() => {
  const keyword = normalizedTenantKeyword.value;
  const groups = tenantGroups.value
    .map((group) => {
      const tenants = keyword
        ? group.tenants.filter((tenant) =>
            matchesTenantKeyword(tenant, group.orgName, keyword),
          )
        : group.tenants;
      return { ...group, tenants };
    })
    .filter((group) => group.tenants.length);

  if (!keyword && currentTenantOrgId.value !== null) {
    groups.sort((first, second) => {
      const firstWeight = first.orgId === currentTenantOrgId.value ? 0 : 1;
      const secondWeight = second.orgId === currentTenantOrgId.value ? 0 : 1;
      return firstWeight - secondWeight;
    });
  }

  return groups;
});

function handleTenantChange(key: number | string) {
  const tenantId = Number(key);
  if (Number.isNaN(tenantId) || tenantId === currentTenantId.value) return;
  popoverVisible.value = false;
  appUserStore.setActiveTenantId(tenantId);
  router.go(0);
}

function handlePopoverVisibleChange(show: boolean) {
  if (!show) {
    tenantKeyword.value = '';
  }
}

async function lockTenantPanelWidth() {
  lockedTenantWidth.value = undefined;
  await nextTick();
  const width = tenantTriggerRef.value?.offsetWidth;
  if (!width) return;
  lockedTenantWidth.value = `${width}px`;
}

function normalizeKeyword(value: string) {
  return value.trim().toLocaleLowerCase();
}

function matchesTenantKeyword(
  tenant: { id: number; name?: string; orgName?: string },
  groupName: string,
  keyword: string,
) {
  return [tenant.name, tenant.orgName, groupName, String(tenant.id)]
    .filter(Boolean)
    .some((item) => String(item).toLocaleLowerCase().includes(keyword));
}

onMounted(() => {
  void lockTenantPanelWidth();
});

watch(isCompactViewport, () => {
  void lockTenantPanelWidth();
});
</script>

<style lang="less">
.tenant-popover-overlay {
  &.n-popover {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
  }
}
</style>

<style scoped>
.header-tenant {
  color: #fff;
  transition: background-color 0.2s;
}

.header-tenant--clickable {
  cursor: pointer;
}

.header-tenant--clickable:hover {
  background: rgb(255 255 255 / 0.08);
}

.header-tenant--open {
  background: rgb(255 255 255 / 0.1);
}

.header-tenant__time {
  color: #fff;
}

.header-tenant__meta {
  color: rgb(255 255 255 / 0.72);
}

.header-tenant__pill {
  min-height: 20px;
  border: 1px solid rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.12);
  color: #fff;
}

.header-tenant__switch {
  color: rgb(255 255 255 / 0.86);
}

.header-tenant--clickable:hover .header-tenant__switch {
  color: #fff;
}

.header-tenant__clock-text {
  font-variant-numeric: tabular-nums;
}

.tenant-popover {
  box-sizing: border-box;
  padding: 8px;
  color: var(--text-color-1);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--popover-color);
  box-shadow: var(--popover-box-shadow);
}

.tenant-popover__search {
  border-bottom: 1px solid var(--divider-color);
}

.tenant-popover__search-icon {
  color: var(--text-color-3);
}

.tenant-popover__group-name {
  color: var(--text-color-2);
}

.tenant-popover__group-count {
  background: var(--hover-color);
  color: var(--text-color-2);
}

.tenant-popover__tenant-name {
  color: var(--text-color-1);
}

.tenant-popover__tenant-meta {
  color: var(--text-color-3);
}

.tenant-popover__currency-tag {
  flex-shrink: 0;
}

.tenant-popover__timezone {
  max-width: 58px;
}

.tenant-popover__body {
  max-height: min(600px, calc(100vh - 120px));
  padding: 2px;
  overflow: auto;
}

.tenant-popover__tenant-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5px;
}

.tenant-popover__body::-webkit-scrollbar {
  width: 6px;
}

.tenant-popover__body::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: var(--border-color);
}

.tenant-popover__group + .tenant-popover__group {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--divider-color);
}

.tenant-popover__item {
  cursor: pointer;
  box-shadow: inset 0 0 0 1px var(--border-color);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.tenant-popover__item:hover {
  background: var(--hover-color);
  box-shadow: inset 0 0 0 1px var(--primary-color);
}

.tenant-popover__item--active {
  background: var(--hover-color);
  box-shadow: inset 0 0 0 1px var(--primary-color);
}

.tenant-popover__check {
  position: absolute;
  top: 50%;
  right: 10px;
  color: var(--primary-color);
  transform: translateY(-50%);
}

.tenant-popover__empty {
  font-size: 12px;
  color: var(--text-color-3);
}

@media (max-width: 640px) {
  .tenant-popover__tenant-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/web-ar-admin && pnpm run type-check 2>&1 | head -40`

Expected: No errors in `HeaderTenant.vue`.

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/src/layouts/components/HeaderTenant.vue
git commit -m "feat(@vben/web-ar-admin): port HeaderTenant.vue — tenant switch + live timezone clock"
```

---

### Task 4: Wire HeaderTenant into basic.vue

**Files:**
- Modify: `apps/web-ar-admin/src/layouts/basic.vue`

**Context:** vben's `BasicLayout` exposes dynamic `header-left-N` slots (ordered by N) for the left side of the app header. N=0 is the page-refresh button. Using `header-left-10` places the tenant widget just after the refresh button. The `<template #header-left-10>` syntax passes the slot through `BasicLayout` to the inner header component.

- [ ] **Step 1: Add HeaderTenant import to `<script>` section of `basic.vue`**

After the existing import block, add:
```ts
import HeaderTenant from '#/layouts/components/HeaderTenant.vue';
```

- [ ] **Step 2: Add slot in `<template>` inside `<BasicLayout>`**

Before the `<template #user-dropdown>` block, add:
```html
<template #header-left-10>
  <HeaderTenant />
</template>
```

- [ ] **Step 3: Start dev server and visually verify**

Run: `pnpm --filter @vben/web-ar-admin dev`

Open `http://localhost:5900` and verify:
1. HeaderTenant appears in the top-left header area (left of breadcrumb)
2. Shows tenant name and live clock ticking every second
3. Clicking opens the tenant switcher popover with search box
4. Selecting a different tenant triggers `router.go(0)` reload, and the new tenant remains selected after reload (localStorage persistence)

- [ ] **Step 4: Commit**

```bash
git add apps/web-ar-admin/src/layouts/basic.vue
git commit -m "feat(@vben/web-ar-admin): wire HeaderTenant into layout header-left-10 slot"
```

---

## Self-Review

**Spec coverage:**
- ✅ Tenant switching with popover + keyword search — Task 3 (HeaderTenant.vue)
- ✅ Selection persists after `router.go(0)` reload — Task 1 (localStorage in `_syncActiveTenantId`)
- ✅ Live per-tenant timezone clock — Task 3 (`setInterval` → direct DOM update)
- ✅ Multi-timezone display in popover items — Task 3 (`resolveTenantTimezone` / `getTimeZoneOffsetLabel`)
- ✅ `getActiveTenantGroup` computed — Task 1 (new computed in store)
- ✅ TypeScript type cleanup — Task 2 (dateUtil.ts `as any` removal)
- ✅ Layout slot wiring — Task 4

**Placeholder scan:** None found. All tasks contain complete, runnable code.

**Type consistency:** `useAppUserStore` exports `getActiveTenantGroup: ComputedRef<UserTenantGroupItem | null>` in Task 1; consumed in HeaderTenant Task 3 via `appUserStore.getActiveTenantGroup?.orgName`. ✅
