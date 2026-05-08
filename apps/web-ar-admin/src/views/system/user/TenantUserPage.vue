<!--
/**
 * @description 商户系统用户页面：负责商户用户列表查询、权限配置列、角色/归属商户标签渲染、批量授权与状态维护等表格交互。
 * @date.  26-05-06
 * @scope src/views/system/user
 */
-->
<script lang="ts" setup>
import type { Component } from 'vue';

import type {
  SysUserApprovalPermissionQueryStateEnum,
  SysUserPageListReq,
  SysUsersPageListRsp,
  SysUserWithdrawPermissionQueryStateEnum,
} from '#/api/system';
import type {
  ProColumn,
  ProCrudTableInstance,
  ProSearchFormColumn,
} from '#/components/pro';

import { computed, h, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { DownOutlined, PlusOutlined } from '@vicons/antd';
import {
  NBadge,
  NDropdown,
  NIcon,
  NSelect,
  NSpace,
  useDialog,
  useMessage,
  useModal,
} from 'naive-ui';

import { api } from '#/api';
import { ConfirmSwitch } from '#/components/confirm-switch';
import { useDictionary } from '#/components/dict-select';
import { GoogleAuth } from '#/components/google-auth';
import { ProCrudTable } from '#/components/pro';
import { createActionColumn } from '#/components/table';
import {
  renderBoolTag,
  renderIPLink,
  renderTagList,
} from '#/components/table-renders';
import { useTenantOptions } from '#/hooks';
import { usePermission } from '#/hooks/usePermission';

import ApprovalPermCell from './components/ApprovalPermCell.vue';
import BatchGrantPermModal from './components/BatchGrantPermModal.vue';
import BatchLimitModal from './components/BatchLimitModal.vue';
import BatchRangeModal from './components/BatchRangeModal.vue';
import ResetPasswordModal from './components/ResetPasswordModal.vue';
import TenantUserCreateModal from './components/TenantUserCreateModal.vue';
import TenantUserDetailModal from './components/TenantUserDetailModal.vue';
import WithdrawPermCell from './components/WithdrawPermCell.vue';

const tableRef = ref<null | ProCrudTableInstance>(null);
const selectedRows = ref<SysUsersPageListRsp[]>([]);

const { t } = useI18n();
const { hasPermission } = usePermission();
const message = useMessage();
const dialog = useDialog();
const modal = useModal();
// 出款员工职位名走 common 字典 withdrawUserRankList 反查（§1.1）
const dict = useDictionary({ source: 'common' });
// 角色名 / 角色下拉走 dynamic 字典 roleList 反查（§1.2）
const dictDynamic = useDictionary({ source: 'dynamic' });

function resolveRoleNames(roleIds: string): string[] {
  return String(roleIds || '')
    .replaceAll(/^,|,$/g, '')
    .split(',')
    .map((id) => dictDynamic.findLabel('roleList', Number(id.trim())))
    .filter(Boolean);
}

// ─── 充提权限筛选 ──────────────────────────────────────────
const { tenantOptions, load: loadTenants } = useTenantOptions();

const permFilter = reactive<{
  approvalState: null | SysUserApprovalPermissionQueryStateEnum;
  approvalTenantIds: number[];
  approvalUserRole: null | number;
  withdrawConfigGroupId: null | number;
  withdrawState: null | SysUserWithdrawPermissionQueryStateEnum;
  withdrawTenantIds: number[];
  withdrawUserRank: null | string;
}>({
  withdrawTenantIds: [],
  withdrawUserRank: null,
  withdrawConfigGroupId: null,
  withdrawState: null,
  approvalTenantIds: [],
  approvalUserRole: null,
  approvalState: null,
});

const tenantFilterOptions = computed(() =>
  tenantOptions.value.map((item) => ({ label: item.label, value: item.value })),
);
const configGroupFilterOptions = computed(() =>
  dict.getOptions('withdrawConfigGroupList', { source: 'dynamic' }),
);
const positionFilterOptions = computed(() =>
  dict.getOptions('withdrawUserRankList'),
);

const permStateOptions = computed(() => [
  { label: t('system.sysUser.permFilter.notConfigured'), value: 2 },
  { label: t('system.sysUser.permFilter.enabled'), value: 1 },
  { label: t('system.sysUser.permFilter.disabled'), value: 0 },
]);

// 审批角色筛选项走 common 字典 approvalUserRoleList（§1.1，code='Submit'/'Approval' 与 filter 字段同构）
const approvalRoleOptions = computed(() =>
  dict.getOptions('approvalUserRoleList'),
);

const permFilterCount = computed(() => {
  let count = 0;
  if (permFilter.withdrawTenantIds.length > 0) count++;
  if (permFilter.withdrawUserRank) count++;
  if (permFilter.withdrawConfigGroupId) count++;
  if (permFilter.withdrawState !== null) count++;
  if (permFilter.approvalTenantIds.length > 0) count++;
  if (permFilter.approvalUserRole !== null) count++;
  if (permFilter.approvalState !== null) count++;
  return count;
});

function resetPermFilter() {
  permFilter.withdrawTenantIds = [];
  permFilter.withdrawUserRank = null;
  permFilter.withdrawConfigGroupId = null;
  permFilter.withdrawState = null;
  permFilter.approvalTenantIds = [];
  permFilter.approvalUserRole = null;
  permFilter.approvalState = null;
}

function handleResetPermFilter() {
  resetPermFilter();
  tableRef.value?.reload();
}

function handleApplyPermFilter() {
  tableRef.value?.reload();
}

onMounted(() => {
  void loadTenants();
});

// 商户端搜索列：含商户筛选，不含集团
const searchColumns = computed<ProSearchFormColumn[]>(() => [
  {
    path: 'tenantId',
    label: t('system.sysUser.search.tenant'),
    valueType: 'tenantSelect',
    componentProps: { clearable: true },
  },
  {
    path: 'userName',
    label: t('system.sysUser.col.account'),
    valueType: 'text',
    componentProps: {
      placeholder: t('system.sysUser.search.accountPlaceholder'),
    },
  },
  {
    path: 'state',
    label: t('common.status'),
    valueType: 'select',
    componentProps: {
      placeholder: t('system.sysUser.search.statePlaceholder'),
      clearable: true,
      options: [
        { label: t('system.sysUser.search.stateEnabled'), value: 3 },
        { label: t('system.sysUser.search.stateDisabled'), value: 4 },
      ],
    },
  },
  {
    path: 'roleId',
    label: t('system.sysUser.search.role'),
    valueType: 'dictSelect',
    componentProps: {
      dictKey: 'roleList',
      source: 'dynamic',
      clearable: true,
      filterable: true,
      placeholder: t('system.sysUser.search.rolePlaceholder'),
    },
  },
]);

// 商户端表格列
const columns = computed<ProColumn[]>(() => [
  { key: 'userName', title: t('system.sysUser.col.account'), width: 150 },
  {
    key: 'nickName',
    title: t('system.sysUser.col.name'),
    width: 120,
    render: (row: SysUsersPageListRsp) => row.nickName || '--',
  },
  {
    key: 'roleIds',
    title: t('system.sysUser.col.role'),
    width: 220,
    align: 'center',
    render(row: SysUsersPageListRsp) {
      if (row.isSuperAdmin)
        return renderBoolTag(
          true,
          t('system.sysUser.col.superAdmin'),
          '',
          'info',
        );
      const names = resolveRoleNames(row.roleIds);
      return renderTagList(names, 'sky');
    },
  },
  // 出款权限配置
  {
    key: 'withdrawPerm',
    title: t('system.sysUser.col.withdrawPerm'),
    width: 280,
    render: (row: SysUsersPageListRsp) => h(WithdrawPermCell, { row }),
  },
  // 出款状态
  {
    key: 'withdraw_EnableState',
    title: t('system.sysUser.col.withdrawStatus'),
    width: 80,
    render(row: SysUsersPageListRsp) {
      if (!row.hasWithdrawConfig)
        return h('span', { style: 'color:#c0c4cc;font-size:12px;' }, '--');
      return h(ConfirmSwitch, {
        key: `wd-${row.userId}`,
        checkedValue: 1,
        uncheckedValue: 0,
        modelValue: row.withdraw_EnableState,
        permission: [
          'SystemManage:SysUserPage:UserPage:UpdateTenantSysUserState',
        ],
        onConfirm: async (value: number) => {
          const { code } = await api.system.updateTenantSysUserState({
            userIds: [row.userId],
            stateType: 1,
            state: value,
          });
          if (code === 0) tableRef.value?.reload();
        },
      });
    },
  },
  // 人工充值权限配置
  {
    key: 'approvalPerm',
    title: t('system.sysUser.col.approvalPerm'),
    width: 280,
    render: (row: SysUsersPageListRsp) => h(ApprovalPermCell, { row }),
  },
  // 人工充值状态
  {
    key: 'approval_UserState',
    title: t('system.sysUser.col.approvalStatus'),
    width: 80,
    render(row: SysUsersPageListRsp) {
      if (!row.hasApprovalConfig)
        return h('span', { style: 'color:#c0c4cc;font-size:12px;' }, '--');
      return h(ConfirmSwitch, {
        key: `ap-${row.userId}`,
        checkedValue: 1,
        uncheckedValue: 0,
        modelValue: row.approval_UserState,
        permission: [
          'SystemManage:SysUserPage:UserPage:UpdateTenantSysUserState',
        ],
        onConfirm: async (value: number) => {
          const { code } = await api.system.updateTenantSysUserState({
            userIds: [row.userId],
            stateType: 2,
            state: value,
          });
          if (code === 0) tableRef.value?.reload();
        },
      });
    },
  },
  // 归属集团
  {
    key: 'orgId',
    title: t('system.sysUser.col.group'),
    width: 160,
    ellipsis: { tooltip: true },
    render(row: SysUsersPageListRsp) {
      if (row.orgId === 0)
        return renderBoolTag(
          true,
          t('system.sysUser.col.platform'),
          '',
          'warning',
        );
      return row.orgName || '--';
    },
  },
  // 归属商户
  {
    key: 'manageTenantNames',
    title: t('system.sysUser.col.tenant'),
    width: 220,
    render(row: SysUsersPageListRsp) {
      const names = String(row.manageTenantNames || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (names.length === 0) return '--';
      return renderTagList(names, 'sky');
    },
  },
  // 最后登录时间
  {
    key: 'userLoginDate',
    title: t('system.sysUser.col.lastLoginTime'),
    width: 180,
    showTenantTimeZone: true,
  },
  // 最后登录IP
  {
    key: 'userLoginIP',
    title: t('system.sysUser.col.lastLoginIP'),
    width: 150,
    render: (row: SysUsersPageListRsp) => renderIPLink(row.userLoginIP),
  },
  // 在线状态
  {
    key: 'isOnLine',
    title: t('system.sysUser.col.onlineStatus'),
    width: 100,
    render: (row: SysUsersPageListRsp) =>
      renderBoolTag(row.isOnLine, t('common.online'), t('common.offline')),
  },
  // 用户状态
  {
    key: 'userState',
    title: t('system.sysUser.col.userStatus'),
    width: 100,
    render(row: SysUsersPageListRsp) {
      return h(ConfirmSwitch, {
        key: `us-${row.userId}`,
        checkedValue: 1,
        uncheckedValue: 0,
        modelValue: row.userState,
        permission: [
          'SystemManage:SysUserPage:UserPage:UpdateTenantSysUserState',
        ],
        onConfirm: async (value: number) => {
          const { code } = await api.system.updateTenantSysUserState({
            userIds: [row.userId],
            stateType: 3,
            state: value,
          });
          if (code === 0) tableRef.value?.reload();
        },
      });
    },
  },
  // 谷歌验证
  {
    key: 'isOpenGoogle',
    title: t('system.sysUser.col.googleAuth'),
    width: 110,
    render(row: SysUsersPageListRsp) {
      return h(ConfirmSwitch, {
        key: `google-${row.userId}`,
        modelValue: row.isOpenGoogle ? 1 : 0,
        checkedValue: 1,
        uncheckedValue: 0,
        permission: ['SystemManage:SysUserPage:UserPage:UpdateGoogleAccount'],
        onConfirm: async (value: number) => {
          const { code } = await api.system.updateAdminIsOpenGoogle({
            userId: row.userId,
            isOpenGoogle: value === 1,
          });
          if (code === 0) tableRef.value?.reload();
        },
      });
    },
  },
  // 创建人
  {
    key: 'creator',
    title: t('system.sysUser.col.creator'),
    width: 140,
    render: (row: SysUsersPageListRsp) => row.creator || '--',
  },
  // 创建时间
  {
    key: 'createTime',
    title: t('system.sysUser.col.createTime'),
    width: 220,
    showTenantTimeZone: true,
  },
  // 最后修改人
  {
    key: 'lastUpdateMan',
    title: t('system.sysUser.col.lastModifyUser'),
    width: 140,
    render: (row: SysUsersPageListRsp) => row.lastUpdateMan || '--',
  },
  // 最后修改时间
  {
    key: 'lastUpdateTime',
    title: t('system.sysUser.col.lastModifyTime'),
    width: 220,
    showTenantTimeZone: true,
  },
]);

const actionColumn = createActionColumn(() => ({
  actions: (row: SysUsersPageListRsp) => [
    {
      label: t('system.sysUser.actions.editDetail'),
      type: 'primary',
      onClick: () => handleEdit(row),
      auth: ['SystemManage:SysUserPage:UserPage:UpdateTenantSysUser'],
      disabled: !row.canOperate,
    },
    {
      label: t('common.delete'),
      type: 'delete',
      onClick: () => handleDelete(row),
      auth: ['SystemManage:SysUserPage:UserPage:Delete'],
      disabled: !row.canOperate,
    },
  ],
  dropdownActions: [
    {
      label: t('system.sysUser.actions.resetPassword'),
      onClick: (row: SysUsersPageListRsp) => openResetPasswordModal(row),
      auth: ['SystemManage:SysUserPage:UserPage:RevisePassword'],
      disabled: (row: SysUsersPageListRsp) => !row.canOperate,
    },
    {
      label: t('system.sysUser.actions.refreshGoogle'),
      onClick: (row: SysUsersPageListRsp) => handleRefreshGoogleCaptcha(row),
      auth: ['SystemManage:SysUserPage:UserPage:UpdateGoogleAccount'],
      disabled: (row: SysUsersPageListRsp) => !row.canOperate,
    },
  ],
  width: 180,
}));

// 行级禁用：canOperate=false 时给整行加 class，scoped CSS 做遮罩 + pointer-events 拦截，
// 配合 row-selection.disabled 让 Naive 原生 checkbox 也置灰，避免每个开关逐个加 disabled
const rowProps = (row: SysUsersPageListRsp) => ({
  class: row.canOperate ? '' : 'tenant-user-row--disabled',
});

// batchActions：声明式权限，由 ProCrudTable 内部基于 `auth` 自动过滤
const batchActions = computed(() => [
  {
    label: t('common.delete'),
    key: 'delete',
    auth: 'SystemManage:SysUserPage:UserPage:BatchDelete',
  },
]);

const hasSelection = computed(() => selectedRows.value.length > 0);

// 批量调整出款权限下拉选项（按各自子权限过滤）
const batchWithdrawOptions = computed(() => {
  const opts: Array<{ key: string; label: string; }> = [];
  if (
    hasPermission([
      'SystemManage:SysUserPage:UserPage:BatchUpdateTenantSysUserWithdrawAuditAmountRange',
    ])
  ) {
    opts.push({ label: t('system.sysUser.batch.adjustRange'), key: 'range' });
  }
  if (
    hasPermission([
      'SystemManage:SysUserPage:UserPage:BatchUpdateTenantSysUserCurrentProcessingOrderLimit',
    ])
  ) {
    opts.push({ label: t('system.sysUser.batch.adjustLimit'), key: 'limit' });
  }
  return opts;
});

// 批量变更状态权限判定：无权限时整个 dropdown 不渲染（避免在 n-dropdown 上挂 v-permission 触发 Vue 的
// 「Runtime directive used on component with non-element root node」告警）
const canChangeBatchStatus = computed(() =>
  hasPermission(['SystemManage:SysUserPage:UserPage:UpdateSysUserState']),
);

// 批量变更状态下拉选项
const batchStatusOptions = computed(() => [
  { label: t('system.sysUser.batch.enableWithdraw'), key: 'withdraw-enable' },
  { label: t('system.sysUser.batch.disableWithdraw'), key: 'withdraw-disable' },
  { type: 'divider' as const, key: 'd1' },
  { label: t('system.sysUser.batch.enableRecharge'), key: 'recharge-enable' },
  { label: t('system.sysUser.batch.disableRecharge'), key: 'recharge-disable' },
]);

function handleSelectionChange(_keys: number[], rows: SysUsersPageListRsp[]) {
  selectedRows.value = rows;
}

function handleBatchAction(key: string, rows: SysUsersPageListRsp[]) {
  if (key === 'delete') {
    handleBatchDelete(rows);
  }
}

function handleBatchWithdraw(key: string) {
  if (!hasSelection.value) return;

  // 业务过滤：只对 canOperate 且已配置出款的行调整
  const eligible = selectedRows.value.filter(
    (r) => r.canOperate && r.hasWithdrawConfig,
  );
  const skipped = selectedRows.value.length - eligible.length;
  if (eligible.length === 0) {
    message.warning(t('system.sysUser.batch.noWithdrawPermission'));
    return;
  }
  if (skipped > 0) {
    message.info(t('system.sysUser.batch.skippedTip', { skipped }));
  }

  const userIds = eligible.map((r) => r.userId);
  const count = userIds.length;

  const onSave = () => {
    selectedRows.value = [];
    tableRef.value?.clearSelection();
    tableRef.value?.reload();
  };

  if (key === 'range') {
    const modalInstance = modal.create({
      title: t('system.sysUser.batch.adjustRange'),
      preset: 'card',
      showIcon: false,
      style: { width: '400px' },
      content: () =>
        h(BatchRangeModal as Component, {
          count,
          userIds,
          onClose: () => modalInstance.destroy(),
          onSave: () => {
            modalInstance.destroy();
            onSave();
          },
        }),
    });
  } else if (key === 'limit') {
    const modalInstance = modal.create({
      title: t('system.sysUser.batch.adjustLimit'),
      preset: 'card',
      showIcon: false,
      style: { width: '400px' },
      content: () =>
        h(BatchLimitModal as Component, {
          count,
          userIds,
          onClose: () => modalInstance.destroy(),
          onSave: () => {
            modalInstance.destroy();
            onSave();
          },
        }),
    });
  }
}

// 批量变更状态
function handleBatchStatus(key: string) {
  if (!hasSelection.value) return;

  // key: withdraw-enable / withdraw-disable / recharge-enable / recharge-disable
  const isWithdraw = key.startsWith('withdraw');
  const isEnable = key.endsWith('enable');
  const stateType = isWithdraw ? 1 : 2;
  const state = isEnable ? 1 : 0;

  const labelMap: Record<string, string> = {
    'withdraw-enable': t('system.sysUser.batch.enableWithdraw'),
    'withdraw-disable': t('system.sysUser.batch.disableWithdraw'),
    'recharge-enable': t('system.sysUser.batch.enableRecharge'),
    'recharge-disable': t('system.sysUser.batch.disableRecharge'),
  };

  // 业务过滤：必须 canOperate=true 且已配置对应权限
  const configuredUsers = selectedRows.value.filter(
    (r) =>
      r.canOperate && (isWithdraw ? r.hasWithdrawConfig : r.hasApprovalConfig),
  );
  const skippedCount = selectedRows.value.length - configuredUsers.length;
  const userIds = configuredUsers.map((r) => r.userId);
  const action = labelMap[key];

  let content = t('system.sysUser.batch.confirmContent', {
    count: selectedRows.value.length,
    action,
  });
  if (skippedCount > 0) {
    content += `\n${t('system.sysUser.batch.skippedTip', { skipped: skippedCount })}`;
  }

  dialog.warning({
    title: t('system.sysUser.batch.confirmTitle'),
    content,
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      if (userIds.length === 0) {
        message.warning(t('system.sysUser.detail.notConfigured'));
        return;
      }
      const { code } = await api.system.updateTenantSysUserState({
        userIds,
        stateType,
        state,
      });
      if (code === 0) {
        selectedRows.value = [];
        tableRef.value?.clearSelection();
        tableRef.value?.reload();
        message.success(
          t('system.sysUser.batch.successMsg', {
            count: userIds.length,
            action,
          }),
        );
      }
    },
  });
}

function handleBatchGrantPerm() {
  if (!hasSelection.value) return;

  // 业务过滤：只对 canOperate=true 的行赋权
  const eligible = selectedRows.value.filter((r) => r.canOperate);
  const skipped = selectedRows.value.length - eligible.length;
  if (eligible.length === 0) {
    message.warning(t('system.sysUser.batch.noGrantPermission'));
    return;
  }
  if (skipped > 0) {
    message.info(t('system.sysUser.batch.skippedTip', { skipped }));
  }

  const modalInstance = modal.create({
    title: t('system.sysUser.batch.grantPerm'),
    preset: 'card',
    showIcon: false,
    style: { width: 'min(1100px, 95vw)' },
    content: () =>
      h(BatchGrantPermModal as Component, {
        selectedUsers: eligible,
        onClose: () => modalInstance.destroy(),
        onSave: () => {
          modalInstance.destroy();
          selectedRows.value = [];
          tableRef.value?.clearSelection();
          tableRef.value?.reload();
        },
      }),
  });
}

async function handleBatchDelete(rows: SysUsersPageListRsp[]) {
  if (rows.length === 0) return;

  // 业务过滤：只删除 canOperate=true 的行
  const eligible = rows.filter((r) => r.canOperate);
  const skipped = rows.length - eligible.length;
  if (eligible.length === 0) {
    message.warning(t('system.sysUser.batch.noDeletePermission'));
    return;
  }

  let content = t('system.sysUser.batch.deleteConfirm', {
    count: eligible.length,
  });
  if (skipped > 0) {
    content += `\n${t('system.sysUser.batch.skippedTip', { skipped })}`;
  }

  dialog.warning({
    title: t('common.tip'),
    content,
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      const { code } = await api.system.batchDeleteSysUser({
        userIds: eligible.map((row) => row.userId),
      });
      if (code !== 0) return;

      selectedRows.value = [];
      tableRef.value?.clearSelection();
      tableRef.value?.reload(1);
      message.success(t('common.operationSuccess'));
    },
  });
}

