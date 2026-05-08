<template>
  <div class="perm-card" :class="{ 'perm-card--disabled': !enabled }">
    <div class="perm-card__title">
      <span>{{ t('system.sysUser.withdraw.title') }}</span>
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
          <!-- 职位 + 组别 -->
          <n-form-item-gi
            :span="1"
            path="withdraw_UserRank"
            :label="t('system.sysUser.withdraw.rank')"
          >
            <AsyncSelect
              :key="`withdraw-rank-${locale}`"
              v-model="form.withdraw_UserRank"
              dict-key="withdrawUserRankList"
              :placeholder="t('system.sysUser.withdraw.selectRank')"
              :fallback-option="false"
              @change="handleRankChange"
            />
          </n-form-item-gi>
          <n-form-item-gi
            v-if="isMemberOrLeader"
            :span="1"
            path="withdraw_ConfigGroupId"
            :label="t('system.sysUser.withdraw.configGroup')"
          >
            <AsyncSelect
              v-model="form.withdraw_ConfigGroupId"
              dict-key="withdrawConfigGroupList"
              source="dynamic"
              :placeholder="t('system.sysUser.withdraw.selectGroup')"
              @change="handleConfigGroupChange"
            >
              <template #empty>
                <span class="perm-card__empty-hint">
                  {{ t('system.sysUser.withdraw.noGroup') }}，<a
                    class="perm-card__link"
                    @click="goDispatchConfig"
                    >{{ t('system.sysUser.withdraw.goCreate') }}</a
                  >
                </span>
              </template>
            </AsyncSelect>
          </n-form-item-gi>

          <!-- 上级选择（组员/组长，跨两列） -->
          <n-form-item-gi
            v-if="
              form.withdraw_UserRank === 'Staff' ||
              form.withdraw_UserRank === 'Leader'
            "
            :span="2"
            path="withdraw_ParentSysUserIds"
          >
            <template #label>
              {{
                form.withdraw_UserRank === 'Staff'
                  ? t('system.sysUser.withdraw.selectLeader')
                  : t('system.sysUser.withdraw.selectSupervisor')
              }}
            </template>
            <div class="perm-card__tag-picker">
              <n-spin v-if="superiorLoading" :size="14" />
              <template v-else-if="superiorOptions.length">
                <div
                  v-for="item in superiorOptions"
                  :key="item.value"
                  class="perm-card__tag-item"
                  :class="{
                    'is-selected': selectedSuperiorIds.includes(
                      String(item.value),
                    ),
                  }"
                  @click="toggleSuperior(String(item.value))"
                >
                  {{ item.label }}
                  <span
                    v-if="selectedSuperiorIds.includes(String(item.value))"
                    class="perm-card__tag-check"
                    >✓</span
                  >
                </div>
              </template>
              <span v-else class="perm-card__empty-hint">
                {{ t('system.sysUser.withdraw.noSuperior') }}
              </span>
            </div>
          </n-form-item-gi>

          <!-- 商户（主管/管理员，跨两列） -->
          <n-form-item-gi
            v-if="isSupervisorOrManager"
            :span="2"
            path="withdraw_TenantIds"
            :label="t('system.sysUser.withdraw.tenant')"
          >
            <n-select
              v-model:value="form.withdraw_TenantIds"
              :options="tenantOptions"
              multiple
              filterable
              clearable
              :placeholder="t('system.sysUser.withdraw.selectTenant')"
            />
          </n-form-item-gi>
        </n-grid>

        <!-- 指派订单配置（组员/组长） -->
        <template v-if="isMemberOrLeader">
          <div class="perm-card__section">
            <div class="perm-card__section-title">
              {{ t('system.sysUser.withdraw.orderConfig') }}
              <span class="perm-card__section-note">{{
                t('system.sysUser.withdraw.orderConfigNote')
              }}</span>
            </div>
            <n-grid :cols="2" :x-gap="12" :y-gap="0">
              <n-form-item-gi
                :span="1"
                path="withdraw_ApprovalConfig.auditMinAmount"
                :label="t('system.sysUser.withdraw.amountRange')"
                required
              >
                <div class="perm-card__range">
                  <n-input-number
                    v-model:value="form.withdraw_ApprovalConfig.auditMinAmount"
                    :min="ORDER_AMOUNT_MIN"
                    :max="ORDER_AMOUNT_MAX"
                    :show-button="false"
                    style="flex: 1"
                  />
                  <span class="perm-card__sep">~</span>
                  <n-input-number
                    v-model:value="form.withdraw_ApprovalConfig.auditMaxAmount"
                    :min="ORDER_AMOUNT_MIN"
                    :max="ORDER_AMOUNT_MAX"
                    :show-button="false"
                    style="flex: 1"
                  />
                </div>
              </n-form-item-gi>
              <n-form-item-gi
                :span="1"
                path="withdraw_ApprovalConfig.currentProcessingOrderLimit"
                :label="t('system.sysUser.withdraw.maxConcurrent')"
                required
              >
                <n-input-number
                  v-model:value="
                    form.withdraw_ApprovalConfig.currentProcessingOrderLimit
                  "
                  :min="PROCESSING_LIMIT_MIN"
                  :max="PROCESSING_LIMIT_MAX"
                  :show-button="false"
                  style="width: 100px"
                />
              </n-form-item-gi>
            </n-grid>
          </div>

          <div class="perm-card__section">
            <div class="perm-card__section-title">
              {{ t('system.sysUser.withdraw.tenantAuth') }}
              <span class="perm-card__section-note">{{
                t('system.sysUser.withdraw.tenantAuthNote')
              }}</span>
            </div>
            <n-grid :cols="2" :x-gap="12" :y-gap="0">
              <n-form-item-gi
                :span="1"
                :label="t('system.sysUser.withdraw.currencyType')"
              >
                <n-radio-group
                  v-model:value="currencyType"
                  size="small"
                  @update:value="handleCurrencyTypeChange"
                >
                  <n-radio
                    v-for="opt in currencyTypeOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </n-radio>
                </n-radio-group>
              </n-form-item-gi>
              <n-form-item-gi
                v-if="currencyType === 'Fiat'"
                :span="2"
                path="withdraw_SysCurrency"
                :label="t('system.sysUser.withdraw.fiatCurrency')"
              >
                <n-select
                  v-model:value="form.withdraw_SysCurrency"
                  :options="currencyOptions"
                  :loading="currencyLoading"
                  filterable
                  clearable
                  :placeholder="t('system.sysUser.withdraw.selectFiatCurrency')"
                  @update:value="handleCurrencyChange"
                />
              </n-form-item-gi>
              <n-form-item-gi
                :span="2"
                path="withdraw_TenantIds"
                :label="t('system.sysUser.withdraw.tenant')"
              >
                <n-select
                  v-model:value="form.withdraw_TenantIds"
                  :options="currencyTenantOptions"
                  multiple
                  filterable
                  clearable
                  :disabled="
                    currencyType === 'Fiat' && !form.withdraw_SysCurrency
                  "
                  :placeholder="t('system.sysUser.withdraw.selectTenant')"
                />
              </n-form-item-gi>
            </n-grid>
          </div>
        </template>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { FormInst } from 'naive-ui';
