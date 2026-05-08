import type { FormRules } from 'naive-ui';

import type { Ref } from 'vue';

import type {
  PermCardTenantOption,
  WithdrawOutput,
  WithdrawSnapshot,
} from './permCardTypes';

import type {
  BatchAddSysUsersWithdrawApprovalConfigReq,
  SysUsersDetailWithdrawConfigRsp,
} from '#/api/system';
import type { FiatCurrencyTenantItemRsp } from '#/api/tenant';

import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { api } from '#/api';
import { useDictionary } from '#/components/dict-select';

import {
  pruneTenantIds,
  resolveInitialEnabled,
  toWithdrawPayload,
} from './permCardHelpers';

/** 出款权限卡内部表单结构（TenantIds 对齐 option.value 使用 number[]，避免 n-select 选中状态匹配不上） */
export interface WithdrawFormState {
  withdraw_ConfigGroupId: number | undefined;
   
  withdraw_UserRank: any;
  withdraw_ParentSysUserIds: string;
  withdraw_ApprovalConfig: BatchAddSysUsersWithdrawApprovalConfigReq;
  withdraw_SysCurrency: string | undefined;
  withdraw_TenantIds: number[];
}

function createEmptyForm(): WithdrawFormState {
  return {
    withdraw_ConfigGroupId: undefined,
    withdraw_UserRank: null,
    withdraw_ParentSysUserIds: '',
    withdraw_ApprovalConfig: {
      auditMinAmount: 500,
      auditMaxAmount: 100_000_000,
      currentProcessingOrderLimit: 5,
    },
    withdraw_SysCurrency: undefined,
    withdraw_TenantIds: [],
  };
}

export interface UseWithdrawConfigFormOptions {
  /** 初始回显数据：undefined = 新增；有值 = 编辑 / 复制，内部不区分 */
  initial: Ref<SysUsersDetailWithdrawConfigRsp | undefined>;
  /** 可选的权威 enabled 覆盖（编辑场景从 userInfo 派生） */
  initialEnabled: Ref<boolean | undefined>;
  /** 当前归属商户范围 */
  tenantOptions: Ref<PermCardTenantOption[]>;
  /** 外部持有的 enabled model（v-model:enabled 指向） */
  enabled: Ref<boolean>;
  /** 外部持有的 output model（v-model 指向） */
  output: Ref<null | WithdrawOutput>;
  /** 当前编辑的用户 ID：编辑场景传 userId 让 getSuperiorList 排除自己；新增 / 批量默认 0 */
  editingUserId: Ref<number>;
}

// 订单金额区间边界
const ORDER_AMOUNT_MIN = 1;
const ORDER_AMOUNT_MAX = 500_000_000;
// 处理上限边界（0 表示不限制）
const PROCESSING_LIMIT_MIN = 0;
const PROCESSING_LIMIT_MAX = 10_000;
const USDT_CURRENCY_CODE = 'USDT';