async function loadDataTable(params: {
  pageNo?: number;
  pageSize?: number;
  roleId?: number;
  state?: SysUserPageListReq['state'];
  tenantId?: number;
  userName?: string;
}) {
  const requestParams: SysUserPageListReq = {
    userName: String(params?.userName ?? '').trim() || undefined,
    state: params?.state,
    roleId: params?.roleId,
    tenantId: params?.tenantId || undefined,
    // 充提权限筛选
    withdraw_TenantIds: permFilter.withdrawTenantIds.length > 0
      ? permFilter.withdrawTenantIds
      : undefined,
    withdraw_UserRank: permFilter.withdrawUserRank || undefined,
    withdraw_ConfigGroupId: permFilter.withdrawConfigGroupId ?? undefined,
    withdrawState: permFilter.withdrawState ?? undefined,
    approval_TenantIds: permFilter.approvalTenantIds.length > 0
      ? permFilter.approvalTenantIds
      : undefined,
    approval_UserRole: permFilter.approvalUserRole ?? undefined,
    approvalState: permFilter.approvalState ?? undefined,
    orderBy: 'Desc',
    sortField: 'UserId',
    pageNo: params?.pageNo ?? 1,
    pageSize: params?.pageSize ?? 10,
  };

  const { data, result } = await api.system.getTenantPageList(requestParams);
  if (!result) return { list: [], total: 0 };

  return data;
}

