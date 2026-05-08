/**
 * useDictionary.ts — 字典选项 composable
 *
 * 对外只暴露两个函数：
 *   useDictOptions(key)          → ComputedRef<DictOption[]>  下拉选项列表
 *   useLabelMap(key)             → ComputedRef<Map<value, label>>  用于表格列渲染
 *
 * 内部统一走 TanStack Query 缓存：
 *   static（common / v1 / group / platform）：staleTime=Infinity，登录时 prefetch 预热
 *   dynamic：staleTime=5min，首次 useDictOptions 调用时触发，全量一次请求
 *
 * 歧义 key（同名 key 出现在多个 source）必须显式传 source 参数，否则 TypeScript 报错。
 * 当前歧义 key 见 registry.ts → AMBIGUOUS_SOURCES。
 *
 * @example
 *   // 非歧义 key — 自动推断 source
 *   const statusOptions = useDictOptions('enableStateList')
 *   const tenantOptions = useDictOptions('tenantList')          // dynamic，首次调用时拉取
 *
 *   // 歧义 key — 必须指定 source
 *   const countryOpts = useDictOptions('countryList', 'platform')
 *
 *   // 表格列渲染
 *   const statusMap = useLabelMap('enableStateList')
 *   // 模板中：{{ statusMap.get(row.status) }}
 */
import type { ComputedRef } from 'vue';

import type { AmbiguousKey, DictSource } from './registry';

import { computed } from 'vue';

import { useQuery } from '@tanstack/vue-query';

import { api } from '#/api';
import { DICT_QUERY_KEY, STATIC_DICT_QUERY_FN } from '#/store/dict';

import { KEY_SOURCE } from './registry';

export type { AmbiguousKey, DictSource };

/** 标准化后的字典选项，附带原始字段（通过 `...item` spread 保留），方便级联等场景访问额外字段 */
export interface DictOption {
  label: string;
  value: number | string;
  [key: string]: unknown;
}

/** KEY_SOURCE 中所有非歧义 key（歧义 key 调用时必须显式传 source，编译期强制） */
type UnambiguousKey = Exclude<keyof typeof KEY_SOURCE, AmbiguousKey>;

// ─── 字段解析策略（两段式） ────────────────────────────────────────────────────
//
// 同一 source 内不同 key 的字段名不统一（如 common 里大部分是 {id,name}，
// 但 rechargeStateList / withdrawWorkStateList 等 17 个 key 是 {code,name}）。
// 采用"先试 primary → 缺失时走 candidates fallback"，与老项目 useDictionary.ts 逻辑一致。
//
// 示例（common source）：
//   {id:1, name:"启用"}  → primary 'id' 命中，label='name' 命中 ✓
//   {code:"1",name:"操作"} → primary 'id' 缺失 → candidates 找到 'code' ✓

/** 每个 source 优先尝试的 label 字段；platform/dynamic 字段名过于多样，不设 primary */
const SOURCE_LABEL_PRIMARY: Record<DictSource, string | undefined> = {
  common: 'name',
  v1: 'name',
  group: 'dictName',
  platform: undefined, // countryName / languageName / currencyName 各不同，直接走 candidates
  dynamic: undefined, // 各 key 字段名差异极大，走 DYNAMIC_FIELDS 显式映射
};

/** 每个 source 优先尝试的 value 字段；common/v1 用 'id'，candidates 兜底 'code' 类 key */
const SOURCE_VALUE_PRIMARY: Record<DictSource, string | undefined> = {
  common: 'id',
  v1: 'id', // v1 中 {code,name} 占多数，但 primary 设 'id' 让 candidates 兜底，与老项目一致
  group: 'dictCode',
  platform: undefined,
  dynamic: undefined,
};

/** primary 缺失时按序尝试的 label 候选字段 */
const SOURCE_LABEL_CANDIDATES: Record<DictSource, string[]> = {
  common: ['name', 'label', 'dictName', 'value'],
  v1: ['name', 'label', 'value'],
  group: ['dictName', 'name'],
  // platform 三个 key：countryList / currencyList / languageList，字段名各含业务前缀
  platform: ['countryName', 'languageName', 'currencyName', 'name', 'label'],
  dynamic: ['name', 'label'],
};

/** primary 缺失时按序尝试的 value 候选字段 */
const SOURCE_VALUE_CANDIDATES: Record<DictSource, string[]> = {
  common: ['id', 'code', 'key', 'value', 'dictCode'],
  v1: ['id', 'code', 'key', 'value'],
  group: ['dictCode', 'code', 'id'],
  platform: ['countryCode', 'languageCode', 'currencyCode', 'code', 'id'],
  dynamic: ['id', 'code'],
};