import { AsyncSelect } from '#/components/dict-select';
import type {
  PermCardProps,
  WithdrawInitial,
  WithdrawOutput,
} from './composables/permCardTypes';
import { useWithdrawConfigForm } from './composables/useWithdrawConfigForm';

/**
 * 出款权限卡
 * - v-model 输出 payload（`WithdrawOutput | null`）。
 * - v-model:enabled 输出启用态，父组件响应式消费。
 * - `initial` 统一回显入口：undefined = 新增；有值 = 复制 / 编辑（内部不区分）。
 * - `initialEnabled` 仅在编辑场景下作为权威 seed；其他场景让卡片自行推断。
 * - 所有 state / 快照恢复 / 字段裁剪都在 `useWithdrawConfigForm` 里。
 */
// editingUserId：编辑模式下传当前用户 ID，新增 / 批量场景默认 0。
// 用于 getSuperiorList 排除自己，避免把当前编辑用户列为自己的上级。
const props = withDefaults(
  defineProps<PermCardProps<WithdrawInitial> & { editingUserId?: number }>(),
  {
    initial: undefined,
    initialEnabled: undefined,
    tenantOptions: () => [],
    editingUserId: 0,
  },
);

const model = defineModel<WithdrawOutput | null>({ default: null });
const enabled = defineModel<boolean>('enabled', { default: false });

const { t, locale } = useI18n();
const formRef = ref<FormInst | null>(null);

const {
  form,
  selectedSuperiorIds,
  currencyType,
  currencyTypeOptions,
  superiorOptions,
  superiorLoading,
  currencyLoading,
  isMemberOrLeader,
  isSupervisorOrManager,
  currencyOptions,
  currencyTenantOptions,
  rules,
  handleConfigGroupChange,
  handleRankChange,
  handleCurrencyTypeChange,
  handleCurrencyChange,
  toggleSuperior,
  goDispatchConfig,
  ORDER_AMOUNT_MIN,
  ORDER_AMOUNT_MAX,
  PROCESSING_LIMIT_MIN,
  PROCESSING_LIMIT_MAX,
} = useWithdrawConfigForm({
  initial: toRef(props, 'initial'),
  initialEnabled: toRef(props, 'initialEnabled'),
  tenantOptions: toRef(props, 'tenantOptions'),
  editingUserId: toRef(props, 'editingUserId'),
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
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
}

.perm-card__section-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.perm-card__section-note {
  font-weight: 400;
  font-size: 11px;
  color: #9ca3af;
}

.perm-card__range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.perm-card__sep {
  color: #9ca3af;
}

.perm-card__tag-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.perm-card__tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;

  &:hover {
    border-color: #2080f0;
    color: #2080f0;
  }

  &.is-selected {
    border-color: #2080f0;
    background: rgba(32, 128, 240, 0.08);
    color: #2080f0;
  }
}

.perm-card__tag-check {
  font-size: 11px;
  font-weight: 600;
}

.perm-card__empty-hint {
  font-size: 12px;
  color: #9ca3af;
}

.perm-card__link {
  color: #2080f0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
