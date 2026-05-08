<script lang="ts" setup>
import type { SysUsersPageListRsp } from '#/api/system';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { NPopover } from 'naive-ui';

import { useDictionary } from '#/components/dict-select';

const props = defineProps<{ row: SysUsersPageListRsp }>();

const { t } = useI18n();
// 出款员工职位名走 common 字典 withdrawUserRankList 反查（§1.1 已加；Code 与 withdraw_UserRank 字段值同源）
const dict = useDictionary({ source: 'common' });

const RANK_COLORS: Record<string, string> = {
  Staff: '#2563eb',
  Leader: '#d97706',
  Manager: '#7c3aed',
  Admin: '#dc2626',
};

const rankCode = computed(() =>
  String(props.row.withdraw_UserRank ?? '').trim(),
);
const rankLabel = computed(() =>
  dict.findLabel('withdrawUserRankList', rankCode.value),
);

const rankColor = computed(
  () => RANK_COLORS[rankCode.value] || 'rgb(51, 54, 57)',
);

const isMemberOrLeader = computed(() =>
  ['Leader', 'Staff'].includes(rankCode.value),
);
</script>

<template>
  <span v-if="!row.hasWithdrawConfig" class="perm-cell__empty">
    {{ t('system.sysUser.detail.notConfigured') }}
  </span>
  <NPopover
    v-else
    trigger="click"
    placement="bottom-start"
    style="max-width: 420px"
  >
    <template #trigger>
      <div
        class="perm-cell"
        :class="{ 'perm-cell--dim': row.withdraw_EnableState !== 1 }"
      >
        <div>
          <span class="perm-cell__label">{{ t('system.sysUser.withdraw.configGroup') }}：</span>
          <span class="perm-cell__value">{{
            row.withdraw_ConfigGroupName || '--'
          }}</span>
        </div>
        <div>
          <span class="perm-cell__label">{{ t('system.sysUser.withdraw.rank') }}：</span>
          <span class="perm-cell__value" :style="{ color: rankColor }">
            {{ rankLabel }}
          </span>
          <template v-if="isMemberOrLeader">
            <span class="perm-cell__label">
              &nbsp;&nbsp;{{
                t('system.sysUser.withdraw.maxConcurrent')
              }}：</span>
            <span class="perm-cell__value">
              {{ row.withdraw_CurrentProcessingOrderLimit ?? '--' }}
            </span>
          </template>
        </div>
        <div v-if="isMemberOrLeader">
          <span class="perm-cell__label">{{ t('system.sysUser.withdraw.amountRange') }}：</span>
          <span class="perm-cell__value">{{
            row.withdraw_AuditAmountRange || '--'
          }}</span>
        </div>
      </div>
    </template>
    <div
      class="perm-cell__popover"
      :class="{ 'perm-cell--dim': row.withdraw_EnableState !== 1 }"
    >
      <div>
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.configGroup') }}：</span>
        <span class="perm-cell__value">{{
          row.withdraw_ConfigGroupName || '--'
        }}</span>
      </div>
      <div>
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.rank') }}：</span>
        <span
          class="perm-cell__value"
          :style="{ color: rankColor, fontWeight: 500 }"
        >
          {{ rankLabel }}
        </span>
        <template v-if="isMemberOrLeader">
          <span class="perm-cell__label">
            &nbsp;&nbsp;{{ t('system.sysUser.withdraw.maxConcurrent') }}：</span>
          <span class="perm-cell__value">
            {{ row.withdraw_CurrentProcessingOrderLimit ?? '--' }}
          </span>
        </template>
      </div>
      <div v-if="isMemberOrLeader">
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.amountRange') }}：</span>
        <span class="perm-cell__value">{{
          row.withdraw_AuditAmountRange || '--'
        }}</span>
      </div>
      <div v-if="isMemberOrLeader">
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.currencyType') }}：</span>
        <span class="perm-cell__value">{{
          row.withdraw_SysCurrency || '--'
        }}</span>
      </div>
      <div v-if="row.withdraw_SuperiorUserNames">
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.superior') }}：</span>
        <span class="perm-cell__value">{{
          row.withdraw_SuperiorUserNames
        }}</span>
      </div>
      <div v-if="row.withdraw_SubordinateUserNames">
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.subordinate') }}：</span>
        <span class="perm-cell__value">{{
          row.withdraw_SubordinateUserNames
        }}</span>
      </div>
      <div>
        <span class="perm-cell__label">{{ t('system.sysUser.withdraw.tenant') }}：</span>
        <span class="perm-cell__value">{{
          row.withdraw_TenantNames || '--'
        }}</span>
      </div>
    </div>
  </NPopover>
</template>

<style lang="less" scoped>
.perm-cell {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 12px;
  line-height: 1.7;
  max-height: 62px;
  overflow: hidden;
  cursor: pointer;
}

.perm-cell--dim {
  opacity: 0.45;
}

.perm-cell__empty {
  color: rgba(194, 194, 194, 1);
  font-size: 12px;
}

.perm-cell__label {
  color: rgb(118, 124, 130);
  flex-shrink: 0;
}

.perm-cell__value {
  color: rgb(51, 54, 57);
}

.perm-cell__popover {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 12px;
  line-height: 1.7;
  padding: 4px 0;
}
</style>
