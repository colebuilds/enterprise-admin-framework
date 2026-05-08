import type { FormRules } from 'naive-ui';

import type { Ref } from 'vue';

import type {
  ApprovalOutput,
  ApprovalSnapshot,
  PermCardTenantOption,
} from './permCardTypes';

import type {
  BatchAddSysUsersApprovalPermissionConfigReq,
  SysUsersDetailApprovalApiConfigRsp,
} from '#/api/system';

import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useDictionary } from '#/components/dict-select';

import {
  pruneTenantIds,
  resolveInitialEnabled,
  toApprovalPayload,
} from './permCardHelpers';

/** 审批权限卡内部表单结构（TenantIds 对齐 option.value 使用 number[]，避免 n-select 选中状态匹配不上） */
export interface ApprovalFormState {
  approval_TenantIds: number[];
  approval_UserRole: number;
  approval_RoleAuthorize: number[];
  approval_SubRoleAuthorize: number[];
  approval_IsRequireApproval: string;
  approval_PermissionConfig: BatchAddSysUsersApprovalPermissionConfigReq;
}

function createEmptyForm(): ApprovalFormState {
  return {
    approval_TenantIds: [],
    approval_UserRole: 1,
    approval_RoleAuthorize: [],
    approval_SubRoleAuthorize: [],
    approval_IsRequireApproval: '0',
    approval_PermissionConfig: {
      dailyApplyCountLimit: 100,
      dailyApplyAmountLimit: 500_000,
      singleRechargeAmountLimit: 100_000,
      dailyBatchApplyCountLimit: 10,
      dailyBatchApplyAmountLimit: 200_000,
      singleBatchRechargeAmountLimit: 50_000,
      auditMinAmount: 0,
      auditMaxAmount: 0,
    },
  };
}

export interface UseApprovalConfigFormOptions {
  /** 初始回显数据：undefined = 新增；有值 = 编辑 / 复制，内部不区分 */
  initial: Ref<SysUsersDetailApprovalApiConfigRsp | undefined>;
  /** 可选的权威 enabled 覆盖（编辑场景从 userInfo 派生） */
  initialEnabled: Ref<boolean | undefined>;
  /** 当前归属商户范围 */
  tenantOptions: Ref<PermCardTenantOption[]>;
  /** 外部持有的 enabled model（v-model:enabled 指向） */
  enabled: Ref<boolean>;
  /** 外部持有的 output model（v-model 指向） */
  output: Ref<ApprovalOutput | null>;
}

