<!--
/**
 * @description 平台系统用户页面：负责平台用户列表查询、角色标签渲染、用户状态维护、谷歌验证与密码重置等表格交互。
 * @date.  26-05-06
 * @scope src/views/system/user
 */
-->
<script lang="ts" setup>
import type {
  EnableEnum,
  SysUserPageListReq,
  SysUsersPageListRsp,
} from '#/api/system';
import type {
  ProColumn,
  ProCrudTableInstance,
  ProSearchFormColumn,
} from '#/components/pro';

import { computed, h, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { PlusOutlined } from '@vicons/antd';
import { NIcon, useDialog, useMessage, useModal } from 'naive-ui';

import { api } from '#/api';
import { ConfirmSwitch } from '#/components/confirm-switch';
import { useDictionary } from '#/components/dict-select';
import { GoogleAuth } from '#/components/google-auth';
import { ProCrudTable } from '#/components/pro';
import { createActionColumn } from '#/components/table';
import {
  renderBoolTag,
  renderDateTime,
  renderIPLink,
  renderTagList,
} from '#/components/table-renders';

import ResetPasswordModal from './components/ResetPasswordModal.vue';
import UserFormModal from './components/UserFormModal.vue';

const { t } = useI18n();

const tableRef = ref<null | ProCrudTableInstance>(null);
const selectedRows = ref<SysUsersPageListRsp[]>([]);

const message = useMessage();
const dialog = useDialog();
const modal = useModal();
// 角色名 / 角色下拉走 dynamic 字典 roleList 反查（§1.2）
const dictDynamic = useDictionary({ source: 'dynamic' });

function resolveRoleNames(roleIds: string): string[] {
  return String(roleIds || '')
    .replaceAll(/^,|,$/g, '')
    .split(',')
    .map((id) => dictDynamic.findLabel('roleList', Number(id.trim())))
    .filter(Boolean);
}

onMounted(() => {});

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
      placeholder: t('system.sysUser.search.accountSearchPlaceholder'),
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

const columns = computed<ProColumn[]>(() => [
  { key: 'userName', title: t('system.sysUser.col.account'), width: 150 },
  {
    key: 'nickName',
    title: t('system.sysUser.col.name'),
    width: 140,
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
  {
    key: 'userLoginDate',
    title: t('system.sysUser.col.lastLoginTime'),
    width: 180,
    render: (row: SysUsersPageListRsp) => renderDateTime(row.userLoginDate),
  },
  {
    key: 'userLoginIP',
    title: t('system.sysUser.col.lastLoginIP'),
    width: 180,
    render: (row: SysUsersPageListRsp) => renderIPLink(row.userLoginIP),
  },
  {
    key: 'isOnLine',
    title: t('system.sysUser.col.onlineStatus'),
    width: 100,
    render: (row: SysUsersPageListRsp) =>
      renderBoolTag(row.isOnLine, t('common.online'), t('common.offline')),
  },
  {
    key: 'userState',
    title: t('system.sysUser.col.userStatus'),
    width: 110,
    render(row: SysUsersPageListRsp) {
      return h(ConfirmSwitch, {
        key: `switch-${row.userId}`,
        checkedValue: 1,
        uncheckedValue: 0,
        modelValue: row.userState,
        permission: ['SystemManage:SysUserPage:UserPage:UpdateState'],
        onConfirm: async (value: EnableEnum) => {
          const { code } = await api.system.updateUsersState({
            userId: row.userId,
            userState: value,
          });
          if (code === 0) tableRef.value?.reload();
        },
      });
    },
  },
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
]);

const actionColumn = createActionColumn(() => ({
  actions: [
    {
      label: t('common.edit'),
      type: 'primary',
      onClick: (row: SysUsersPageListRsp) => handleOpenUserModal('edit', row),
      auth: ['SystemManage:SysUserPage:UserPage:Update'],
    },
    {
      label: t('common.delete'),
      type: 'delete',
      onClick: (row: SysUsersPageListRsp) => handleDelete(row),
      auth: ['SystemManage:SysUserPage:UserPage:Delete'],
    },
  ],
  dropdownActions: [
    {
      label: t('system.sysUser.actions.resetPassword'),
      onClick: (row: SysUsersPageListRsp) => openResetPasswordModal(row),
      auth: ['SystemManage:SysUserPage:UserPage:RevisePassword'],
    },
    {
      label: t('system.sysUser.actions.refreshGoogle'),
      onClick: (row: SysUsersPageListRsp) => handleRefreshGoogleCaptcha(row),
      auth: ['SystemManage:SysUserPage:UserPage:UpdateGoogleAccount'],
    },
  ],
  width: 180,
}));

const batchActions = computed(() => [
  { label: t('system.sysUser.batch.deleteSelected'), key: 'delete' },
]);

function handleSelectionChange(_keys: number[], rows: SysUsersPageListRsp[]) {
  selectedRows.value = rows;
}

function handleBatchAction(key: string, rows: SysUsersPageListRsp[]) {
  if (key === 'delete') {
    handleBatchDelete(rows);
  }
}

async function handleBatchDelete(rows: SysUsersPageListRsp[]) {
  if (rows.length === 0) return;

  dialog.warning({
    title: t('common.tip'),
    content: t('system.sysUser.batch.deleteConfirm', { count: rows.length }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      const { code } = await api.system.batchDeleteSysUser({
        userIds: rows.map((row) => row.userId),
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
    tenantId: params.tenantId,
    userName: String(params?.userName ?? '').trim() || undefined,
    state: params?.state,
    roleId: params?.roleId,
    orderBy: 'Desc',
    sortField: 'UserId',
    pageNo: params?.pageNo ?? 1,
    pageSize: params?.pageSize ?? 10,
  };

  const { data, result } = await api.system.sysUsersGetPageList(requestParams);
  if (!result) return { list: [], total: 0 };

  return data;
}

function handleOpenUserModal(
  mode: 'add' | 'edit',
  record?: SysUsersPageListRsp,
) {
  const modalInstance = modal.create({
    title:
      mode === 'add'
        ? t('system.sysUser.dialog.addUser')
        : t('system.sysUser.dialog.editUser'),
    preset: 'card',
    showIcon: false,
    style: { width: '720px' },
    content: () =>
      h(UserFormModal, {
        mode,
        record,
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
    row-key="userId"
    row-selection
    :batch-actions="batchActions"
    search-cols="1 s:2 m:3 l:3"
    @selection-change="handleSelectionChange"
    @batch-action="handleBatchAction"
    search-layout="flex"
  >
    <template #table-header>
      <n-button
        type="primary"
        v-permission="['SystemManage:SysUserPage:UserPage:Add']"
        @click="handleOpenUserModal('add')"
      >
        <template #icon>
          <NIcon>
            <PlusOutlined />
          </NIcon>
        </template>
        {{ t('system.sysUser.batch.addUser') }}
      </n-button>
    </template>
  </ProCrudTable>
</template>
