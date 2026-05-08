import type { VNode } from 'vue';

/**
 * 表格列 render 工具函数
 * 内置 h()，在列定义中直接调用即可，无需手动 import { h }
 *
 * @example
 * // IP 地址链接
 * { key: 'ip', title: 'IP', render: (row) => renderIPLink(row.ip) }
 *
 * // 在线/离线
 * { key: 'isOnLine', title: '登录状态', render: (row) => renderBoolTag(row.isOnLine, '在线', '离线') }
 *
 * // 多标签（固定颜色）
 * { key: 'langs', title: '语言', render: (row) => renderTagList(row.langs?.split(','), 'info') }
 *
 * // 单标签
 * { key: 'payCode', title: '三方映射码', render: (row) => renderTag(row.payCode, { type: 'info' }) }
 *
 * // 多标签（按索引轮换颜色）
 * { key: 'roles', title: '角色', render: (row) => renderTagList(names, 'auto') }
 *
 * // 日期时间
 * { key: 'createTime', title: '创建时间', render: (row) => renderDateTime(row.createTime) }
 * { key: 'date', title: '日期', render: (row) => renderDateTime(row.date, { format: 'yyyy-MM-dd', inline: true }) }
 */
import { h } from 'vue';

import { NEllipsis, NSpace, NTag } from 'naive-ui';

import { useTenantOptions } from '#/hooks';
import { isIPv4Address } from '#/utils';

import DateTime from '../DateTime.vue';

export type TagType =
  | 'default'
  | 'error'
  | 'info'
  | 'sky'
  | 'success'
  | 'warning';
export type TagSize = 'large' | 'medium' | 'small';
const TAG_TYPE_CYCLE: TagType[] = [
  'error',
  'warning',
  'info',
  'success',
  'default',
];

// Sky tag 配色（参考 Ant Design / Element Plus 蓝色系）：'sky' 走 NTag 的 color prop，
// 而非 Naive UI 原生 type，因此通过 resolveTagProps 在内部做映射，调用侧仍按 TagType 写。
const SKY_TAG_COLOR = {
  color: '#E6F7FF',
  textColor: '#1890FF',
  borderColor: '#91D5FF',
} as const;

function resolveTagProps(type: TagType) {
  if (type === 'sky') return { color: SKY_TAG_COLOR } as const;
  return { type };
}

// ---------------------------------------------------------------------------
// renderIPLink — IP 地址可点击链接
// ---------------------------------------------------------------------------
export function renderIPLink(
  ip: null | string | undefined,
  fallback = '--',
): string | VNode {
  if (!ip) return fallback;
  const link = h(
    'a',
    {
      class: 'text-blue-600 hover:underline',
      href: `https://www.ip2location.com/demo/${ip}`,
      target: '_blank',
    },
    ip,
  );

  if (isIPv4Address(ip)) return link;

  return h(
    NEllipsis,
    {
      class: 'block max-w-full leading-snug',
      tooltip: { content: ip },
    },
    { default: () => link },
  );
}

// ---------------------------------------------------------------------------
// renderStatusTag — 枚举值 → 彩色标签
// ---------------------------------------------------------------------------
export interface StatusOption {
  type: TagType;
  label: string;
}

export function renderStatusTag(
  value: boolean | null | number | string | undefined,
  options: Record<string, StatusOption>,
  size: 'large' | 'medium' | 'small' = 'small',
): string | VNode {
  const key = String(value ?? '');
  const opt = options[key];
  return h(
    NTag,
    { size, bordered: true, ...resolveTagProps(opt?.type || 'default') },
    { default: () => opt?.label || '--' },
  );
}

// ---------------------------------------------------------------------------
// renderBoolTag — 布尔值快捷标签
// ---------------------------------------------------------------------------
export function renderBoolTag(
  value: boolean | null | number | undefined,
  trueLabel = '是',
  falseLabel = '否',
  trueType: TagType = 'success',
  falseType: 'default' | TagType = 'default',
): string | VNode {
  const active = value === true || value === 1;
  return h(
    NTag,
    {
      bordered: true,
      size: 'small',
      ...resolveTagProps(active ? trueType : falseType),
    },
    { default: () => (active ? trueLabel : falseLabel) },
  );
}

// ---------------------------------------------------------------------------
// renderTag — 单个文本标签
// ---------------------------------------------------------------------------
export interface RenderTagOptions {
  type?: TagType;
  size?: TagSize;
  bordered?: boolean;
  fallback?: string;
}

export function renderTag(
  value: null | number | string | undefined,
  options: RenderTagOptions = {},
): string | VNode {
  const {
    type = 'default',
    size = 'small',
    bordered = true,
    fallback = '--',
  } = options;
  if (value === null || value === undefined || value === '') return fallback;

  return h(
    NTag,
    { size, bordered, ...resolveTagProps(type) },
    { default: () => String(value) },
  );
}

// ---------------------------------------------------------------------------
// renderTagList — 数组 → 多标签
// 支持字符串数组 或 { label, type? } 对象数组
// ---------------------------------------------------------------------------
export interface TagItem {
  label: string;
  type?: TagType;
}

export interface TagListOptions {
  /** 全局颜色：固定值 | 'auto' 按索引轮换（对象自带 type 时优先用对象的） */
  type?: 'auto' | TagType;
  center?: boolean;
  fallback?: string;
}