function handleAdd() {
  const modalInstance = modal.create({
    title: t('system.sysUser.dialog.addUser'),
    preset: 'card',
    showIcon: false,
    style: { width: '1000px' },
    content: () =>
      h(TenantUserCreateModal as Component, {
        onClose: () => modalInstance.destroy(),
        onSave: () => {
          modalInstance.destroy();
          tableRef.value?.reload();
        },
      }),
  });
}

function handleEdit(record: SysUsersPageListRsp) {
  const modalInstance = modal.create({
    title: t('system.sysUser.dialog.userDetailTitle', {
      userName: record.userName || '',
    }),
    preset: 'card',
    showIcon: false,
    style: { width: 'min(800px, 95vw)' },
    content: () =>
      h(TenantUserDetailModal as Component, {
        userId: record.userId,
        onClose: () => modalInstance.destroy(),
        onSave: () => {
          modalInstance.destroy();
          tableRef.value?.reload();
        },
      }),
  });
}

function openResetPasswordModal(record: SysUsersPageListRsp) {
  const modalInstance = modal.create({
    title: t('system.sysUser.dialog.resetPasswordTitle', {
      userName: record.userName,
    }),
    preset: 'card',
    showIcon: false,
    style: { width: '420px' },
    content: () =>
      h(ResetPasswordModal, {
        userId: record.userId,
        onClose: () => modalInstance.destroy(),
        onSave: () => modalInstance.destroy(),
      }),
  });
}