// ─── Dynamic dict 字段映射 ────────────────────────────────────────────────────
//
// dynamic dict 每个 key 的字段名完全由后端 DTO 决定，无规律可循（有 orgId/orgName、
// tenantId/tenantName、sysChannelId/sysChannelName 等各种前缀），必须显式维护。
//
// 字段名以后端实际响应为准——gen-api 生成的 types 不可靠，以 tools/dict-snapshot.json
// 中的 samples 字段为准（脚本登录 SIT 拉真实数据）。
//
// 新增 dynamic key 时：
//   1. 在 ALL_DYNAMIC_KEYS 追加 key
//   2. 在此补充 label/value 字段映射
//   3. 重跑 pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts 更新 registry.ts

const DYNAMIC_FIELDS: Record<string, { label: string; value: string }> = {
  /** 提现大类（商户级别），用于提现通道配置页和提现工单筛选 */
  withdrawCategoryList: { label: 'name', value: 'id' },
  /** 集团（组织架构），平台侧商户分组，orgId 是关联外键 */
  organizationList: { label: 'orgName', value: 'orgId' },
  /** 商户列表，平台侧商户选择器，tenantId 是关联外键 */
  tenantList: { label: 'tenantName', value: 'tenantId' },
  /** 系统结算币种（如 USDT / BRL），label 和 value 均为币种代码字符串 */
  sysCurrencyList: { label: 'sysCurrency', value: 'sysCurrency' },
  /** 三方支付映射码（payCode），label 和 value 均为 payCode 字符串 */
  payCodeList: { label: 'payCode', value: 'payCode' },
  /** 三方商户（支付服务商账户），展示 customName（昵称），提交 merchantId */
  thirdPayMerchantList: { label: 'customName', value: 'merchantId' },
  /** 商户支付通道，含 tenantCategoryId 字段可做充值/提现大类联动筛选 */
  tenantPayChannelList: { label: 'customName', value: 'tenantChannelId' },
  /** 系统支付通道（平台级），inOutType 字段区分入金（Recharge）/ 出金（Withdraw）方向 */
  sysPayChannelList: { label: 'sysChannelName', value: 'sysChannelId' },
  /** 充值大类（商户级别），用于充值通道配置页和充值工单筛选 */
  rechargeCategoryList: { label: 'name', value: 'id' },
  /** 系统角色列表，用于员工账号角色分配 */
  roleList: { label: 'roleName', value: 'roleId' },
  /** 系统菜单列表，用于角色权限配置的菜单多选 */
  menuList: { label: 'menuName', value: 'menuId' },
  /** 提现派单配置分组，用于提现规则分组管理 */
  withdrawConfigGroupList: { label: 'groupName', value: 'configGroupId' },
};

// ─── Dynamic dict 请求 key 列表 ───────────────────────────────────────────────
//
// ⚠️ 类型陷阱：gen-api 把 DynamicDictionaryKeyEnum 错误生成为中文字面量
//    （"提现大类列表" / "集团下拉框数据" ...），但后端实际接收英文 camelCase。
//    中文 keys 会被后端拒绝，返回 {code:7, msg:"Param is Invalid"}。
//    此处用 `as any` 绕过错误的 TS 类型契约，保持英文 camelCase。
//
// 后端响应的 items key 可能是 camelCase 或 PascalCase（环境差异），
// queryFn 内统一转 camelCase，消费方始终用 camelCase。

const ALL_DYNAMIC_KEYS = [
  'withdrawCategoryList', // 提现大类
  'organizationList', // 集团（组织）
  'tenantList', // 商户
  'sysCurrencyList', // 系统结算币种
  'payCodeList', // 三方支付映射码
  'thirdPayMerchantList', // 三方商户
  'tenantPayChannelList', // 商户支付通道
  'sysPayChannelList', // 系统支付通道
  'rechargeCategoryList', // 充值大类
  'roleList', // 系统角色
  'menuList', // 系统菜单
  'withdrawConfigGroupList', // 提现派单配置分组
] as const;

// ─── 字段解析工具函数 ──────────────────────────────────────────────────────────

