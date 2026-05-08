<script setup lang="ts">
import type { FormInst } from 'naive-ui';

import type {
  ApprovalInitial,
  ApprovalOutput,
  PermCardProps,
} from './composables/permCardTypes';

import { computed, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { useDictionary } from '#/components/dict-select';
import { ProNumberRange } from '#/components/pro';

import { useApprovalConfigForm } from './composables/useApprovalConfigForm';

/**
 * 人工充值权限卡
 * - v-model 输出 payload（`ApprovalOutput | null`）。
 * - v-model:enabled 输出启用态，父组件响应式消费。
 * - `initial` 统一回显入口：undefined = 新增；有值 = 复制 / 编辑（内部不区分）。
 * - `initialEnabled` 仅在编辑场景下作为权威 seed；其他场景让卡片自行推断。
 * - 所有 state / 快照恢复 / 字段裁剪都在 `useApprovalConfigForm` 里。
 */
const props = withDefaults(defineProps<PermCardProps<ApprovalInitial>>(), {
  initial: undefined,
  initialEnabled: undefined,
  tenantOptions: () => [],
});

const model = defineModel<ApprovalOutput | null>({ default: null });
const enabled = defineModel<boolean>('enabled', { default: false });

const { t } = useI18n();
const formRef = ref<FormInst | null>(null);
// 角色权限选项走 common 字典 approvalUserRoleList（§1.1，code 为 number 与 form.approval_UserRole 同构）
const dict = useDictionary({ source: 'common' });
const approvalUserRoleOptions = computed(() =>
  dict.getOptions('approvalUserRoleList'),
);

const {
  form,
  roleAuthorizeOptions,
  subRoleAuthorizeOptions,
  isOperator,
  rules,
  handleRoleChange,
  handleRoleAuthorizeChange,
} = useApprovalConfigForm({
  initial: toRef(props, 'initial'),
  initialEnabled: toRef(props, 'initialEnabled'),
  tenantOptions: toRef(props, 'tenantOptions'),
  enabled,
  output: model,
});

const tenantOptions = toRef(props, 'tenantOptions');

async function validate(): Promise<boolean> {
  if (!enabled.value) return true;
  try {
    await formRef.value?.validate();
    return true;
  } catch {
    return false;
  }
}

defineExpose({ validate });
</script>

<template>
  <div class="perm-card" :class="{ 'perm-card--disabled': !enabled }">
    <div class="perm-card__title">
      <span>{{ t('system.sysUser.approval.title') }}</span>
      <n-switch v-model:value="enabled" size="small" />
    </div>
    <div class="perm-card__body">
      <n-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="top"
        size="small"
      >
        <n-grid :cols="2" :x-gap="12" :y-gap="0">
          <!-- 角色权限 + 商户 -->
          <n-form-item-gi
            :span="1"
            :label="t('system.sysUser.approval.rolePermission')"
          >
            <n-radio-group
              v-model:value="form.approval_UserRole"
              size="small"
              @update:value="handleRoleChange"
            >
              <n-radio
                v-for="opt in approvalUserRoleOptions"
                :key="String(opt.value)"
                :value="opt.value"
              >
                {{ opt.label }}
              </n-radio>
            </n-radio-group>
          </n-form-item-gi>
          <n-form-item-gi
            :span="1"
            path="approval_TenantIds"
            :label="t('system.sysUser.approval.tenant')"
          >
            <n-select
              v-model:value="form.approval_TenantIds"
              :options="tenantOptions"
              multiple
              filterable
              clearable
              :placeholder="t('system.sysUser.approval.selectTenant')"
            />
          </n-form-item-gi>

          <!-- 操作内容（跨两列） -->
          <n-form-item-gi
            :span="2"
            path="approval_RoleAuthorize"
            :label="t('system.sysUser.approval.operationContent')"
          >
            <div>
              <n-checkbox-group
                v-model:value="form.approval_RoleAuthorize"
                @update:value="handleRoleAuthorizeChange"
              >
                <n-space :size="8">
                  <n-checkbox
                    v-for="opt in roleAuthorizeOptions"
                    :key="String(opt.value)"
                    :value="opt.value"
                    size="small"
                  >
                    {{ opt.label }}
                  </n-checkbox>
                </n-space>
              </n-checkbox-group>
              <template v-if="subRoleAuthorizeOptions.length > 0">
                <div class="perm-card__sub-label">
                  {{ t('system.sysUser.approval.rechargePerms') }}：
                </div>
                <n-checkbox-group
                  v-model:value="form.approval_SubRoleAuthorize"
                >
                  <n-space :size="8" :wrap="true">
                    <n-checkbox
                      v-for="opt in subRoleAuthorizeOptions"
                      :key="String(opt.value)"
                      :value="opt.value"
                      size="small"
                    >
                      {{ opt.label }}
                    </n-checkbox>
                  </n-space>
                </n-checkbox-group>
              </template>
            </div>
          </n-form-item-gi>
        </n-grid>

        <!-- 操作员限额配置 -->
        <template v-if="isOperator && subRoleAuthorizeOptions.length > 0">
          <div class="perm-card__section">
            <div class="perm-card__section-title">
              {{ t('system.sysUser.approval.limitConfig') }}
            </div>
            <n-grid :cols="2" :x-gap="12" :y-gap="0">
              <!-- 左列：单笔 / 单日（普通）-->
              <n-form-item-gi
                :span="1"
                path="approval_PermissionConfig.dailyApplyCountLimit"
                :label="t('system.sysUser.approval.dailyCountLimit')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.approval_PermissionConfig.dailyApplyCountLimit
                  "
                  :min="0"
                  :precision="0"
                  :show-button="false"
                  style="width: 100%"
                />
              </n-form-item-gi>
              <!-- 右列：批量 -->
              <n-form-item-gi
                :span="1"
                path="approval_PermissionConfig.dailyBatchApplyCountLimit"
                :label="t('system.sysUser.approval.batchDailyCountLimit')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.approval_PermissionConfig.dailyBatchApplyCountLimit
                  "
                  :min="0"
                  :precision="0"
                  :show-button="false"
                  style="width: 100%"
                />
              </n-form-item-gi>

              <n-form-item-gi
                :span="1"
                path="approval_PermissionConfig.dailyApplyAmountLimit"
                :label="t('system.sysUser.approval.dailyAmountLimit')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.approval_PermissionConfig.dailyApplyAmountLimit
                  "
                  :min="0"
                  :precision="2"
                  :show-button="false"
                  style="width: 100%"
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="1"
                path="approval_PermissionConfig.dailyBatchApplyAmountLimit"
                :label="t('system.sysUser.approval.batchDailyAmountLimit')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.approval_PermissionConfig.dailyBatchApplyAmountLimit
                  "
                  :min="0"
                  :precision="2"
                  :show-button="false"
                  style="width: 100%"
                />
              </n-form-item-gi>

              <n-form-item-gi
                :span="1"
                path="approval_PermissionConfig.singleRechargeAmountLimit"
                :label="t('system.sysUser.approval.singleAmountLimit')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.approval_PermissionConfig.singleRechargeAmountLimit
                  "
                  :min="0"
                  :precision="2"
                  :show-button="false"
                  style="width: 100%"
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="1"
                path="approval_PermissionConfig.singleBatchRechargeAmountLimit"
                :label="t('system.sysUser.approval.batchSingleAmountLimit')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.approval_PermissionConfig
                      .singleBatchRechargeAmountLimit
                  "
                  :min="0"
                  :precision="2"
                  :show-button="false"
                  style="width: 100%"
                />
              </n-form-item-gi>

              <!-- 是否需要审核：跨两列单独一行 -->
              <n-form-item-gi
                :span="2"
                :label="t('system.sysUser.approval.needAudit')"
              >
                <n-radio-group
                  v-model:value="form.approval_IsRequireApproval"
                  size="small"
                >
                  <n-radio value="1">
                    {{ t('system.sysUser.approval.open') }}
                  </n-radio>
                  <n-radio value="0">
                    {{ t('system.sysUser.approval.close') }}
                  </n-radio>
                </n-radio-group>
              </n-form-item-gi>
            </n-grid>
          </div>
        </template>

        <!-- 审核员金额范围 -->
        <template v-if="!isOperator">
          <div class="perm-card__section">
            <n-grid :cols="2" :x-gap="12" :y-gap="0">
              <n-form-item-gi
                :span="2"
                path="approval_PermissionConfig.auditMinAmount"
                :label="t('system.sysUser.approval.auditAmountRange')"
              >
                <ProNumberRange
                  v-model:min="form.approval_PermissionConfig.auditMinAmount"
                  v-model:max="form.approval_PermissionConfig.auditMaxAmount"
                  :precision="2"
                  :number-min="0"
                  min-placeholder="0.00"
                  max-placeholder="0.00"
                  separator="~"
                />
              </n-form-item-gi>
            </n-grid>
          </div>
        </template>
      </n-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
.perm-card {
  border: 1px solid #e0eaf5;
  border-radius: 6px;
  overflow: hidden;

  &--disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}

.perm-card__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  background: #f0f5ff;
  border-bottom: 1px solid #e0eaf5;
  pointer-events: auto;
}

.perm-card__body {
  padding: 12px;
}

.perm-card__section {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
}

.perm-card__section-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.perm-card__sub-label {
  font-size: 11px;
  color: #9ca3af;
  margin: 6px 0 4px;
}
</style>