export function useApprovalConfigForm(options: UseApprovalConfigFormOptions) {
  const { initial, initialEnabled, tenantOptions, enabled, output } = options;
  const { t } = useI18n();

  // ─── state ─────────────────────────────
  const form = reactive<ApprovalFormState>(createEmptyForm());

  // 一级 / 二级操作权限走 common 字典（§1.1 ApprovalRoleAuthorizeList / ApprovalSubRoleAuthorizeList）。
  // 字典为全集，IdNameRsp.id 与表单 number[] 同构，无需再调 getApprovalAuthorizeEnumList 级联接口。
  const dict = useDictionary({ source: 'common' });
  const roleAuthorizeOptions = computed(() =>
    dict.getOptions('approvalRoleAuthorizeList'),
  );
  const subRoleAuthorizeOptions = computed(() =>
    dict.getOptions('approvalSubRoleAuthorizeList'),
  );

  /** 快照：initial 存在时拍一张；切角色后再切回用来恢复 */
  const snapshot = ref<ApprovalSnapshot | null>(null);

  // ─── 派生 ────────────────────────────────
  const isOperator = computed(() => form.approval_UserRole === 1);

  // ─── 规则 ────────────────────────────────
  const requiredNumber = (msg: string) => ({
    required: true,
    type: 'number' as const,
    trigger: 'blur',
    validator: (_: unknown, val: null | number | undefined) => {
      if (!isOperator.value) return true;
      if (val === null || val === undefined || val < 0) return new Error(msg);
      return true;
    },
  });

  const rules: FormRules = {
    approval_TenantIds: {
      required: true,
      type: 'array' as const,
      message: t('system.sysUser.approval.selectTenant'),
      trigger: 'change',
    },
    approval_RoleAuthorize: {
      required: true,
      type: 'array' as const,
      message: t('system.sysUser.approval.operationContent'),
      trigger: 'change',
    },
    'approval_PermissionConfig.dailyApplyCountLimit': requiredNumber(
      t('system.sysUser.approval.dailyCountLimit'),
    ),
    'approval_PermissionConfig.dailyApplyAmountLimit': requiredNumber(
      t('system.sysUser.approval.dailyAmountLimit'),
    ),
    'approval_PermissionConfig.singleRechargeAmountLimit': requiredNumber(
      t('system.sysUser.approval.singleAmountLimit'),
    ),
    'approval_PermissionConfig.dailyBatchApplyCountLimit': requiredNumber(
      t('system.sysUser.approval.batchDailyCountLimit'),
    ),
    'approval_PermissionConfig.dailyBatchApplyAmountLimit': requiredNumber(
      t('system.sysUser.approval.batchDailyAmountLimit'),
    ),
    'approval_PermissionConfig.singleBatchRechargeAmountLimit': requiredNumber(
      t('system.sysUser.approval.batchSingleAmountLimit'),
    ),
    'approval_PermissionConfig.auditMinAmount': {
      trigger: 'blur',
      validator: () => {
        if (isOperator.value) return true;
        const cfg = form.approval_PermissionConfig;
        if (
          cfg.auditMinAmount !== null &&
          cfg.auditMinAmount !== undefined &&
          cfg.auditMaxAmount !== null &&
          cfg.auditMaxAmount !== undefined &&
          cfg.auditMinAmount > cfg.auditMaxAmount
        ) {
          return new Error(t('common.minMaxError'));
        }
        return true;
      },
    },
    'approval_PermissionConfig.auditMaxAmount': {
      trigger: 'blur',
      validator: () => {
        if (isOperator.value) return true;
        const cfg = form.approval_PermissionConfig;
        if (
          cfg.auditMinAmount !== null &&
          cfg.auditMinAmount !== undefined &&
          cfg.auditMaxAmount !== null &&
          cfg.auditMaxAmount !== undefined &&
          cfg.auditMinAmount > cfg.auditMaxAmount
        ) {
          return new Error(t('common.minMaxError'));
        }
        return true;
      },
    },
  };

  // ─── 快照辅助 ───────────────────────────
  function takeSnapshot(): ApprovalSnapshot {
    return {
      enabled: enabled.value,
      userRole: form.approval_UserRole,
      roleAuthorize: [...form.approval_RoleAuthorize],
      subRoleAuthorize: [...form.approval_SubRoleAuthorize],
      tenantIds: [...form.approval_TenantIds],
      isRequireApproval: form.approval_IsRequireApproval,
      permissionConfig: { ...form.approval_PermissionConfig },
    };
  }

  // ─── 核心动作 ───────────────────────────
  function resetForm() {
    enabled.value = false;
    Object.assign(form, createEmptyForm());
    snapshot.value = null;
  }

  function initFromInitial(data: SysUsersDetailApprovalApiConfigRsp) {
    resetForm();

    form.approval_TenantIds = (data.approval_TenantIds || '')
      .split(',')
      .filter(Boolean)
      .map(Number);
    form.approval_UserRole = data.approval_UserRole || 1;
    form.approval_RoleAuthorize = Array.isArray(data.approval_RoleAuthorize)
      ? [...data.approval_RoleAuthorize]
      : [];
    form.approval_SubRoleAuthorize = Array.isArray(
      data.approval_SubRoleAuthorize,
    )
      ? [...data.approval_SubRoleAuthorize]
      : [];
    form.approval_IsRequireApproval = data.approval_IsRequireApproval ?? '0';

    if (data.approval_PermissionConfig) {
      Object.assign(
        form.approval_PermissionConfig,
        data.approval_PermissionConfig,
      );
    }

    enabled.value = resolveInitialEnabled(data, initialEnabled.value);

    // 拍快照（复制 / 编辑共用），用于 handleRoleChange 回显
    snapshot.value = takeSnapshot();
  }

  function handleRoleChange() {
    form.approval_RoleAuthorize = [];
    form.approval_SubRoleAuthorize = [];
    // 切回快照记录的角色时恢复二级勾选
    if (snapshot.value && form.approval_UserRole === snapshot.value.userRole) {
      form.approval_RoleAuthorize = [...snapshot.value.roleAuthorize];
      form.approval_SubRoleAuthorize = [...snapshot.value.subRoleAuthorize];
    }
  }

  function handleRoleAuthorizeChange() {
    form.approval_SubRoleAuthorize = [];
  }

  // ─── 数据流绑定 ─────────────────────────

  // 输入变化 → 写 output model（父组件 v-model 订阅）
  // 关闭只切 approval_UserState=0，form 本身保持原样：
  //   - 新增：form = createEmptyForm()，输出天然是空字段
  //   - 编辑：form 由 detail 填充，输出 = 当前数据 + state=0
  //   - 批量赋权（复制源）：form 由源用户填充，输出 = 源数据 + state=0
  // 三场景共用同一份"当前数据快照"语义，不再因关闭而强制 reset。
  watch(
    [enabled, form],
    () => {
      output.value = toApprovalPayload(form, enabled.value);
    },
    { deep: true, immediate: true },
  );

  // initial / initialEnabled 变化 → 重置 + 回显（或新增时清空 + 加载默认字典）
  watch(
    [initial, initialEnabled] as const,
    ([data]) => {
      if (data) {
        initFromInitial(data);
      } else {
        resetForm();
      }
    },
    { immediate: true },
  );

  // 归属商户收窄 → 裁掉失效的 tenant id
  watch(tenantOptions, (opts) => {
    const next = pruneTenantIds(form.approval_TenantIds, opts);
    if (next !== form.approval_TenantIds) {
      form.approval_TenantIds = next;
    }
  });

  // ─── 返回 ────────────────────────────────
  return {
    // state
    form,
    roleAuthorizeOptions,
    subRoleAuthorizeOptions,

    // derived
    isOperator,

    // rules
    rules,

    // actions
    handleRoleChange,
    handleRoleAuthorizeChange,
  };
}
