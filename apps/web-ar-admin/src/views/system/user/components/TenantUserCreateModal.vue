<script setup lang="ts">
import type { FormInst } from 'naive-ui';

import type {
  BatchAddSysUsersApprovalApiConfigReq,
  BatchAddSysUsersReq,
  BatchAddSysUsersWithdrawConfigReq,
  SysUsersDetailApprovalApiConfigRsp,
  SysUsersDetailWithdrawConfigRsp,
} from '#/api/system';

import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';
import { AsyncSelect } from '#/components/dict-select';
import { TenantCheckPanel } from '#/components/panel';
import { useTenantOptions } from '#/hooks';
import { useAppUserStore } from '#/store/app-user';

import AccountListTable from './AccountListTable.vue';
import ApprovalPermCard from './ApprovalPermCard.vue';
import { isEnabledFlag } from './composables/permCardHelpers';
import { renderUserSelectLabel } from './renderUserSelectLabel';
import WithdrawPermCard from './WithdrawPermCard.vue';

const emit = defineEmits<{
  close: [];
  save: [];
}>();

const { t } = useI18n();
const message = useMessage();
const userStore = useAppUserStore();
const { tenantOptions: rawTenantOptions } = useTenantOptions();
const loading = ref(false);

const accountListRef = ref<InstanceType<typeof AccountListTable> | null>(null);
const publicFormRef = ref<FormInst | null>(null);
const withdrawPermRef = ref<InstanceType<typeof WithdrawPermCard> | null>(null);
const approvalPermRef = ref<InstanceType<typeof ApprovalPermCard> | null>(null);
const withdrawConfig = ref<BatchAddSysUsersWithdrawConfigReq | null>(null);
const approvalConfig = ref<BatchAddSysUsersApprovalApiConfigReq | null>(null);
// v-model:enabled 绑定；`enabled=false` 时父组件在提交前会把对应 config 过滤成 undefined
const withdrawEnabled = ref(false);
const approvalEnabled = ref(false);

const tenantOptions = rawTenantOptions;
const orgId = String(userStore.getUserInfo?.orgId ?? '');

// 出款权限商户选项：仅包含归属商户已选项
const withdrawTenantOptions = computed(() => {
  if (publicConfig.manageTenantIds.length === 0) return [];
  const selectedIds = new Set(publicConfig.manageTenantIds.map(Number));
  return tenantOptions.value.filter((opt) =>
    selectedIds.has(Number(opt.value)),
  );
});

// 公用配置
const publicConfig = reactive({
  roleIds: [] as number[],
  manageTenantIds: [] as (number | string)[],
  userState: '1',
  googleVerify: '0',
});

const publicConfigRules = {
  roleIds: {
    required: true,
    type: 'array' as const,
    message: t('system.sysUser.create.selectRoleRequired'),
    trigger: 'change',
  },
  manageTenantIds: {
    required: true,
    type: 'array' as const,
    message: t('system.sysUser.create.selectTenantRequired'),
    trigger: 'change',
  },
};

// 权限模板
const permSource = ref<'copy' | 'custom'>('custom');
const sourceUserId = ref<null | number>(null);
const copiedWithdrawConfig = ref<SysUsersDetailWithdrawConfigRsp | undefined>();
const copiedApprovalConfig = ref<
  SysUsersDetailApprovalApiConfigRsp | undefined
>();
// 复制源用户的启用状态（来自 detail.userInfo），作为权威 initial-enabled
// 透传给 PermCard，避免在卡内反推 / 误判
const copiedWithdrawEnabled = ref<boolean | undefined>(undefined);
const copiedApprovalEnabled = ref<boolean | undefined>(undefined);

// 跟随"归属商户"筛选；函数引用随选择变化 → AsyncSelect 自动 refetch
const fetchUserSelectList = computed(() => {
  const tenantIds = publicConfig.manageTenantIds.map(Number);
  return () =>
    api.system.getTenantUserSelectList(tenantIds.length > 0 ? { tenantIds } : {});
});

async function handleCopyUserPerm(userId: number) {
  if (!userId) return;
  try {
    const { data, code } = await api.system.getTenantUserDetail({ userId });
    if (code !== 0 || !data) return;
    // 复制用户权限配置时剥离商户：目标用户的归属商户可能与来源不同，
    // 避免把来源商户 ID 直接带进表单造成失效选项或误提交
    copiedWithdrawConfig.value = data.withdrawConfig
      ? { ...data.withdrawConfig, withdraw_TenantIds: '' }
      : undefined;
    copiedApprovalConfig.value = data.approvalConfig
      ? { ...data.approvalConfig, approval_TenantIds: '' }
      : undefined;
    // 启用状态以源用户的 userInfo 字段为准（权威），不是 config 里反推
    copiedWithdrawEnabled.value = isEnabledFlag(
      data.userInfo?.withdraw_EnableState,
    );
    copiedApprovalEnabled.value = isEnabledFlag(
      data.userInfo?.approval_UserState,
    );
    message.success(t('system.sysUser.create.copiedSuccess'));
  } catch {
    message.error(t('system.sysUser.create.copyFailed'));
  }
}

function handlePermSourceChange(val: 'copy' | 'custom') {
  if (val !== 'copy') {
    sourceUserId.value = null;
    copiedWithdrawConfig.value = undefined;
    copiedApprovalConfig.value = undefined;
    copiedWithdrawEnabled.value = undefined;
    copiedApprovalEnabled.value = undefined;
  }
}

