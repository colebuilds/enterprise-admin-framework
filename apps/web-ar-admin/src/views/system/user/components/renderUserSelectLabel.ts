import type { SelectOption } from 'naive-ui';

import type { VNodeChild } from 'vue';

import { h } from 'vue';

import { NTag } from 'naive-ui';

/**
 * `getTenantUserSelectList` 下拉 label 定制：在用户名后追加出款 / 入款权限标记。
 * 依赖 AsyncSelect fieldMapping 透传的 `hasWithdrawConfig` / `hasApprovalConfig`。
 */
export const renderUserSelectLabel = (option: SelectOption): VNodeChild => {
  const children: VNodeChild[] = [
    h('span', { style: 'margin-right: 4px;' }, String(option.label ?? '')),
  ];
  if ((option as Record<string, unknown>).hasWithdrawConfig) {
    children.push(
      h(
        NTag,
        {
          size: 'small',
          type: 'info',
          bordered: false,
          style: 'margin-right: 4px;',
        },
        { default: () => '出款' },
      ),
    );
  }
  if ((option as Record<string, unknown>).hasApprovalConfig) {
    children.push(
      h(NTag, { size: 'small', type: 'success' }, { default: () => '入款' }),
    );
  }
  return h('div', { style: 'display: flex; align-items: center;' }, children);
};
