<script setup lang="ts">
import type { FormInst } from 'naive-ui';

import type {
  BatchAddSysUsersApprovalApiConfigReq,
  BatchAddSysUsersWithdrawConfigReq,
  SysUsersDetailRsp,
  SysUsersUpdateReq,
} from '#/api/system';

import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';
import { AsyncSelect } from '#/components/dict-select';
import { TenantCheckPanel } from '#/components/panel';
import { useTenantOptions } from '#/hooks';

import ApprovalPermCard from './ApprovalPermCard.vue';
import { isEnabledFlag } from './composables/permCardHelpers';
import WithdrawPermCard from './WithdrawPermCard.vue';

interface Props {
  userId: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [];
}>();

const { t } = useI18n();
const message = useMessage();
const { tenantOptions: rawTenantOptions } = useTenantOptions();
const tenantOptions = rawTenantOptions;

// 权限卡片商户选项：仅包含归属商户已选项
const permTenantOptions = computed(() => {
  if (basicForm.manageTenantIds.length === 0) return [];
  const selectedIds = new Set(basicForm.manageTenantIds.map(Number));
  return tenantOptions.value.filter((opt) =>
    selectedIds.has(Number(opt.value)),
  );
});

const activeTab = ref('basic');

// configured 代表"曾经配置过"（基于 rank/role 是否有值），与 enabled 解耦
const withdrawConfigured = computed(
  () => !!detail.value?.withdrawConfig?.withdraw_UserRank,
);
const approvalConfigured = computed(
  () => !!detail.value?.approvalConfig?.approval_UserRole,
);
// enabled 与列表保持一致，权威源为 userInfo.xxxState；由 PermCard 的 update:enabled 实时回传
const withdrawEnabled = ref(false);
const approvalEnabled = ref(false);
// 初始快照，用于 handleSave 判断是否需要单独走 updateTenantSysUserState
const initialWithdrawEnabled = ref(false);
const initialApprovalEnabled = ref(false);

type TabStatus = 'none' | 'off' | 'on';
function permStatus(configured: boolean, enabled: boolean): TabStatus {
  if (!configured) return 'none';
  return enabled ? 'on' : 'off';
}

const tabs = computed(() => [
  { key: 'basic', label: t('system.sysUser.detail.basicInfo') },
  {
    key: 'withdraw',
    label: t('system.sysUser.detail.withdrawPerm'),
    status: permStatus(withdrawConfigured.value, withdrawEnabled.value),
  },
  {
    key: 'approval',
    label: t('system.sysUser.detail.approvalPerm'),
    status: permStatus(approvalConfigured.value, approvalEnabled.value),
  },
]);

const statusMap = computed<Record<TabStatus, { cls: string; text: string }>>(
  () => ({
    on: {
      text: t('system.sysUser.detail.enabled'),
      cls: 'tu-detail__tab-badge--on',
    },
    off: {
      text: t('system.sysUser.detail.disabled'),
      cls: 'tu-detail__tab-badge--off',
    },
    none: {
      text: t('system.sysUser.detail.notConfigured'),
      cls: 'tu-detail__tab-badge--none',
    },
  }),
);

const detailLoading = ref(false);
const saving = ref(false);
const detail = ref<null | SysUsersDetailRsp>(null);

const basicFormRef = ref<FormInst | null>(null);
const withdrawPermRef = ref<InstanceType<typeof WithdrawPermCard> | null>(null);
const approvalPermRef = ref<InstanceType<typeof ApprovalPermCard> | null>(null);
const withdrawConfig = ref<
  BatchAddSysUsersWithdrawConfigReq | null | undefined
>(undefined);
const approvalConfig = ref<
  BatchAddSysUsersApprovalApiConfigReq | null | undefined
>(undefined);

// 基本信息表单
const basicForm = reactive({
  userName: '',
  nickName: '',
  roleIds: [] as number[],
  orgId: '',
  manageTenantIds: [] as (number | string)[],
  userState: '1',
  googleVerify: '0',
});

const basicRules = {
  nickName: {
    required: true,
    message: () => t('system.sysUser.detail.rule.userNameRequired'),
    trigger: 'blur',
  },
  roleIds: {
    required: true,
    type: 'array' as const,
    message: () => t('system.sysUser.detail.rule.roleRequired'),
    trigger: 'change',
  },
  manageTenantIds: {
    required: true,
    type: 'array' as const,
    message: () => t('system.sysUser.detail.rule.tenantRequired'),
    trigger: 'change',
  },
};