async function handleDelete(record: SysUsersPageListRsp) {
  const { code } = await api.system.sysUsersDelete({ userId: record.userId });
  if (code === 0) {
    tableRef.value?.reload(1);
    message.success(t('common.operationSuccess'));
  }
}

async function handleRefreshGoogleCaptcha(record: SysUsersPageListRsp) {
  const warningDialog = dialog.warning({
    title: t('system.sysUser.dialog.refreshGoogleTitle'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      warningDialog.loading = true;
      try {
        const { code, data } = await api.system.updateGoogleAccount({
          userId: record.userId,
        });
        if (code === 0) {
          message.success(t('system.sysUser.dialog.refreshSuccess'));
          tableRef.value?.reload();
          const googleModal = modal.create({
            title: t('system.sysUser.dialog.googleCaptchaTitle'),
            content: () =>
              h(GoogleAuth, {
                mode: 'preview',
                googleImage: data.googleAccountSecretKey || '',
                userName: record.userName,
              }),
            maskClosable: true,
            preset: 'dialog',
            positiveText: t('common.confirm'),
            onPositiveClick: () => googleModal.destroy(),
            class: 'w-[800px]',
            showIcon: false,
          });
        }
      } finally {
        warningDialog.loading = false;
      }
    },
  });
}
</script>

