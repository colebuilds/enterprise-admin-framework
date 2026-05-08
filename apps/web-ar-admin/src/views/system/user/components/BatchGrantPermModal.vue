<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

import type {
  BatchAddSysUsersApprovalApiConfigReq,
  BatchAddSysUsersWithdrawConfigReq,
  SysUsersDetailApprovalApiConfigRsp,
  SysUsersDetailWithdrawConfigRsp,
  SysUsersPageListRsp,
} from '#/api/system';

import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';
import { AsyncSelect } from '#/components/dict-select';
import { TenantCheckPanel } from '#/components/panel';
import { useTenantOptions } from '#/hooks';

import ApprovalPermCard from './ApprovalPermCard.vue';
import { isEnabledFlag } from './composables/permCardHelpers';
import { renderUserSelectLabel } from './renderUserSelectLabel';
import WithdrawPermCard from './WithdrawPermCard.vue';

interface Props {
  selectedUsers: SysUsersPageListRsp[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: []; save: [] }>();
const { t } = useI18n();
const message = useMessage();
const { tenantOptions } = useTenantOptions();

// 一个 TenantCheckPanel 承载"归属商户"选择，向下派生同一份 tenantOptions 给两张权限卡片
const publicFormRef = ref<FormInst | null>(null);
const publicForm = reactive<{ manageTenantIds: (number | string)[] }>({
  manageTenantIds: [],
});
const publicFormRules: FormRules = {
  manageTenantIds: {
    required: true,
    type: 'array',
    message: t('system.sysUser.grantPerm.selectTenantFirst'),
    trigger: 'change',
  },
};

const sharedTenantOptions = computed(() => {
  if (publicForm.manageTenantIds.length === 0) return [];
  const ids = new Set(publicForm.manageTenantIds.map(String));
  return tenantOptions.value.filter((opt) => ids.has(String(opt.value)));
});

// 权限模板
const source = ref<'copy' | 'custom'>('custom');
const sourceUserId = ref<null | number>(null);
const overrideMode = ref<'all' | 'configured' | 'not_configured'>('all');
const saving = ref(false);

// 复制用户数据
const copyWithdrawData = ref<SysUsersDetailWithdrawConfigRsp | undefined>(
  undefined,
);
const copyApprovalData = ref<SysUsersDetailApprovalApiConfigRsp | undefined>(
  undefined,
);
// 源用户的启用状态（来自 detail.userInfo），权威 initial-enabled
const copyWithdrawEnabled = ref<boolean | undefined>(undefined);
const copyApprovalEnabled = ref<boolean | undefined>(undefined);

// 权限配置（由 PermCard 组件 v-model 输出）
const withdrawConfig = ref<BatchAddSysUsersWithdrawConfigReq | null>(null);
const approvalConfig = ref<BatchAddSysUsersApprovalApiConfigReq | null>(null);
// v-model:enabled 绑定；`enabled=false` 时父组件在提交前会把对应 config 过滤成 undefined
const withdrawEnabled = ref(false);
const approvalEnabled = ref(false);

// 拿到 card 实例好在提交前调 validate()，避免开着开关但必填项空着就放行提交
const withdrawPermRef = ref<InstanceType<typeof WithdrawPermCard> | null>(null);
const approvalPermRef = ref<InstanceType<typeof ApprovalPermCard> | null>(null);

// 跟随顶部 TenantCheckPanel 选中的商户筛选；函数引用随选择变化 → AsyncSelect 自动 refetch
const fetchUserSelectList = computed(() => {
  const tenantIds = publicForm.manageTenantIds.map(Number);
  return () =>
    api.system.getTenantUserSelectList(
      tenantIds.length > 0 ? { tenantIds } : {},
    );
});

async function onSourceUserChange(userId: number) {
  if (!userId) return;
  try {
    const { data, code } = await api.system.getTenantUserDetail({ userId });
    if (code === 0 && data) {
      // 复制时归属商户跟随源用户：与下面剥离 *_TenantIds 不同，
      // 顶部 TenantCheckPanel 的范围是"目标用户能管哪些商户"，源用户的 manageTenantIds
      // 是合理初值；卡片内的 tenantOptions 会跟着 sharedTenantOptions 重算，pruneTenantIds 兜底
      const srcIds = data.userInfo?.manageTenantIds;
      publicForm.manageTenantIds = Array.isArray(srcIds)
        ? [...(srcIds as number[])]
        : [];
      // 复制用户权限配置时剥离商户：目标用户的归属商户可能与来源不同，
      // 避免把来源商户 ID 直接带进表单造成失效选项或误提交
      copyWithdrawData.value = data.withdrawConfig
        ? { ...data.withdrawConfig, withdraw_TenantIds: '' }
        : undefined;
      copyApprovalData.value = data.approvalConfig
        ? { ...data.approvalConfig, approval_TenantIds: '' }
        : undefined;
      // 启用状态以源用户的 userInfo 字段为准（权威），不是 config 里反推
      copyWithdrawEnabled.value = isEnabledFlag(
        data.userInfo?.withdraw_EnableState,
      );
      copyApprovalEnabled.value = isEnabledFlag(
        data.userInfo?.approval_UserState,
      );
    }
  } catch {
    message.error(t('system.sysUser.grantPerm.copyFailed'));
  }
}

const coverageRuleMap: Record<string, 1 | 2 | 3> = {
  all: 1,
  configured: 2,
  not_configured: 3,
};

async function handleConfirm() {
  // 同步守卫 + 立即置位 saving：避免 validate 异步期间按钮未置 loading 被快速双击重复提交
  if (saving.value) return;
  if (!withdrawEnabled.value && !approvalEnabled.value) {
    message.warning(t('system.sysUser.grantPerm.atLeastOne'));
    return;
  }
  saving.value = true;
  try {
    try {
      await publicFormRef.value?.validate();
    } catch {
      return;
    }
    // 出款 / 充值权限卡片自己维护 rules，enabled=false 时内部直接 return true；
    // enabled=true 则跑内部 form.validate()，与 TenantUserDetailModal 的校验时机保持一致。
    if (withdrawPermRef.value && !(await withdrawPermRef.value.validate()))
      return;
    if (approvalPermRef.value && !(await approvalPermRef.value.validate()))
      return;

    await api.system.batchUpdateTenantSysUserPermission({
      userIds: props.selectedUsers.map((u) => u.userId),
      coverageRule: coverageRuleMap[overrideMode.value],
      // 归属商户列表（由顶部 TenantCheckPanel 选中），后端接口新增 publicConfig 字段
      publicConfig: {
        manageTenantIds: publicForm.manageTenantIds.map(Number),
      },
      // 卡片始终输出完整结构（关闭时 EnableState=0 + 默认空字段），永远透传给后端，
      // 让新增 / 编辑 / 批量赋权三处 payload 结构一致；启用态由 EnableState 字段表达
      withdrawConfig: withdrawConfig.value ?? undefined,
      approvalConfig: approvalConfig.value ?? undefined,
    });
    message.success(t('common.operationSuccess'));
    emit('save');
  } catch {
    // interceptor already showed the error toast
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="bgp">
    <!-- 已选用户 -->
    <div class="bgp__selected">
      <span class="bgp__selected-label">
        {{
          t('system.sysUser.grantPerm.selectedTip', {
            count: selectedUsers.length,
          })
        }}
      </span>
      <div class="bgp__selected-tags">
        <n-tag v-for="u in selectedUsers" :key="u.userId" size="small">
          {{ u.userName }}
        </n-tag>
      </div>
    </div>

    <!-- 权限模板 + 覆盖规则 -->
    <div class="bgp__control-bar">
      <div class="bgp__control-group">
        <span class="bgp__label">{{ t('system.sysUser.grantPerm.permTemplate') }}：</span>
        <n-radio-group v-model:value="source" size="small">
          <n-radio value="custom">
            {{ t('system.sysUser.grantPerm.customConfig') }}
          </n-radio>
          <n-radio value="copy">
            {{ t('system.sysUser.grantPerm.copyUser') }}
          </n-radio>
        </n-radio-group>
        <AsyncSelect
          v-if="source === 'copy'"
          v-model="sourceUserId"
          :request="fetchUserSelectList"
          :field-mapping="{ label: 'userName', value: 'userId' }"
          :render-label="renderUserSelectLabel"
          filterable
          :placeholder="t('system.sysUser.grantPerm.selectUser')"
          size="small"
          style="width: 180px; margin-left: 4px"
          @change="onSourceUserChange"
        />
      </div>
      <n-divider vertical style="height: 20px; margin: 0 12px" />
      <div class="bgp__control-group">
        <span class="bgp__label">
          {{ t('system.sysUser.grantPerm.overrideRule') }}：
          <n-tooltip trigger="hover" style="max-width: 320px">
            <template #trigger>
              <span class="bgp__help-icon">?</span>
            </template>
            <div style="font-size: 12px; line-height: 1.8">
              <div>
                <strong>{{ t('common.all') }}：</strong>
                {{ t('system.sysUser.grantPerm.overrideAllDesc') }}
              </div>
              <div>
                <strong>{{
                    t('system.sysUser.grantPerm.overrideConfigured')
                  }}：</strong>
                {{ t('system.sysUser.grantPerm.overrideConfiguredDesc') }}
              </div>
              <div>
                <strong>{{
                    t('system.sysUser.grantPerm.overrideNotConfigured')
                  }}：</strong>
                {{ t('system.sysUser.grantPerm.overrideNotConfiguredDesc') }}
              </div>
            </div>
          </n-tooltip>
        </span>
        <n-radio-group v-model:value="overrideMode" size="small">
          <n-radio value="all">{{ t('common.all') }}</n-radio>
          <n-radio value="configured">
            {{ t('system.sysUser.grantPerm.overrideConfigured') }}
          </n-radio>
          <n-radio value="not_configured">
            {{ t('system.sysUser.grantPerm.overrideNotConfigured') }}
          </n-radio>
        </n-radio-group>
      </div>
    </div>

    <!-- 归属商户：一个 TenantCheckPanel 共用，向下传给两张权限卡片 -->
    <n-scrollbar style="max-height: 65vh; margin-bottom: 12px">
      <n-form
        ref="publicFormRef"
        :model="publicForm"
        :rules="publicFormRules"
        label-placement="top"
        size="small"
      >
        <n-form-item
          path="manageTenantIds"
          :label="t('system.sysUser.grantPerm.tenantScope')"
        >
          <TenantCheckPanel
            v-model="publicForm.manageTenantIds"
            :options="tenantOptions"
          />
        </n-form-item>
      </n-form>

      <!-- 权限卡片：出款 + 充值 -->
      <div class="bgp__cards">
        <WithdrawPermCard
          ref="withdrawPermRef"
          v-model="withdrawConfig"
          v-model:enabled="withdrawEnabled"
          :initial="copyWithdrawData"
          :initial-enabled="copyWithdrawEnabled"
          :tenant-options="sharedTenantOptions"
        />
        <ApprovalPermCard
          ref="approvalPermRef"
          v-model="approvalConfig"
          v-model:enabled="approvalEnabled"
          :initial="copyApprovalData"
          :initial-enabled="copyApprovalEnabled"
          :tenant-options="sharedTenantOptions"
        />
      </div>
    </n-scrollbar>

    <!-- 操作按钮 -->
    <div class="bgp__actions">
      <n-button @click="emit('close')">{{ t('common.cancel') }}</n-button>
      <n-button type="primary" :loading="saving" @click="handleConfirm">
        {{ t('system.sysUser.grantPerm.confirmGrant') }}
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bgp__selected {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
}

.bgp__selected-label {
  color: #374151;
  flex-shrink: 0;
  line-height: 24px;
}

.bgp__selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.bgp__control-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 0;
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 1px solid #e5edf7;
  border-radius: 6px;
  background: #f8fafc;
}

.bgp__control-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.bgp__label {
  font-size: 13px;
  color: #6b7280;
  flex-shrink: 0;
}

.bgp__help-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #d9d9d9;
  color: #595959;
  font-size: 10px;
  font-weight: 600;
  cursor: help;
  margin-left: 2px;
  vertical-align: middle;
}

.bgp__tenant-scope {
  margin-bottom: 12px;
}

.bgp__tenant-title {
  font-size: 12px;
  color: #374151;
  font-weight: 600;
  margin-bottom: 6px;
}

.bgp__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.bgp__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}
</style>