// 加载详情
async function loadDetail() {
  detailLoading.value = true;
  try {
    const { data, code } = await api.system.getTenantUserDetail({
      userId: props.userId,
    });
    if (code !== 0 || !data) return;

    detail.value = data;

    // 填充基本信息
    const info = data.userInfo;
    basicForm.userName = info.userName;
    basicForm.nickName = info.nickName;
    basicForm.roleIds = Array.isArray(info.roleIds) ? info.roleIds : [];
    basicForm.orgId = info.orgId;
    basicForm.manageTenantIds = Array.isArray(info.manageTenantIds)
      ? info.manageTenantIds
      : [];
    // 归一化为字符串（接口类型虽声明 string，但实际下发可能是 number；
    // 且 || 对 0 会 fallthrough，会把「禁用」误当成「启用」）
    basicForm.userState =
      info.userState !== null && info.userState !== undefined
        ? String(info.userState)
        : '1';
    basicForm.googleVerify =
      info.googleVerify !== null && info.googleVerify !== undefined
        ? String(info.googleVerify)
        : '0';

    // 以 userInfo 的权威状态字段初始化 tab 徽章状态与快照
    // isEnabledFlag 兼容 1 / "1" / true 三种返回（后端实际下发常是 number 而非 string）
    const withdrawOn = isEnabledFlag(info.withdraw_EnableState);
    const approvalOn = isEnabledFlag(info.approval_UserState);
    withdrawEnabled.value = withdrawOn;
    approvalEnabled.value = approvalOn;
    initialWithdrawEnabled.value = withdrawOn;
    initialApprovalEnabled.value = approvalOn;
  } catch {
    message.error(t('system.sysUser.detail.loadFailed'));
  } finally {
    detailLoading.value = false;
  }
}

onMounted(loadDetail);