async function handleSubmit() {
  if (!accountListRef.value?.validate()) {
    return;
  }
  try {
    await publicFormRef.value?.validate();
  } catch {
    return;
  }
  if (!(await withdrawPermRef.value?.validate())) {
    return;
  }
  if (!(await approvalPermRef.value?.validate())) {
    return;
  }

  // 新增语义：enabled=false 时不提交对应 config，避免"关着但带着 payload"进后端
  const req: BatchAddSysUsersReq = {
    usersInfo: accountListRef.value.getUsers(),
    publicConfig: {
      roleIds: publicConfig.roleIds,
      orgId,
      manageTenantIds: publicConfig.manageTenantIds.map(Number),
      userState: publicConfig.userState,
      googleVerify: publicConfig.googleVerify,
    },
    // 卡片始终输出完整结构（关闭时 EnableState=0 + 默认空字段），永远透传给后端，
    // 让 batchAdd / batchUpdate 三处的 payload 结构一致
    withdrawConfig: withdrawConfig.value ?? undefined,
    approvalConfig: approvalConfig.value ?? undefined,
  };

  loading.value = true;
  try {
    const { code, msg, data } = await api.system.batchAdd(req);
    if (code !== 0) {
      message.error(msg || t('system.sysUser.create.createFailed'));
      return;
    }
    message.success(
      t('system.sysUser.create.createSuccess', {
        count: data?.successCount ?? 0,
      }),
    );
    emit('save');
  } catch {
    message.error(t('system.sysUser.create.createFailed'));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="tu-create">
    <n-scrollbar style="flex: 1; max-height: 75vh">
      <!-- 账号列表 -->
      <div class="mb-4">
        <div class="tu-create__section-title">
          {{ t('system.sysUser.create.accountList') }}
        </div>
        <AccountListTable ref="accountListRef" />
      </div>

      <!-- 公用配置 -->
      <div class="mb-0">
        <div class="tu-create__section-title">
          {{ t('system.sysUser.create.publicConfig') }}
        </div>
        <n-form
          ref="publicFormRef"
          :model="publicConfig"
          :rules="publicConfigRules"
          label-placement="top"
          size="small"
        >
          <n-grid :cols="3" :x-gap="16" :y-gap="0">
            <n-form-item-gi
              :span="1"
              path="roleIds"
              :label="t('system.sysUser.create.rolePermission')"
            >
              <AsyncSelect
                v-model:value="publicConfig.roleIds"
                dict-key="roleList"
                source="dynamic"
                multiple
                filterable
                :placeholder="t('system.sysUser.create.selectRole')"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="1" :label="t('common.status')">
              <n-switch
                v-model:value="publicConfig.userState"
                checked-value="1"
                unchecked-value="0"
                size="small"
              />
            </n-form-item-gi>
            <n-form-item-gi
              :span="1"
              :label="t('system.sysUser.create.googleVerify')"
            >
              <n-switch
                v-model:value="publicConfig.googleVerify"
                checked-value="1"
                unchecked-value="0"
                size="small"
              />
            </n-form-item-gi>
            <n-form-item-gi
              :span="3"
              path="manageTenantIds"
              :label="t('system.sysUser.create.belongTenant')"
            >
              <TenantCheckPanel
                v-model="publicConfig.manageTenantIds"
                :options="tenantOptions"
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>

      <!-- 权限模板 -->
      <div class="tu-create__control-bar">
        <span class="text-[12px] text-gray-500 shrink-0">{{ t('system.sysUser.create.permTemplate') }}：</span>
        <n-radio-group
          v-model:value="permSource"
          size="small"
          @update:value="handlePermSourceChange"
        >
          <n-radio value="custom">
{{
            t('system.sysUser.create.customConfig')
          }}
</n-radio>
          <n-radio value="copy">
{{
            t('system.sysUser.create.copyUser')
          }}
</n-radio>
        </n-radio-group>
        <AsyncSelect
          v-if="permSource === 'copy'"
          v-model="sourceUserId"
          :request="fetchUserSelectList"
          :field-mapping="{ label: 'userName', value: 'userId' }"
          :render-label="renderUserSelectLabel"
          filterable
          :placeholder="t('system.sysUser.create.selectUser')"
          size="small"
          style="width: 200px; margin-left: 8px"
          @change="handleCopyUserPerm"
        />
      </div>

      <!-- 权限卡片 -->
      <div class="tu-create__cards">
        <WithdrawPermCard
          ref="withdrawPermRef"
          v-model="withdrawConfig"
          v-model:enabled="withdrawEnabled"
          :initial="copiedWithdrawConfig"
          :initial-enabled="copiedWithdrawEnabled"
          :tenant-options="withdrawTenantOptions"
        />
        <ApprovalPermCard
          ref="approvalPermRef"
          v-model="approvalConfig"
          v-model:enabled="approvalEnabled"
          :initial="copiedApprovalConfig"
          :initial-enabled="copiedApprovalEnabled"
          :tenant-options="withdrawTenantOptions"
        />
      </div>
    </n-scrollbar>
    <!-- 底部按钮 -->
    <div class="tu-create__actions">
      <n-button @click="emit('close')">{{ t('common.cancel') }}</n-button>
      <n-button type="primary" :loading="loading" @click="handleSubmit">
{{
        t('system.sysUser.create.confirmCreate')
      }}
</n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tu-create {
  display: flex;
  flex-direction: column;
}

.tu-create__section-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #efeff5;
}

.tu-create__control-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fafafc;
  min-height: 45px;
}

.tu-create__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.tu-create__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  margin-top: 4px;
  border-top: 1px solid #efeff5;
  flex-shrink: 0;
}
</style>