/** 按顺序尝试 candidates 列表，返回第一个非空值；全部缺失返回 undefined */
function pickField(
  item: Record<string, unknown>,
  candidates: string[],
): unknown {
  for (const f of candidates) {
    const v = item[f];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}

/** 先试 primary 字段，缺失/空值时 fallback 到 candidates 列表 */
function resolveField(
  item: Record<string, unknown>,
  primary: string | undefined,
  candidates: string[],
): unknown {
  if (primary) {
    const v = item[primary];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return pickField(item, candidates);
}

/**
 * 把后端原始 item 列表转换为标准 DictOption[]。
 * 原始字段通过 `{ ...item, label, value }` 完整保留，
 * 级联场景（如 manualRechargeTypeList 的 `list` 子项）可直接访问 `option.list`。
 */
function toOptions(
  source: DictSource,
  key: string,
  list: unknown[],
): DictOption[] {
  if (list.length === 0) return [];

  return list.map((raw) => {
    const item = raw as Record<string, unknown>;
    let label: string;
    let value: number | string;

    if (source === 'dynamic') {
      // dynamic 字段名无规律，走 DYNAMIC_FIELDS 显式映射；未登记的 key 用通用 candidates 兜底
      const fields = DYNAMIC_FIELDS[key];
      label = fields
        ? String(item[fields.label] ?? '')
        : String(pickField(item, SOURCE_LABEL_CANDIDATES.dynamic) ?? '');
      value = fields
        ? (item[fields.value] as number | string)
        : (pickField(item, SOURCE_VALUE_CANDIDATES.dynamic) as number | string);
    } else {
      // static source：先试 primary，缺失走 candidates
      label = String(
        resolveField(
          item,
          SOURCE_LABEL_PRIMARY[source],
          SOURCE_LABEL_CANDIDATES[source],
        ) ?? '',
      );
      value = resolveField(
        item,
        SOURCE_VALUE_PRIMARY[source],
        SOURCE_VALUE_CANDIDATES[source],
      ) as number | string;
    }

    return { ...item, label, value };
  });
}

// ─── 对外 API ─────────────────────────────────────────────────────────────────

/**
 * 获取字典下拉选项列表（响应式）。
 *
 * 底层走 TanStack Query：
 *   - static key（common/v1/group/platform）：登录时 prefetch 预热，组件内直接命中缓存，不重复请求
 *   - dynamic key：首次调用时一次性拉取所有 dynamic key（ALL_DYNAMIC_KEYS），5min 内复用缓存
 *
 * 歧义 key（countryList / currencyList / financialTypeList）必须传第二个参数 source，
 * 否则 TypeScript 编译报错。
 *
 * @example
 *   // 非歧义 key
 *   const statusOptions = useDictOptions('enableStateList')       // common，自动推断
 *   const tenantOptions = useDictOptions('tenantList')            // dynamic，自动推断
 *
 *   // 歧义 key，必须指定 source
 *   const countryOpts = useDictOptions('countryList', 'platform')
 */
export function useDictOptions(key: UnambiguousKey): ComputedRef<DictOption[]>;
export function useDictOptions(
  key: AmbiguousKey,
  source: DictSource,
): ComputedRef<DictOption[]>;
export function useDictOptions(
  key: string,
  source?: DictSource,
): ComputedRef<DictOption[]> {
  const resolvedSource = (source ?? KEY_SOURCE[key]) as DictSource;

  if (resolvedSource === 'dynamic') {
    const { data } = useQuery({
      queryKey: DICT_QUERY_KEY.dynamic,
      queryFn: async () => {
        const res = await api.common.getDynamicDictionary({
          keys: ALL_DYNAMIC_KEYS as any, // 绕过 gen-api 错误类型（中文字面量），实际传英文 camelCase
        });
        // 后端某些环境返回 PascalCase key（如 OrganizationList），统一转 camelCase
        const raw = res.items as Record<string, unknown[]>;
        const normalized: Record<string, unknown[]> = {};
        for (const [k, v] of Object.entries(raw)) {
          const camelKey = `${(k[0] ?? '').toLowerCase()}${k.slice(1)}`;
          normalized[camelKey] = v;
        }
        return normalized;
      },
      staleTime: 5 * 60 * 1000, // 5 分钟，与老项目 STALE_AFTER_MS 一致
      gcTime: 10 * 60 * 1000, // 组件全卸载后 cache 在内存保留 10 分钟（默认 5 分钟）
    });
    return computed(() => toOptions('dynamic', key, data.value?.[key] ?? []));
  }

  // static dict：staleTime=Infinity，登录时 prefetchStaticDicts() 已预热，此处直接命中缓存
  const { data } = useQuery({
    queryKey: DICT_QUERY_KEY[resolvedSource] as readonly string[],
    queryFn: STATIC_DICT_QUERY_FN[resolvedSource] as unknown as () => Promise<
      Record<string, unknown[]>
    >,
    staleTime: Infinity,
  });
  return computed(() =>
    toOptions(resolvedSource, key, (data.value as any)?.[key] ?? []),
  );
}

/**
 * 获取 value → label 的查找 Map（响应式），用于表格列渲染。
 *
 * @example
 *   const statusMap = useLabelMap('enableStateList')
 *   // 模板中：{{ statusMap.get(row.status) ?? row.status }}
 */
export function useLabelMap(
  key: UnambiguousKey,
): ComputedRef<Map<number | string, string>>;
export function useLabelMap(
  key: AmbiguousKey,
  source: DictSource,
): ComputedRef<Map<number | string, string>>;
export function useLabelMap(
  key: string,
  source?: DictSource,
): ComputedRef<Map<number | string, string>> {
  const options = useDictOptions(key as UnambiguousKey, source as any);
  return computed(() => new Map(options.value.map((o) => [o.value, o.label])));
}
