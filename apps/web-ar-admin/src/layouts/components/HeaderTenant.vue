<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import {
  CheckOutlined,
  ClockCircleOutlined,
  DownOutlined,
  SearchOutlined,
} from '@vicons/antd';
import { useWindowSize } from '@vueuse/core';
import { NEl, NIcon, NInput, NPopover, NTag } from 'naive-ui';

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
let _clockTimer: null | ReturnType<typeof setInterval> = null;

function formatTimeForTenant(value: number): string {
  const tz = currentTenant.value?.timeZone;
  return tz ? formatToTimeZone(value, tz) : String(formatToCurrentZone(value));
}

onMounted(() => {
  _clockTimer = setInterval(() => {
    if (!clockTextRef.value) return;
    clockTextRef.value.textContent = formatTimeForTenant(Date.now());
  }, 1000);
  void lockTenantPanelWidth();
});
onUnmounted(() => {
  if (_clockTimer !== null) clearInterval(_clockTimer);
});

// Initial render value only — the setInterval above takes over via direct DOM write.
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
    tenantTitle: tenant ? `${tenant.name} (#${tenant.id})` : t('common.noData'),
  };
});

const tenantTitle = computed(() =>
  [
    tenantDisplay.value.groupName,
    tenantDisplay.value.tenantTitle,
    timezoneTitle.value,
  ]
    .filter(Boolean)
    .join(' · '),
);
const switchTitle = computed(() =>
  t('common.header.switchTenant', { count: tenantFlatList.value.length }),
);
const normalizedTenantKeyword = computed(() =>
  normalizeKeyword(tenantKeyword.value),
);

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

watch(isCompactViewport, () => {
  void lockTenantPanelWidth();
});
</script>

<template>
  <NPopover
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
            <NIcon size="12" class="header-tenant__clock-icon opacity-85">
              <ClockCircleOutlined />
            </NIcon>
            <span
              ref="clockTextRef"
              class="header-tenant__clock-text tracking-[0.5px]"
              >{{ formattedTime }}</span>
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
            <span
              class="truncate max-w-[112px]"
              :title="tenantDisplay.groupName"
            >
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
              <NIcon
                size="12"
                class="header-tenant__arrow opacity-72 transition-transform duration-200"
                :class="popoverVisible ? 'rotate-180' : ''"
              >
                <DownOutlined />
              </NIcon>
            </span>
          </div>
        </div>
      </button>
    </template>
    <NEl tag="div" class="tenant-popover" :style="tenantPopoverStyle">
      <div class="tenant-popover__search px-2 pb-2 pt-2">
        <NInput
          v-model:value="tenantKeyword"
          size="small"
          clearable
          :placeholder="t('common.header.searchTenantPlaceholder')"
        >
          <template #prefix>
            <NIcon size="14" class="tenant-popover__search-icon">
              <SearchOutlined />
            </NIcon>
          </template>
        </NInput>
      </div>
      <div class="tenant-popover__body">
        <template v-if="visibleTenantGroups.length > 0">
          <section
            v-for="group in visibleTenantGroups"
            :key="group.orgId"
            class="tenant-popover__group"
          >
            <div class="flex items-center justify-between gap-2.5 px-2 pb-1">
              <span
                class="tenant-popover__group-name min-w-0 truncate text-[12px] font-semibold"
              >
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
                :class="{
                  'tenant-popover__item--active': tenant.id === currentTenantId,
                }"
                @click="handleTenantChange(tenant.id)"
              >
                <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span
                    class="tenant-popover__tenant-name truncate text-[13px] font-semibold"
                  >
                    {{ tenant.name }}
                  </span>
                  <span
                    class="tenant-popover__tenant-meta flex min-w-0 items-center gap-1.5 text-[11px] tracking-[0.04em]"
                  >
                    <span>#{{ tenant.id }}</span>
                    <NTag
                      v-if="tenant.supportSysCurrency"
                      size="small"
                      type="success"
                      class="tenant-popover__currency-tag"
                    >
                      {{ tenant.supportSysCurrency }}
                    </NTag>
                    <span
                      v-if="tenant.timeZone"
                      class="tenant-popover__timezone truncate"
                      >{{ resolveTenantTimezone(tenant.timeZone) }}</span>
                  </span>
                </span>
                <NIcon
                  v-if="tenant.id === currentTenantId"
                  size="14"
                  class="tenant-popover__check"
                >
                  <CheckOutlined />
                </NIcon>
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
    </NEl>
  </NPopover>
</template>

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
  background: rgb(255 255 255 / 8%);
}

.header-tenant--open {
  background: rgb(255 255 255 / 10%);
}

.header-tenant__time {
  color: #fff;
}

.header-tenant__meta {
  color: rgb(255 255 255 / 72%);
}

.header-tenant__pill {
  min-height: 20px;
  color: #fff;
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 14%);
}

.header-tenant__switch {
  color: rgb(255 255 255 / 86%);
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
  background: var(--popover-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
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
  color: var(--text-color-2);
  background: var(--hover-color);
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
  background: var(--border-color);
  border-radius: 999px;
}

.tenant-popover__group + .tenant-popover__group {
  padding-top: 6px;
  margin-top: 6px;
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