<template>
  <ProCrudTable
    ref="tableRef"
    class="system-user-page"
    :columns="columns"
    :search-columns="searchColumns"
    :request="loadDataTable"
    :action-column="actionColumn"
    :row-props="rowProps"
    row-key="userId"
    :row-selection="{ disabled: (row) => !row.canOperate }"
    :batch-actions="batchActions"
    search-cols="1 s:2 m:3 l:3"
    @selection-change="handleSelectionChange"
    @batch-action="handleBatchAction"
    search-layout="flex"
  >
    <template #table-header>
      <NSpace :size="8">
        <n-button
          type="primary"
          v-permission="['SystemManage:SysUserPage:UserPage:Add']"
          @click="handleAdd"
        >
          <template #icon>
            <NIcon><PlusOutlined /></NIcon>
          </template>
          {{ t('system.sysUser.batch.addUser') }}
        </n-button>
        <NDropdown
          v-if="batchWithdrawOptions.length > 0"
          trigger="click"
          :options="batchWithdrawOptions"
          @select="handleBatchWithdraw"
        >
          <n-button :disabled="!hasSelection">
{{
            t('system.sysUser.batch.adjustWithdraw')
          }}
</n-button>
        </NDropdown>
        <NDropdown
          v-if="canChangeBatchStatus"
          trigger="click"
          :options="batchStatusOptions"
          @select="handleBatchStatus"
        >
          <n-button :disabled="!hasSelection">
{{
            t('system.sysUser.batch.changeStatus')
          }}
