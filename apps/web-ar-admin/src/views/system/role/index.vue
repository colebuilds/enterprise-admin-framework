<script lang="ts" setup>
import type { RolePageReq, RolePageRsp } from '#/api/system';
import type {
  ProColumn,
  ProCrudTableInstance,
  ProSearchFormColumn,
} from '#/components';

import { computed, h, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { AlignLeftOutlined, PlusOutlined, SearchOutlined } from '@vicons/antd';
import { NTag, useMessage, useModal } from 'naive-ui';

import { api } from '#/api';
import { createActionColumn, ProCrudTable, renderBoolTag } from '#/components';
import { usePermission } from '#/hooks/usePermission';
import { filterMenu, flattenTree, getTreeAll } from '#/utils';

import RoleFormModal from './components/RoleFormModal.vue';
import SensitiveConfirmModal from './components/SensitiveConfirmModal.vue';

const { t } = useI18n();
const message = useMessage();
const modal = useModal();
const { hasPermission } = usePermission();

type RoleRow = RolePageRsp;

const tableRef = ref<null | ProCrudTableInstance>(null);
const formBtnLoading = ref(false);
const roleLoading = ref(false);
const checkedAll = ref(false);
const editRoleTitle = ref('');
const roleId = ref('');
const treeData = ref<any[]>([]);
const expandedKeys = ref<string[]>([]);
const checkedKeys = ref<any[]>([]);
const pattern = ref('');

const searchColumns: ProSearchFormColumn[] = [
  {
    path: 'keyword',
    label: t('system.role.roleName'),
    valueType: 'text',
    componentProps: {
      placeholder: t('system.role.roleNameTip'),
    },
  },
];

const tableColumns = computed<ProColumn<RoleRow>[]>(() => [
  { key: 'id', title: 'ID', align: 'center', width: 80 },
  {
    key: 'name',
    title: t('system.role.roleName'),
    align: 'center',
    width: 180,
  },
  {
    key: 'state',
    title: t('common.status'),
    align: 'center',
    width: 110,
    render: (row: RoleRow) =>
      renderBoolTag(row.state, t('common.enable'), t('common.disable')),
  },
  {
    key: 'creator',
    title: t('system.role.creator'),
    align: 'center',
    width: 140,
    render: (row: RoleRow) => row.creator ?? '--',
  },
  {
    key: 'createTime',
    title: t('common.create_time'),
    align: 'center',
    width: 220,
    showTenantTimeZone: true,
  },
  {
    key: 'remark',
    title: t('system.role.roleDescription'),
    align: 'center',
    width: 220,
    ellipsis: { tooltip: true },
    render: (row: RoleRow) => row.remark ?? '--',
  },
  {
    key: 'lastUpdateMan',
    title: t('common.last_modify_user'),
    align: 'center',
    width: 140,
    render: (row: RoleRow) => row.lastUpdateMan ?? '--',
  },
  {
    key: 'lastUpdateTime',
    title: t('common.last_modify_time'),
    align: 'center',
    width: 220,
    showTenantTimeZone: true,
  },
]);

const actionColumn = createActionColumn(() => ({
  actions: [
    {
      label: t('system.role.authEdit'),
      onClick: handleMenuAuth,
      type: 'primary',
      auth: ['SystemManage:SysRole:RolePage:UpdaterRoleAuth'],
    },
    {
      label: t('common.edit'),
      onClick: handleEdit,
      auth: ['SystemManage:SysRole:RolePage:Update'],
    },
    {
      label: t('common.delete'),
      onClick: handleDelete,
      type: 'delete',
      auth: ['SystemManage:SysRole:RolePage:DeleteRoleAuth'],
    },
  ],
  width: 220,
}));

async function loadDataTable(params: RolePageReq) {
  const requestParams: RolePageReq = {
    keyword: String(params.keyword ?? '').trim() || undefined,
    orderBy: 'Desc',
    sortField: 'id',
    pageSize: params.pageSize ?? 20,
    pageNo: params.pageNo ?? 1,
  };
  const { data, result } = await api.system.roleGetPageList(requestParams);
  if (!result) return { list: [], total: 0 };
  return data;
}

const rowProps = (row: RoleRow) => {
  const isSelected = roleId.value && roleId.value === String(row.id);
  return {
    class: isSelected ? 'row-selected' : '',
    style: {
      cursor: hasPermission(['SystemManage:SysRole:RolePage:UpdaterRoleAuth'])
        ? 'pointer'
        : 'default',
    },
    onClick: () => {
      if (!hasPermission(['SystemManage:SysRole:RolePage:UpdaterRoleAuth']))
        return;
      handleMenuAuth(row);
    },
  };
};

function handleAdd() {
  const modalInstance = modal.create({
    title: t('system.role.addRole'),
    preset: 'card',
    style: { width: '500px' },
    content: () =>
      h(RoleFormModal, {
        mode: 'add',
        onClose: () => modalInstance.destroy(),
        onSuccess: () => {
          modalInstance.destroy();
          tableRef.value?.reload();
        },
      }),
  });
}

function handleEdit(record: RoleRow) {
  const modalInstance = modal.create({
    title: t('system.role.editRole'),
    preset: 'card',
    style: { width: '500px' },
    content: () =>
      h(RoleFormModal, {
        mode: 'edit',
        record,
        onClose: () => modalInstance.destroy(),
        onSuccess: () => {
          modalInstance.destroy();
          tableRef.value?.reload();
        },
      }),
  });
}

async function handleDelete(record: RoleRow) {
  const { code, msg } = await api.system.deleteMark({ id: record.id });
  if (code !== 0) {
    message.info(msg);
    return;
  }
  message.success(t('common.delete_success'));
  tableRef.value?.reload(1);
}

async function handleMenuAuth(record: RoleRow) {
  if (roleLoading.value) return;
  editRoleTitle.value = record.name;
  roleId.value = String(record.id);
  checkedKeys.value = [];

  try {
    roleLoading.value = true;
    const { data } = await api.system.getMenuTreeByRoleId({
      roleId: record.id,
    });
    filterTreeData(data);
  } finally {
    roleLoading.value = false;
  }
}

function filterTreeData(tree: any[]) {
  if (!Array.isArray(tree)) return;
  for (const item of tree) {
    if (item.children && item.children.length > 0) {
      filterTreeData(item.children);
    } else {
      checkedKeys.value.push(item.id);
    }
  }
}

function getRoleTree() {
  const list = flattenTree(treeData.value);
  return list
    .filter((item: any) => checkedKeys.value.includes(item.id))
    .map((item: any) => ({ menuId: item.id }));
}

function getSensitiveCheckedItems() {
  const allItems = flattenTree(treeData.value);
  return allItems.filter(
    (item: any) =>
      item.needSecondConfirm && checkedKeys.value.includes(item.id),
  );
}

async function handleRoleForm(e: Event) {
  e.preventDefault();

  const sensitiveItems = getSensitiveCheckedItems();
  if (sensitiveItems.length > 0) {
    const modalInstance = modal.create({
      title: t('system.role.sensitiveWarningTitle'),
      preset: 'card',
      style: { width: 'min(600px, calc(100vw - 32px))' },
      content: () =>
        h(SensitiveConfirmModal, {
          treeData: treeData.value,
          sensitiveItems,
          onConfirm: async () => {
            modalInstance.destroy();
            await doSaveRole();
          },
          onCancel: () => modalInstance.destroy(),
        }),
    });
    return;
  }

  await doSaveRole();
}

async function doSaveRole() {
  formBtnLoading.value = true;
  try {
    const list = getRoleTree();
    const { msg, code } = await api.system.updateList({
      roleId: Number(roleId.value),
      list,
    });
    if (code !== 0) {
      message.error(msg);
      return;
    }
    message.success(t('common.edit_success'));
    tableRef.value?.reload();
  } finally {
    formBtnLoading.value = false;
  }
}

function checkedTree(keys: any[]) {
  checkedKeys.value = keys;
}

function onExpandedKeys(keys: string[]) {
  expandedKeys.value = keys;
}

function packHandle() {
  expandedKeys.value =
    expandedKeys.value.length > 0 ? [] : getTreeAll(treeData.value);
}

function checkedAllHandle() {
  if (checkedAll.value) {
    checkedKeys.value = [];
    checkedAll.value = false;
  } else {
    checkedKeys.value = getTreeAll(treeData.value);
    checkedAll.value = true;
  }
}

function createPrefix(data: any[]): any[] {
  if (data.length === 0) return [];
  return data.map((item) => {
    if (item.children?.length) {
      item.children = createPrefix(item.children);
    }
    return {
      ...item,
      prefix: () =>
        h(
          NTag,
          {
            type:
              item.menuType === 1
                ? 'success'
                : (item.menuType === 2
                  ? 'info'
                  : 'warning'),
            size: 'small',
          },
          {
            default: () => {
              if (item.menuType === 1) return t('system.menu.module');
              if (item.menuType === 2) return t('system.menu.menu');
              return t('system.menu.auth');
            },
          },
        ),
      suffix: () =>
        item.needSecondConfirm
          ? h(
              NTag,
              { type: 'error', size: 'small', bordered: true },
              { default: () => t('system.role.sensitive') },
            )
          : null,
    };
  });
}

onMounted(async () => {
  const { data = [] } = await api.system.getAdminMenuTree({});
  expandedKeys.value = getTreeAll(data);
  checkedAll.value = false;
  treeData.value = filterMenu(createPrefix(data), false);
});
</script>

<template>
  <n-grid cols="1 s:1 m:1 l:1 xl:3 2xl:3" responsive="screen" :x-gap="12">
    <n-gi
      :span="
        hasPermission(['SystemManage:SysRole:RolePage:UpdaterRoleAuth']) ? 2 : 3
      "
    >
      <ProCrudTable
        ref="tableRef"
        :page-title="t('system.role.manage')"
        :search-columns="searchColumns"
        search-cols="2 s:2 m:2 l:3 xl:4 2xl:4"
        :columns="tableColumns"
        :action-column="actionColumn"
        :request="loadDataTable"
        :row-key="(row: RoleRow) => row.id"
        :row-props="rowProps"
      >
        <template #table-header>
          <n-button
            type="primary"
            v-permission="['SystemManage:SysRole:RolePage:Add']"
            @click="handleAdd"
          >
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            {{ t('system.role.addRole') }}
          </n-button>
        </template>

        <template #table-alert>
          <n-alert
            :title="t('system.role.authConfig')"
            type="info"
            size="small"
          >
            {{ t('system.role.authConfigTip') }}
            <NTag type="info" size="small" :bordered="true" class="mx-1">
              {{ t('system.role.authEdit') }}
            </NTag>
            {{ t('system.role.authActionTip') }}
          </n-alert>
        </template>
      </ProCrudTable>
    </n-gi>

    <n-gi
      v-if="hasPermission(['SystemManage:SysRole:RolePage:UpdaterRoleAuth'])"
      span="1"
    >
      <n-card :segmented="{ content: true }" :bordered="false" size="small">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-medium">
              {{ t('system.role.distribute') }}:
              <NTag v-if="editRoleTitle" round type="info" class="ml-1">
                {{ editRoleTitle }}
              </NTag>
            </span>
            <n-space size="small">
              <n-button size="small" quaternary @click="packHandle">
                <template #icon>
                  <n-icon size="14"><AlignLeftOutlined /></n-icon>
                </template>
                {{
                  expandedKeys.length > 0
                    ? t('common.foldAll')
                    : t('common.expandAll')
                }}
              </n-button>
              <n-button
                size="small"
                quaternary
                :disabled="!editRoleTitle"
                @click="checkedAllHandle"
              >
                {{
                  checkedAll ? t('common.unselectAll') : t('common.selectAll')
                }}
              </n-button>
              <n-button
                type="primary"
                size="small"
                :loading="formBtnLoading"
                :disabled="!editRoleTitle"
                @click="handleRoleForm"
              >
                {{ t('system.role.saveAuth') }}
              </n-button>
            </n-space>
          </div>
        </template>
        <div class="menu w-full">
          <n-input
            v-model:value="pattern"
            :placeholder="t('system.role.pattern')"
          >
            <template #suffix>
              <n-icon size="18" class="cursor-pointer">
                <SearchOutlined />
              </n-icon>
            </template>
          </n-input>
          <div class="menu-list py-3">
            <n-spin size="medium" :show="roleLoading">
              <n-tree
                block-line
                checkable
                cascade
                virtual-scroll
                :show-irrelevant-nodes="false"
                :pattern="pattern"
                :data="treeData"
                key-field="id"
                label-field="name"
                style="max-height: 550px; overflow: hidden"
                :expanded-keys="expandedKeys"
                :checked-keys="checkedKeys"
                @update:checked-keys="checkedTree"
                @update:expanded-keys="onExpandedKeys"
              />
            </n-spin>
          </div>
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>

<style lang="less" scoped>
/* 选中行高亮 - 使用不透明色避免 fixed 列穿透 */
:deep(.n-data-table-tr.row-selected) {
  td {
    background-color: #cce5ff !important;
  }
}

:deep(.n-data-table-tr.row-selected:hover) {
  td {
    background-color: #b8daff !important;
  }
}
</style>
