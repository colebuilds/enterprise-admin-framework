/* oxlint-disable */
import type { VNode } from 'vue';

import type { ProColumn, Recordable } from '../types';

import { h } from 'vue';

import { CheckOutlined, CopyOutlined } from '@vicons/antd';
import {
  NButton,
  NEllipsis,
  NIcon,
  NImage,
  NProgress,
  NSpace,
  NTag,
  NTooltip,
} from 'naive-ui';

import { i18n } from '#/i18n';

const t = (key: string): string => i18n.global.t(key);

// TODO: replace with vben preference system in Phase 1.3+
function getThemeColor() {
  return '#2080f0';
}

/**
 * 列类型渲染器注册表
 */
const columnTypeRenderers = new Map<string, ColumnTypeRenderer>();

/**
 * 内置渲染器类型列表 - 用于区分内置和自定义渲染器
 */
const builtinRendererTypes = new Set<string>();

/**
 * 列类型渲染器
 */
export interface ColumnTypeRenderer {
  render: (
    value: any,
    row: Recordable,
    index: number,
    column: ProColumn,
  ) => null | string | VNode;
  defaultProps?: Recordable;
}

/**
 * 注册列类型渲染器
 */
export function registerColumnRenderer(
  type: string,
  renderer: ColumnTypeRenderer,
): void {
  columnTypeRenderers.set(type, renderer);
}

/**
 * 注册内置渲染器 (内部使用)
 */
function registerBuiltinRenderer(
  type: string,
  renderer: ColumnTypeRenderer,
): void {
  columnTypeRenderers.set(type, renderer);
  builtinRendererTypes.add(type);
}

/**
 * 获取列类型渲染器
 */
export function getColumnRenderer(
  type: string,
): ColumnTypeRenderer | undefined {
  return columnTypeRenderers.get(type);
}

/**
 * 注销列类型渲染器
 */
export function unregisterColumnRenderer(type: string): boolean {
  // 防止注销内置渲染器
  if (builtinRendererTypes.has(type)) {
    console.warn(
      `[useColumnRenderer] Cannot unregister built-in renderer: ${type}`,
    );
    return false;
  }
  return columnTypeRenderers.delete(type);
}

/**
 * 清除所有自定义渲染器 (保留内置渲染器)
 */
export function clearCustomRenderers(): void {
  for (const type of columnTypeRenderers.keys()) {
    if (!builtinRendererTypes.has(type)) {
      columnTypeRenderers.delete(type);
    }
  }
}

/**
 * 获取已注册的渲染器类型列表
 */
export function getRegisteredRendererTypes(): string[] {
  return [...columnTypeRenderers.keys()];
}

// =============== 内置渲染器 ===============

/**
 * 格式化数字
 */
function formatNumber(value: number, decimals?: number): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  if (decimals !== undefined) {
    return value.toFixed(decimals);
  }
  return value.toLocaleString();
}

/**
 * 格式化金额
 */