// 保存
async function handleSave() {
  try {
    await basicFormRef.value?.validate();
  } catch {
    return;
  }
  if (withdrawPermRef.value && !(await withdrawPermRef.value.validate()))
    return;
  if (approvalPermRef.value && !(await approvalPermRef.value.validate()))
    return;

  const req: SysUsersUpdateReq = {
    userId: props.userId,
    userInfo: {
      userName: basicForm.userName,
      nickName: basicForm.nickName,
      roleIds: basicForm.roleIds,
      orgId: basicForm.orgId,
      manageTenantIds: basicForm.manageTenantIds.map(Number),
      userState: basicForm.userState,
      googleVerify: basicForm.googleVerify,
    },
    // 卡片始终输出完整结构（关闭时 EnableState=0 + 默认空字段），永远透传给后端，
    // 与新增 / 批量赋权对齐 payload 结构。Card 内部以 detail 为初始 form，open 状态下
    // 输出已经反映用户编辑后的完整字段，无需再用 Object.assign 与 detail 合并。
    withdrawConfig: withdrawConfig.value ?? undefined,
    approvalConfig: approvalConfig.value ?? undefined,
  };
  saving.value = true;
  try {
    const { code, msg } = await api.system.updateTenantSysUser(req);
    if (code !== 0) {
      message.error(msg || t('system.sysUser.detail.saveFailed'));
      return;
    }

    // 出款/充值权限的 enabled 开关 **不在** updateTenantSysUser 接口语义内，
    // 若用户在编辑弹窗里改了开关，单独走 updateTenantSysUserState 切状态
    // (stateType: 1=出款, 2=充值；与列表行 switch 用同一接口保持一致)
    const stateTogglePromises: Promise<any>[] = [];
    if (withdrawEnabled.value !== initialWithdrawEnabled.value) {
      stateTogglePromises.push(
        api.system.updateTenantSysUserState({
          userIds: [props.userId],
          stateType: 1,
          state: withdrawEnabled.value ? 1 : 0,
        }),
      );
    }
    if (approvalEnabled.value !== initialApprovalEnabled.value) {
      stateTogglePromises.push(
        api.system.updateTenantSysUserState({
          userIds: [props.userId],
          stateType: 2,
          state: approvalEnabled.value ? 1 : 0,
        }),
      );
    }
    if (stateTogglePromises.length > 0) {
      await Promise.all(stateTogglePromises);
    }

    message.success(t('system.sysUser.detail.saveSuccess'));
    emit('save');
  } catch {
    message.error(t('system.sysUser.detail.saveFailed'));
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="tu-detail">
    <div class="tu-detail__main">
      <n-spin :show="detailLoading">
        <!-- 简易 tab -->
        <div class="tu-detail__tabs">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            class="tu-detail__tab"
            :class="{ 'tu-detail__tab--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span
              v-if="tab.status"
              class="tu-detail__tab-badge"
              :class="statusMap[tab.status].cls"
            >
              {{ statusMap[tab.status].text }}
            </span>
          </div>
        </div>

        <!-- 基本信息 -->
        <div v-show="activeTab === 'basic'">
          <n-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-placement="top"
            size="small"
          >
            <div class="tu-detail__form-grid">
              <n-form-item
                :label="t('system.sysUser.detail.field.userAccount')"
              >
                <n-input :value="basicForm.userName" disabled />
              </n-form-item>
              <n-form-item
                :label="t('system.sysUser.detail.field.userName')"
                path="nickName"
              >
                <n-input
                  v-model:value="basicForm.nickName"
                  :placeholder="
                    t('system.sysUser.detail.field.userNamePlaceholder')
                  "
                  :maxlength="50"
                  show-count
                />
              </n-form-item>
            </div>
            <n-form-item
              :label="t('system.sysUser.detail.field.rolePermission')"
              path="roleIds"
            >
              <AsyncSelect
                v-model:value="basicForm.roleIds"
                dict-key="roleList"
                source="dynamic"
                multiple
                filterable
                clearable
                :placeholder="t('system.sysUser.detail.field.rolePlaceholder')"
              />
            </n-form-item>
            <n-form-item
              :label="t('system.sysUser.detail.field.belongTenant')"
              path="manageTenantIds"
            >
              <TenantCheckPanel
                v-model="basicForm.manageTenantIds"
                :options="tenantOptions"
              />
            </n-form-item>
            <div class="tu-detail__switches">
              <div class="tu-detail__switch-card">
                <div>
                  <div class="tu-detail__switch-title">
                    {{ t('system.sysUser.detail.userStatus') }}
                  </div>
                  <div class="tu-detail__switch-desc">
                    {{ t('system.sysUser.detail.statusDesc') }}
                  </div>
                </div>
                <n-switch
                  v-model:value="basicForm.userState"
                  checked-value="1"
                  unchecked-value="0"
                />
              </div>
              <div class="tu-detail__switch-card">
                <div>
                  <div class="tu-detail__switch-title">
                    {{ t('system.sysUser.detail.field.googleVerify') }}
                  </div>
                  <div class="tu-detail__switch-desc">
                    {{ t('system.sysUser.detail.googleDesc') }}
                  </div>
                </div>
                <n-switch
                  v-model:value="basicForm.googleVerify"
                  checked-value="1"
                  unchecked-value="0"
                />
              </div>
            </div>
          </n-form>
        </div>

        <!-- 出款权限配置 -->
        <div v-show="activeTab === 'withdraw'">
          <WithdrawPermCard
            ref="withdrawPermRef"
            v-model="withdrawConfig"
            v-model:enabled="withdrawEnabled"
            :initial="detail?.withdrawConfig"
            :initial-enabled="
              isEnabledFlag(detail?.userInfo?.withdraw_EnableState)
            "
            :tenant-options="permTenantOptions"
            :editing-user-id="userId"
          />
        </div>

        <!-- 人工充值权限配置 -->
        <div v-show="activeTab === 'approval'">
          <ApprovalPermCard
            ref="approvalPermRef"
            v-model="approvalConfig"
            v-model:enabled="approvalEnabled"
            :initial="detail?.approvalConfig"
            :initial-enabled="
              isEnabledFlag(detail?.userInfo?.approval_UserState)
            "
            :tenant-options="permTenantOptions"
          />
        </div>
      </n-spin>
    </div>

    <!-- 底部按钮 -->
    <div class="tu-detail__footer">
      <n-button @click="emit('close')">{{ t('common.cancel') }}</n-button>
      <n-button type="primary" :loading="saving" @click="handleSave">
        {{ t('system.sysUser.detail.saveAll') }}
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tu-detail {
  min-height: 480px;
  position: relative;
  padding-bottom: 56px;
}

.tu-detail__main {
  width: 100%;
}

.tu-detail__form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 16px;
}

.tu-detail__switches {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.tu-detail__switch-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  flex: 1;
}

.tu-detail__switch-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.tu-detail__switch-desc {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

.tu-detail__tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #efeff5;
  margin-bottom: 12px;
}

.tu-detail__tab {
  padding: 8px 0;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: #1f2937;
  }

  &--active {
    color: #1f2937;
    font-weight: 500;
    border-bottom-color: var(--ui-accent-solid);
  }
}

.tu-detail__tab-badge {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 500;
  margin-left: 4px;

  &--on {
    color: #16a34a;
    background: #f0fdf4;
  }

  &--off {
    color: #dc2626;
    background: #fef2f2;
  }

  &--none {
    color: #9ca3af;
    background: #f3f4f6;
  }
}

// 底部按钮
.tu-detail__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 0 0;
  border-top: 1px solid #f0f0f0;
}
</style>