export function useWithdrawConfigForm(options: UseWithdrawConfigFormOptions) {
  const {
    initial,
    initialEnabled,
    tenantOptions,
    enabled,
    output,
    editingUserId,
  } = options;
  const { t } = useI18n();
  const router = useRouter();

  // ─── state ─────────────────────────────
  const form = reactive<WithdrawFormState>(createEmptyForm());
  const selectedSuperiorIds = ref<string[]>([]);
  const currencyType = ref<'Fiat' | 'USDT'>('Fiat');
  const currencyTypeOptions = [
    { label: t('system.sysUser.withdraw.fiat'), value: 'Fiat' as const },
    { label: 'USDT', value: 'USDT' as const },
  ];

  const currencyTenantList = ref<FiatCurrencyTenantItemRsp[]>([]);
  const currencyLoading = ref(false);
  const superiorOptions = ref<Array<{ label: string; value: string }>>([]);
  const superiorLoading = ref(false);

  /** 快照：initial 存在时拍一张，resetForm 时清；切职位 / 切币种回到原值能恢复 */
  const snapshot = ref<null | WithdrawSnapshot>(null);

  // ─── 派生 ────────────────────────────────
  const isMemberOrLeader = computed(() =>
    ['Leader', 'Staff'].includes(form.withdraw_UserRank || ''),
  );
  const isSupervisorOrManager = computed(() =>
    ['Admin', 'Manager'].includes(form.withdraw_UserRank || ''),
  );

  // 币种名称从 common 字典 currencyList 反查；接口 FiatCurrencyTenantItemRsp 仅返回 currencyCode/tenantList。
  const currencyDict = useDictionary({ source: 'common' });
  const currencyOptions = computed(() =>
    currencyTenantList.value.map((item) => ({
      label:
        currencyDict.findLabel('currencyList', item.currencyCode) ||
        item.currencyCode,
      value: item.currencyCode,
    })),
  );

  const currencyTenantOptions = computed(() => {
    if (!form.withdraw_SysCurrency) return [];
    const matched = currencyTenantList.value.find(
      (item) => item.currencyCode === form.withdraw_SysCurrency,
    );
    if (!matched?.tenantList?.length) return [];
    const allowed = new Set(
      tenantOptions.value.map((opt) => Number(opt.value)),
    );
    return matched.tenantList
      .filter((t) => allowed.has(t.id))
      .map((t) => ({ label: t.name, value: t.id }));
  });

  // ─── 规则 ────────────────────────────────
  const rules: FormRules = {
    withdraw_UserRank: {
      required: true,
      message: t('system.sysUser.withdraw.selectRank'),
      trigger: 'change',
    },
    withdraw_ConfigGroupId: {
      required: true,
      message: t('system.sysUser.withdraw.selectGroup'),
      trigger: 'change',
      type: 'number' as const,
    },
    withdraw_TenantIds: {
      required: true,
      message: t('system.sysUser.withdraw.selectTenant'),
      trigger: 'change',
      type: 'array' as const,
    },
    withdraw_ParentSysUserIds: {
      required: true,
      trigger: 'change',
      // 上级提示文案随职位切换：组员选组长、组长选主管；职位不在 Staff/Leader 时不参与校验
      validator: (_: unknown, val: string) => {
        const rank = form.withdraw_UserRank;
        if (rank !== 'Staff' && rank !== 'Leader') return true;
        if (val) return true;
        return new Error(
          rank === 'Staff'
            ? t('system.sysUser.withdraw.selectLeader')
            : t('system.sysUser.withdraw.selectSupervisor'),
        );
      },
    },
    withdraw_SysCurrency: {
      required: true,
      message: t('system.sysUser.withdraw.selectFiatCurrency'),
      trigger: 'change',
    },
    'withdraw_ApprovalConfig.auditMinAmount': {
      trigger: 'blur',
      validator: () => {
        const cfg = form.withdraw_ApprovalConfig;
        if (!isMemberOrLeader.value || !cfg) return true;
        if (
          cfg.auditMinAmount === null || cfg.auditMinAmount === undefined ||
          cfg.auditMinAmount < ORDER_AMOUNT_MIN ||
          cfg.auditMinAmount > ORDER_AMOUNT_MAX
        ) {
          return new Error(
            t('system.sysUser.withdraw.validator.amountMinRangeError', {
              min: ORDER_AMOUNT_MIN,
              max: ORDER_AMOUNT_MAX,
            }),
          );
        }
        if (
          cfg.auditMaxAmount !== null && cfg.auditMaxAmount !== undefined &&
          cfg.auditMinAmount > cfg.auditMaxAmount
        ) {
          return new Error(t('common.minMaxError'));
        }
        return true;
      },
    },
    'withdraw_ApprovalConfig.auditMaxAmount': {
      trigger: 'blur',
      validator: () => {
        const cfg = form.withdraw_ApprovalConfig;
        if (!isMemberOrLeader.value || !cfg) return true;
        if (
          cfg.auditMaxAmount === null || cfg.auditMaxAmount === undefined ||
          cfg.auditMaxAmount < ORDER_AMOUNT_MIN ||
          cfg.auditMaxAmount > ORDER_AMOUNT_MAX
        ) {
          return new Error(
            t('system.sysUser.withdraw.validator.amountMaxRangeError', {
              min: ORDER_AMOUNT_MIN,
              max: ORDER_AMOUNT_MAX,
            }),
          );
        }
        if (
          cfg.auditMinAmount !== null && cfg.auditMinAmount !== undefined &&
          cfg.auditMinAmount > cfg.auditMaxAmount
        ) {
          return new Error(t('common.minMaxError'));
        }
        return true;
      },
    },
    'withdraw_ApprovalConfig.currentProcessingOrderLimit': {
      trigger: 'blur',
      validator: () => {
        const cfg = form.withdraw_ApprovalConfig;
        if (!isMemberOrLeader.value || !cfg) return true;
        if (
          cfg.currentProcessingOrderLimit === null || cfg.currentProcessingOrderLimit === undefined ||
          cfg.currentProcessingOrderLimit < PROCESSING_LIMIT_MIN ||
          cfg.currentProcessingOrderLimit > PROCESSING_LIMIT_MAX
        ) {
          return new Error(
            t('system.sysUser.withdraw.validator.processingLimitRangeError', {
              min: PROCESSING_LIMIT_MIN,
              max: PROCESSING_LIMIT_MAX,
            }),
          );
        }
        return true;
      },
    },
  };

  let currencyRequestSeq = 0;
  async function loadCurrencyTenantList(type?: 'Fiat' | 'USDT') {
    const effectiveType = type || currencyType.value;
    const seq = ++currencyRequestSeq;
    currencyLoading.value = true;
    try {
       
      const { data } = await api.tenant.getFiatCurrencyList({
        currencyType: effectiveType as any,
      });
      if (seq !== currencyRequestSeq) return;
      if (data?.currencyTenantList) {
        currencyTenantList.value = data.currencyTenantList;
      }
    } catch (error) {
      console.error('loadCurrencyTenantList error', error);
    } finally {
      if (seq === currencyRequestSeq) {
        currencyLoading.value = false;
      }
    }

    if (seq !== currencyRequestSeq) return;

    // USDT 模式：自动对齐 form.withdraw_SysCurrency 到首项币种编码
    if (effectiveType === 'USDT') {
      const first = currencyTenantList.value[0];
      const nextCode = first?.currencyCode || '';
      const hasMatch = currencyTenantList.value.some(
        (item) => item.currencyCode === form.withdraw_SysCurrency,
      );
      if (!hasMatch && nextCode) {
        form.withdraw_SysCurrency = nextCode;
      }
    }
  }

  async function loadSuperiorList(rank: string) {
    superiorLoading.value = true;
    superiorOptions.value = [];
    try {
      // 编辑模式传当前用户 ID 让后端排除自己；新增 / 批量场景默认 0
      const { data } = await api.system.getSuperiorList({
        withdraw_UserRank: rank,
        userId: editingUserId.value || 0,
      });
      if (Array.isArray(data)) {
        superiorOptions.value = data.map((item) => ({
          label: item.userName,
          value: String(item.userId),
        }));
      }
    } catch (error) {
      console.error('loadSuperiorList error', error);
    } finally {
      superiorLoading.value = false;
    }
  }

  // ─── 快照辅助 ───────────────────────────
  function takeSnapshot(): WithdrawSnapshot {
    return {
      enabled: enabled.value,
      userRank: form.withdraw_UserRank || '',
      configGroupId: form.withdraw_ConfigGroupId,
      superiorIds: [...selectedSuperiorIds.value],
      currencyType: currencyType.value,
      sysCurrency: form.withdraw_SysCurrency,
      tenantIds: [...form.withdraw_TenantIds],
    };
  }

  // ─── 核心动作 ───────────────────────────
  function resetForm() {
    enabled.value = false;
    Object.assign(form, createEmptyForm());
    selectedSuperiorIds.value = [];
    currencyType.value = 'Fiat';
    snapshot.value = null;
    currencyTenantList.value = [];
    superiorOptions.value = [];
  }

  function initFromInitial(data: SysUsersDetailWithdrawConfigRsp) {
    resetForm();

    form.withdraw_ConfigGroupId = data.withdraw_ConfigGroupId
      ? Number(data.withdraw_ConfigGroupId)
      : undefined;
    form.withdraw_UserRank = data.withdraw_UserRank ?? '';
    form.withdraw_ParentSysUserIds = data.withdraw_ParentSysUserIds ?? '';
    form.withdraw_SysCurrency = data.withdraw_SysCurrency || undefined;
    form.withdraw_TenantIds = (data.withdraw_TenantIds || '')
      .split(',')
      .filter(Boolean)
      .map(Number);
    selectedSuperiorIds.value = (data.withdraw_ParentSysUserIds || '')
      .split(',')
      .filter(Boolean);

    const savedType: 'Fiat' | 'USDT' =
      data.withdraw_SysCurrency === USDT_CURRENCY_CODE ? 'USDT' : 'Fiat';
    currencyType.value = savedType;

    if (data.withdraw_ApprovalConfig) {
      const src = data.withdraw_ApprovalConfig;
      const target = form.withdraw_ApprovalConfig;
      target.auditMinAmount = src.auditMinAmount ?? target.auditMinAmount;
      target.auditMaxAmount = src.auditMaxAmount ?? target.auditMaxAmount;
      target.currentProcessingOrderLimit =
        src.currentProcessingOrderLimit ?? target.currentProcessingOrderLimit;
    }

    enabled.value = resolveInitialEnabled(data, initialEnabled.value);

    // 拍快照（复制 / 编辑共用），用于 handleRankChange / handleCurrencyTypeChange 回显
    snapshot.value = takeSnapshot();

    void loadCurrencyTenantList();
    if (
      data.withdraw_UserRank &&
      ['Leader', 'Staff'].includes(data.withdraw_UserRank)
    ) {
      void loadSuperiorList(data.withdraw_UserRank);
    }
  }

  function handleCurrencyTypeChange(val: 'Fiat' | 'USDT') {
    // 任何切换都先清当前币种 + 商户；切到法币额外清 options，避免残留 USDT 选项。
    form.withdraw_SysCurrency = undefined;
    form.withdraw_TenantIds = [];
    if (val === 'Fiat') {
      currencyTenantList.value = [];
    }
    // 回显：切到快照记录的类型时用 snapshot 恢复（不再门禁 mode='edit'，复制也能享受）
    if (snapshot.value && val === snapshot.value.currencyType) {
      form.withdraw_SysCurrency = snapshot.value.sysCurrency;
      form.withdraw_TenantIds = [...snapshot.value.tenantIds];
    }
    void loadCurrencyTenantList(val);
  }

  function handleCurrencyChange() {
    form.withdraw_TenantIds = [];
  }

  function handleConfigGroupChange(
    _value: unknown,
    option:
      | Array<{ currentProcessingOrderLimit?: unknown }>
      | null
      | { currentProcessingOrderLimit?: unknown },
  ) {
    const selected = Array.isArray(option) ? option[0] : option;
    const limit = Number(selected?.currentProcessingOrderLimit);
    if (!Number.isFinite(limit)) return;
    form.withdraw_ApprovalConfig.currentProcessingOrderLimit = limit;
  }

  function toggleSuperior(id: string) {
    const idx = selectedSuperiorIds.value.indexOf(id);
    if (idx === -1) {
      selectedSuperiorIds.value.push(id);
    } else {
      selectedSuperiorIds.value.splice(idx, 1);
    }
  }

  function handleRankChange(rank: null | number | string) {
    selectedSuperiorIds.value = [];
    form.withdraw_ParentSysUserIds = '';
    const rankStr = String(rank || '');
    if (['Leader', 'Staff'].includes(rankStr)) {
      void loadSuperiorList(rankStr);
      // 切回快照记录的初始职位时恢复上级选择
      if (snapshot.value && rankStr === snapshot.value.userRank) {
        selectedSuperiorIds.value = [...snapshot.value.superiorIds];
      }
      // 从 Manager/Admin 切回 Staff/Leader 时，Manager/Admin 固定写入 USDT。
      // 若当前仍是 Fiat 模式，必须清掉这个 USDT 占位，避免法币下拉出现不属于当前 options 的值。
      if (
        currencyType.value === 'Fiat' &&
        form.withdraw_SysCurrency === USDT_CURRENCY_CODE
      ) {
        form.withdraw_SysCurrency = undefined;
        form.withdraw_TenantIds = [];
      }
    } else {
      form.withdraw_SysCurrency = USDT_CURRENCY_CODE;
    }
  }

  function goDispatchConfig() {
    router.push({ path: '/finance/withdrawOrder', query: { tab: 'dispatch' } });
  }

  // ─── 数据流绑定 ─────────────────────────

  // selectedSuperiorIds → form.withdraw_ParentSysUserIds（逗号分隔）
  watch(
    selectedSuperiorIds,
    (val) => {
      form.withdraw_ParentSysUserIds = val.join(',');
    },
    { deep: true },
  );

  // 输入变化 → 写 output model（父组件 v-model 订阅）
  // 关闭只切 withdraw_EnableState=0，form 本身保持原样：
  //   - 新增：form = createEmptyForm()，输出天然是空字段
  //   - 编辑：form 由 detail 填充，输出 = 当前数据 + state=0
  //   - 批量赋权（复制源）：form 由源用户填充，输出 = 源数据 + state=0
  // 三场景共用同一份"当前数据快照"语义，不再因关闭而强制 reset。
  watch(
    [enabled, form],
    () => {
      output.value = toWithdrawPayload(form, enabled.value);
    },
    { deep: true, immediate: true },
  );

  // initial / initialEnabled 变化 → 重置 + 回显（或新增时清空 + 预加载法币列表）
  watch(
    [initial, initialEnabled] as const,
    ([data]) => {
      if (data) {
        initFromInitial(data);
      } else {
        resetForm();
        // 新增场景：默认 currencyType='Fiat'，但 Fiat 是默认选中状态没有 update 事件触发，
        // 这里主动预加载一次法币列表；否则用户先选 Staff/Leader 时下拉为空
        void loadCurrencyTenantList('Fiat');
      }
    },
    { immediate: true },
  );

  // 归属商户收窄 → 裁掉失效的 tenant id
  watch(tenantOptions, (options) => {
    const next = pruneTenantIds(form.withdraw_TenantIds, options);
    if (next !== form.withdraw_TenantIds) {
      form.withdraw_TenantIds = next;
    }
  });

  // ─── 返回 ────────────────────────────────
  return {
    // state
    form,
    selectedSuperiorIds,
    currencyType,
    currencyTypeOptions,
    superiorOptions,
    superiorLoading,
    currencyLoading,

    // derived
    isMemberOrLeader,
    isSupervisorOrManager,
    currencyOptions,
    currencyTenantOptions,

    // rules
    rules,

    // actions
    handleConfigGroupChange,
    handleRankChange,
    handleCurrencyTypeChange,
    handleCurrencyChange,
    toggleSuperior,
    goDispatchConfig,
    loadCurrencyTenantList,

    // constants 暴露给模板（UI 限制用）
    ORDER_AMOUNT_MIN,
    ORDER_AMOUNT_MAX,
    PROCESSING_LIMIT_MIN,
    PROCESSING_LIMIT_MAX,
  };
}