</n-button>
        </NDropdown>
        <n-button
          v-permission="[
            'SystemManage:SysUserPage:UserPage:BatchUpdateTenantSysUserPermission',
          ]"
          type="warning"
          :disabled="!hasSelection"
          @click="handleBatchGrantPerm"
        >
          {{ t('system.sysUser.batch.grantPerm') }}
        </n-button>
      </NSpace>
    </template>
    <template #toolbar-right>
      <NSpace :wrap="false" :size="8" align="center">
        <n-popover
          trigger="click"
          placement="bottom-end"
          :width="680"
          :show-arrow="true"
          :style="{ maxHeight: '500px', overflow: 'visible' }"
        >
          <template #trigger>
            <n-button
              size="small"
              :type="permFilterCount > 0 ? 'info' : 'default'"
            >
              {{ t('system.sysUser.permFilter.title') }}
              <template #icon>
                <NIcon><DownOutlined /></NIcon>
              </template>
              <NBadge
                v-if="permFilterCount > 0"
                :value="permFilterCount"
                :max="9"
                style="margin-left: 4px"
              />
            </n-button>
          </template>
          <div class="py-1">
            <div class="flex gap-4">
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-[14px] mb-2">
                  {{ t('system.sysUser.permFilter.withdrawTitle') }}
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('system.sysUser.permFilter.tenant') }}：</span>
                    <NSelect
                      v-model:value="permFilter.withdrawTenantIds"
                      :options="tenantFilterOptions"
                      size="small"
                      multiple
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('system.sysUser.permFilter.position') }}：</span>
                    <NSelect
                      v-model:value="permFilter.withdrawUserRank"
                      :options="positionFilterOptions"
                      size="small"
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('system.sysUser.permFilter.group') }}：</span>
                    <NSelect
                      v-model:value="permFilter.withdrawConfigGroupId"
                      :options="configGroupFilterOptions"
                      size="small"
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('common.status') }}：</span>
                    <NSelect
                      v-model:value="permFilter.withdrawState"
                      :options="permStateOptions"
                      size="small"
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-[14px] mb-2">
                  {{ t('system.sysUser.permFilter.approvalTitle') }}
                </div>
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('system.sysUser.permFilter.tenant') }}：</span>
                    <NSelect
                      v-model:value="permFilter.approvalTenantIds"
                      :options="tenantFilterOptions"
                      size="small"
                      multiple
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('system.sysUser.permFilter.permType') }}：</span>
                    <NSelect
                      v-model:value="permFilter.approvalUserRole"
                      :options="approvalRoleOptions"
                      size="small"
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="shrink-0 text-[12px] w-[42px] text-right">{{ t('common.status') }}：</span>
                    <NSelect
                      v-model:value="permFilter.approvalState"
                      :options="permStateOptions"
                      size="small"
                      clearable
                      :placeholder="t('common.all')"
                      class="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex justify-end gap-2 mt-3 pt-2.5 border-t border-gray-100"
            >
              <n-button size="small" @click="handleResetPermFilter">
                {{ t('system.sysUser.permFilter.reset') }}
              </n-button>
              <n-button
                size="small"
                type="primary"
                @click="handleApplyPermFilter"
              >
                {{ t('system.sysUser.permFilter.apply') }}
              </n-button>
            </div>
          </div>
        </n-popover>
      </NSpace>
    </template>
  </ProCrudTable>
</template>

<style lang="less" scoped>
// 行级禁用遮罩：整行置灰 + 拦截点击，让里面的开关/按钮自动不可操作。
// checkbox 由 row-selection.disabled 单独置灰，不受 pointer-events 影响。
//
// ⚠️ 不能按 td 逐列 opacity：右侧 `fixed: 'right'` 操作列使用 sticky，
// 有独立底色，逐 td 置灰会和非 fixed 列底色割裂。改成 tr 级 opacity
// 让整行（含 sticky td）一起过一层透明度，视觉统一。
.system-user-page ::v-deep(tr.tenant-user-row--disabled) {
  opacity: 0.5;
  pointer-events: none;
}
</style>
