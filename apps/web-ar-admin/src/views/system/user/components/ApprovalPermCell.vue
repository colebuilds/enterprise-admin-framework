<template>
  <span v-if="!row.hasApprovalConfig" class="perm-cell__empty">
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
        :class="{ 'perm-cell--dim': row.approval_UserState !== 1 }"
      >
        <div>
          <span class="perm-cell__label"
            >{{ t('system.sysUser.approval.rolePermission') }}：</span
          >
          <span
            class="perm-cell__value"
            :style="{ color: roleColor, fontWeight: 500 }"
          >
            {{ row.approval_UserRoleName || '--' }}
          </span>
        </div>
        <div>
          <span class="perm-cell__label"
            >{{ t('system.sysUser.approval.tenant') }}：</span
          >
          <span class="perm-cell__value">{{
            row.approval_TenantNames || '--'
          }}</span>
        </div>
        <div v-if="row.approval_RoleAuthorizeName">
          <span class="perm-cell__label">
            {{ t('system.sysUser.approval.operationContent') }}：</span
          >
          <span class="perm-cell__value">{{
            row.approval_RoleAuthorizeName
          }}</span>
        </div>
        <div v-if="row.approval_SubRoleAuthorizeName">
          <span class="perm-cell__label"
            >{{ t('system.sysUser.approval.rechargePerms') }}：</span
          >
          <span class="perm-cell__value">{{
            row.approval_SubRoleAuthorizeName
          }}</span>
        </div>
      </div>
    </template>
    <div
      class="perm-cell__popover"
      :class="{ 'perm-cell--dim': row.approval_UserState !== 1 }"
    >
      <div>
        <span class="perm-cell__label"
          >{{ t('system.sysUser.approval.rolePermission') }}：</span
        >
        <span
          class="perm-cell__value"
          :style="{ color: roleColor, fontWeight: 500 }"
        >
          {{ row.approval_UserRoleName || '--' }}
        </span>
      </div>
      <div>
        <span class="perm-cell__label"
          >{{ t('system.sysUser.approval.tenant') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_TenantNames || '--'
        }}</span>
      </div>
      <div v-if="row.approval_RoleAuthorizeName">
        <span class="perm-cell__label">
          {{ t('system.sysUser.approval.operationContent') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_RoleAuthorizeName
        }}</span>
      </div>
      <div v-if="row.approval_SubRoleAuthorizeName">
        <span class="perm-cell__label"
          >{{ t('system.sysUser.approval.rechargePerms') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_SubRoleAuthorizeName
        }}</span>
      </div>
      <div v-if="row.approval_DailyApplyLimit">
        <span class="perm-cell__label"
          >{{ t('system.sysUser.approval.dailyCountLimit') }}：</span
        >
        <span class="perm-cell__value">{{ row.approval_DailyApplyLimit }}</span>
      </div>
      <div v-if="row.approval_SingleRechargeAmountLimitText">
        <span class="perm-cell__label">
          {{ t('system.sysUser.approval.singleAmountLimit') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_SingleRechargeAmountLimitText
        }}</span>
      </div>
      <div v-if="row.approval_DailyBatchApplyLimit">
        <span class="perm-cell__label">
          {{ t('system.sysUser.approval.batchDailyCountLimit') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_DailyBatchApplyLimit
        }}</span>
      </div>
      <div v-if="row.approval_SingleBatchRechargeAmountLimitText">
        <span class="perm-cell__label">
          {{ t('system.sysUser.approval.batchSingleAmountLimit') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_SingleBatchRechargeAmountLimitText
        }}</span>
      </div>
      <div v-if="row.approval_IsRequireApprovalName">
        <span class="perm-cell__label"
          >{{ t('system.sysUser.approval.needAudit') }}：</span
        >
        <span class="perm-cell__value">{{
          row.approval_IsRequireApprovalName
        }}</span>
      </div>
    </div>
  </NPopover>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NPopover } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import type { SysUsersPageListRsp } from '#/api/system';

const props = defineProps<{ row: SysUsersPageListRsp }>();

const { t } = useI18n();

// approval_UserRole: 1=操作权限(绿) 2=审核权限(蓝)
const roleColor = computed(() => {
  if (props.row.approval_UserRole === 1) return '#16a34a';
  if (props.row.approval_UserRole === 2) return '#2563eb';
  return 'rgb(51, 54, 57)';
});
</script>

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