export function renderTagList(
  items: (null | string | TagItem | undefined)[] | null | undefined,
  options: 'auto' | TagListOptions | TagType = 'default',
): string | VNode {
  const opts: TagListOptions =
    typeof options === 'string' ? { type: options } : options;
  const { type = 'default', center = true, fallback = '--' } = opts;

  const list = items?.filter(Boolean) as (string | TagItem)[] | undefined;
  if (!list?.length) return fallback;

  return h(
    NSpace,
    { size: [6, 6], wrap: true, justify: center ? 'center' : 'start' },
    {
      default: () =>
        list.map((item, index) => {
          const isObj = typeof item === 'object';
          const label = isObj ? item.label : item;
          const tagType =
            (isObj && item.type) ||
            (type === 'auto'
              ? TAG_TYPE_CYCLE[index % TAG_TYPE_CYCLE.length]
              : type);
          return h(
            NTag,
            { size: 'small', bordered: true, ...resolveTagProps(tagType) },
            { default: () => label },
          );
        }),
    },
  );
}

// ---------------------------------------------------------------------------
// renderTenantTag — 商户/集团名称标签
// 内部自动通过 useTenantOptions().getTenantLabel 解析商户名称
// 用法: renderTenantTag(tenantId)
//       renderTenantTag(tenantId, tenantName)
//       renderTenantTag('直接传名称')
// ---------------------------------------------------------------------------

export function renderTenantTag(
  nameOrId?: null | number | string,
  tenantName?: null | string,
  fallback = '--',
): string | VNode {
  const { getTenantLabel, defaultTenantId } = useTenantOptions();
  const resolvedId = typeof nameOrId === 'number' ? nameOrId : undefined;
  let label: string | undefined;

  if (resolvedId) {
    label = getTenantLabel(resolvedId, tenantName) || undefined;
  } else if (typeof nameOrId === 'string' && nameOrId.trim()) {
    label = nameOrId.trim();
  } else if (defaultTenantId.value) {
    label = getTenantLabel(defaultTenantId.value) || undefined;
  }

  if (!label || label === '-' || label === '--') return fallback;

  return h(
    NTag,
    { size: 'small', bordered: true, type: 'info' as TagType },
    { default: () => label },
  );
}

// ---------------------------------------------------------------------------
// renderMemberIdLink — 会员 ID 可点击链接（蓝色字体）
// 统一替代各处手写的 h('a', { style: 'color: #1890ff;...', onClick }, ...)
// 用法: render: (row) => renderMemberIdLink(row.userId, row.tenantId, openMemberDetailModal)
//       render: (row) => renderMemberIdLink(row.userId, row.tenantId, onClick, { bold: false })
//       render: (row) => renderMemberIdLink(row.userId, row.tenantId, onClick, { tenantLabel: row.site })
// ---------------------------------------------------------------------------

export function renderMemberIdLink(
  memberId: null | number | string | undefined,
  tenantId: null | number | string | undefined,
  onClick: (
    memberId: number | string,
    tenantId: number | string,
    tenantLabel?: null | string,
  ) => void,
  options?: { bold?: boolean; fallback?: string; tenantLabel?: null | string },
): string | VNode {
  const fallback = options?.fallback ?? '--';
  if (memberId === null || memberId === undefined || memberId === '') return fallback;
  const bold = options?.bold !== false;
  const style = bold
    ? '#1890ff; 600; color: cursor: font-weight: pointer;'
    : '#1890ff; color: cursor: pointer;';
  return h(
    'a',
    {
      style,
      onClick: () => onClick(memberId, tenantId ?? '', options?.tenantLabel),
    },
    String(memberId),
  );
}

// ---------------------------------------------------------------------------
// renderSummaryAmount — 汇总行：加粗金额（无颜色/符号处理）
// 用法: summary 行 { balance: { value: renderSummaryAmount(summaryData.xxx) } }
// ---------------------------------------------------------------------------

export function renderSummaryAmount(
  value: null | number | string | undefined,
  fallback = '--',
): string | VNode {
  if (value === null || value === undefined || value === '') return fallback;
  return h('span', { style: 'font-weight: 600' }, String(value));
}

// ---------------------------------------------------------------------------
// renderSignedAmount — 汇总行：正负号 + 颜色（正绿负红 + 加粗）
// 输入值可以是已带 "+"/"-" 前缀的字符串，也可以是原始数值
// 用法: { value: renderSignedAmount(fundStatSummary.pageAmount) }
// ---------------------------------------------------------------------------

export function renderSignedAmount(
  value: null | number | string | undefined,
  fallback = '--',
): string | VNode {
  if (value === null || value === undefined || value === '') return fallback;
  const str = String(value);
  const negative = str.startsWith('-');
  return h(
    'span',
    { style: `color: ${negative ? '#dc2626' : '#16a34a'}; font-weight: 600;` },
    str,
  );
}

// ---------------------------------------------------------------------------
// renderOrgTag — 集团名称标签
// ---------------------------------------------------------------------------

export function renderOrgTag(
  orgId?: null | number | string,
  fallback = '--',
): string | VNode {
  const { getOrgName } = useTenantOptions();
  const label = getOrgName(orgId, '');
  if (!label) return fallback;

  return h(
    NTag,
    { size: 'small', bordered: true, type: 'warning' as TagType },
    { default: () => label },
  );
}

// ---------------------------------------------------------------------------
// renderDateTime — 日期时间
// ---------------------------------------------------------------------------
export function renderDateTime(
  value: any,
  options?: { format?: string; inline?: boolean },
): string | VNode {
  return h(DateTime, {
    value,
    format: options?.format,
    inline: options?.inline,
  });
}