function formatMoney(value: number, currency = '¥', decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return `${currency}${value.toFixed(decimals).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/**
 * 格式化百分比
 */
function formatPercent(value: number, decimals = 2): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化日期
 */
function formatDate(
  value: Date | number | string,
  format = 'YYYY-MM-DD',
): string {
  if (!value) return '-';

  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';

  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 注册文本渲染器
registerBuiltinRenderer('text', {
  render: (value) =>
    value !== null && value !== undefined ? String(value) : '-',
});

// 注册数字渲染器
registerBuiltinRenderer('number', {
  render: (value, _row, _index, column) => formatNumber(value, column.decimals),
});

// 注册金额渲染器
registerBuiltinRenderer('money', {
  render: (value, _row, _index, column) =>
    formatMoney(value, column.currency || '¥', column.decimals ?? 2),
});

// 注册百分比渲染器
registerBuiltinRenderer('percent', {
  render: (value, _row, _index, column) =>
    formatPercent(value, column.decimals ?? 2),
});

// 注册日期渲染器
registerBuiltinRenderer('date', {
  render: (value, _row, _index, column) =>
    formatDate(value, column.dateFormat || 'YYYY-MM-DD'),
});

// 注册日期时间渲染器
registerBuiltinRenderer('datetime', {
  render: (value, _row, _index, column) =>
    formatDate(value, column.dateFormat || 'YYYY-MM-DD HH:mm:ss'),
});

// 注册时间渲染器
registerBuiltinRenderer('time', {
  render: (value, _row, _index, column) =>
    formatDate(value, column.dateFormat || 'HH:mm:ss'),
});

// 注册标签渲染器
registerBuiltinRenderer('tag', {
  render: (value, _row, _index, column) => {
    if (value === null || value === undefined) return '-';

    // 使用 valueEnum 获取显示信息
    if (column.valueEnum) {
      const enumItem = column.valueEnum[value];
      if (enumItem) {
        const text = typeof enumItem === 'string' ? enumItem : enumItem.text;
        const color = typeof enumItem === 'object' ? enumItem.color : undefined;
        const type = typeof enumItem === 'object' ? enumItem.type : undefined;

        return h(NTag, { type, color, size: 'small' }, () => text);
      }
    }

    return h(NTag, { size: 'small' }, () => String(value));
  },
});

// 注册多标签渲染器
registerBuiltinRenderer('tags', {
  render: (value) => {
    if (!Array.isArray(value) || value.length === 0) return '-';

    return h(NSpace, { size: 4 }, () =>
      value.map((item, i) =>
        h(NTag, { key: i, size: 'small' }, () => String(item)),
      ),
    );
  },
});

// 注册状态渲染器 (带小圆点)
registerBuiltinRenderer('status', {
  render: (value, _row, _index, column) => {
    if (value === null || value === undefined) return '-';

    let text = String(value);
    let color = '';
    let dotColor = '';

    // 使用 valueEnum 获取显示信息
    if (column.valueEnum) {
      const enumItem = column.valueEnum[value];
      if (enumItem) {
        text = typeof enumItem === 'string' ? enumItem : enumItem.text;
        color = typeof enumItem === 'object' ? enumItem.color || '' : '';
        dotColor = color;
      }
    }

    const dotStyle = {
      display: 'inline-block',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: dotColor || '#d9d9d9',
      marginRight: '6px',
    };

    return h(
      'span',
      { style: { display: 'inline-flex', alignItems: 'center' } },
      [
        h('span', { style: dotStyle }),
        h('span', { style: color ? { color } : {} }, text),
      ],
    );
  },
});

// 注册进度条渲染器
registerBuiltinRenderer('progress', {
  render: (value, _row, _index, column) => {
    if (value === null || value === undefined) return '-';

    const percentage =
      typeof value === 'number' ? value : Number.parseFloat(value);
    if (isNaN(percentage)) return '-';

    return h(NProgress, {
      percentage,
      showIndicator: true,
      ...column.progressProps,
    });
  },
});

// 注册图片渲染器
registerBuiltinRenderer('image', {
  render: (value, _row, _index, column) => {
    if (!value) return '-';

    return h(NImage, {
      src: value,
      width: column.imageWidth || 40,
      height: column.imageHeight || 40,
      objectFit: 'cover',
      previewDisabled: false,
      style: { borderRadius: '4px' },
    });
  },
});

// 注册链接渲染器
registerBuiltinRenderer('link', {
  render: (value) => {
    if (!value) return '-';

    return h(
      NButton,
      {
        text: true,
        type: 'primary',
        tag: 'a',
        href: value,
        target: '_blank',
      },
      () => String(value),
    );
  },
});

// 注册布尔渲染器
registerBuiltinRenderer('boolean', {
  render: (value, _row, _index, column) => {
    const trueText = column.trueText || t('common.yes');
    const falseText = column.falseText || t('common.no');
    const trueColor = column.trueColor || '#18a058';
    const falseColor = column.falseColor || '#d03050';

    return h(
      'span',
      { style: { color: value ? trueColor : falseColor } },
      value ? trueText : falseText,
    );
  },
});

// 注册代码渲染器
registerBuiltinRenderer('code', {
  render: (value) => {
    if (!value) return '-';

    return h(
      'code',
      {
        style: {
          padding: '2px 6px',
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '13px',
        },
      },
      String(value),
    );
  },
});

// 注册可复制渲染器
registerBuiltinRenderer('copy', {
  render: (value) => {
    if (!value) return '-';

    const copied = { value: false };
    const themeColor = getThemeColor();

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(String(value));
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch {
        // 降级处理
        const textarea = document.createElement('textarea');
        textarea.value = String(value);
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
    };

    return h(NSpace, { align: 'center', size: 4, wrap: false }, () => [
      h(NEllipsis, { style: { maxWidth: '200px' } }, () => String(value)),
      h(NTooltip, null, {
        trigger: () =>
          h(
            NIcon,
            {
              size: 14,
              color: themeColor,
              style: { cursor: 'pointer' },
              onClick: handleCopy,
            },
            () => h(copied.value ? CheckOutlined : CopyOutlined),
          ),
        default: () =>
          copied.value ? t('common.copy.copied') : t('common.copy.copy'),
      }),
    ]);
  },
});

// 注册序号渲染器
registerBuiltinRenderer('index', {
  render: (_value, _row, index) => String(index + 1),
});

/**
 * useColumnRenderer composable
 */
export function useColumnRenderer() {
  function getCopyableText(
    value: any,
    column: ProColumn,
    content: null | number | string | VNode,
  ): null | string {
    if (content === null || content === undefined || content === '-')
      return null;

    if (typeof content === 'string' || typeof content === 'number') {
      return String(content);
    }

    const displayValue = getColumnDisplayValue(value, column);
    return displayValue === '-' ? null : displayValue;
  }

  function renderCopyableContent(
    content: null | number | string | VNode,
    copyText: null | string,
    column: ProColumn,
  ): null | string | VNode {
    if (!copyText) return content;

    const copied = { value: false };
    const themeColor = getThemeColor();
    const ellipsisConfig =
      typeof column.ellipsis === 'object'
        ? column.ellipsis
        : { tooltip: true, lineClamp: 1 };

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(copyText);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
    };

    const contentNode =
      typeof content === 'string' || typeof content === 'number'
        ? h(
            NEllipsis,
            {
              tooltip: ellipsisConfig.tooltip,
              lineClamp: ellipsisConfig.lineClamp || 1,
              style: { maxWidth: '200px' },
            },
            () => String(content),
          )
        : content;

    return h(
      NSpace,
      { align: 'center', size: 4, wrap: false, justify: 'center' },
      () => [
        contentNode,
        h(NTooltip, null, {
          trigger: () =>
            h(
              NIcon,
              {
                size: 14,
                color: themeColor,
                style: { cursor: 'pointer', flexShrink: 0 },
                onClick: handleCopy,
              },
              () => h(copied.value ? CheckOutlined : CopyOutlined),
            ),
          default: () =>
            copied.value ? t('common.copy.copied') : t('common.copy.copy'),
        }),
      ],
    );
  }

  /**
   * 渲染列值
   */
  function renderColumnValue(
    value: any,
    row: Recordable,
    index: number,
    column: ProColumn,
  ): null | string | VNode {
    let content: null | string | VNode;

    if (column.render) {
      content = column.render(row, index, column);
    } else {
      const valueType = column.valueType || 'text';
      const renderer = getColumnRenderer(valueType);
      content = renderer
        ? renderer.render(value, row, index, column)
        : (value !== null && value !== undefined
          ? String(value)
          : '-');
    }

    if (column.copyable && column.valueType !== 'copy') {
      return renderCopyableContent(
        content,
        getCopyableText(value, column, content),
        column,
      );
    }

    return content;
  }

  /**
   * 渲染带省略的列值
   */
  function renderColumnWithEllipsis(
    value: any,
    row: Recordable,
    index: number,
    column: ProColumn,
  ): null | string | VNode {
    const content = renderColumnValue(value, row, index, column);

    if (!column.ellipsis || content === '-' || content === null) {
      return content;
    }

    const ellipsisConfig =
      typeof column.ellipsis === 'object' ? column.ellipsis : { tooltip: true };

    if (typeof content === 'string') {
      return h(
        NEllipsis,
        {
          tooltip: ellipsisConfig.tooltip,
          lineClamp: ellipsisConfig.lineClamp || 1,
        },
        () => content,
      );
    }

    return content;
  }

  /**
   * 获取列的显示值 (用于 valueEnum)
   */
  function getColumnDisplayValue(value: any, column: ProColumn): string {
    if (column.valueEnum) {
      const enumItem = column.valueEnum[value];
      if (enumItem) {
        return typeof enumItem === 'string' ? enumItem : enumItem.text;
      }
    }
    return value !== null && value !== undefined ? String(value) : '-';
  }

  return {
    renderColumnValue,
    renderColumnWithEllipsis,
    getColumnDisplayValue,
    registerColumnRenderer,
    getColumnRenderer,
  };
}

export default useColumnRenderer;
