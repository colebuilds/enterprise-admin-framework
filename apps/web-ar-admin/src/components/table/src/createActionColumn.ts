/* oxlint-disable */
import type { ComputedRef } from 'vue';

import type { ActionItem } from './types/tableAction';

import type { CrudActionColumn } from '#/components/pro/ProCrudTable/types';
import type { Recordable } from '#/components/pro/types';

import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

import { usePermission } from '#/hooks/usePermission';

import TableAction from './components/TableAction.vue';

const ACTION_BUTTON_WIDTH = 70;
const DYNAMIC_ACTIONS_BASE_WIDTH = 210;

/**
 * 操作项配置
 */
export interface ActionConfig<T extends Recordable = Recordable> {
  /** 按钮标签 */
  label: string;
  /** 点击处理函数 */
  onClick: (row: T) => Promise<void> | void;
  /** 权限码 */
  auth?: string[];
  /** 操作类型，delete 会显示删除确认 */
  type?: 'delete' | 'error' | 'info' | 'primary' | 'success' | 'warning';
  /** 是否显示 */
  show?: (row: T) => boolean;
  /** 按钮颜色,使用 color 会覆盖 type */
  color?: string;
  /** 是否禁用（可与 {@link show} 一样按行控制） */
  disabled?: ((row: T) => boolean) | boolean;
}

/**
 * 下拉操作项配置
 */
export interface DropdownActionConfig<T extends Recordable = Recordable> {
  /** 按钮标签 */
  label: string;
  /** 点击处理函数 */
  onClick: (row: T) => Promise<void> | void;
  /** 权限码 */
  auth?: string[];
  /** 是否显示 */
  show?: (row: T) => boolean;
  /** 是否禁用（可与 {@link show} 一样按行控制） */
  disabled?: ((row: T) => boolean) | boolean;
}

/**
 * 操作列配置
 */
export interface ActionColumnConfig<T extends Recordable = Recordable> {
  /** 主操作列表 (可以是数组或返回数组的函数) */
  actions: ((row: T) => ActionConfig<T>[]) | ActionConfig<T>[];
  /** 下拉操作列表 */
  dropdownActions?: DropdownActionConfig<T>[];
  /** 列宽度 */
  width?: number;
  /** 列标题 */
  title?: string;
}

function resolveDisabled<T extends Recordable>(
  disabled: ActionConfig<T>['disabled'],
  row: T,
): true | undefined {
  const value = typeof disabled === 'function' ? disabled(row) : disabled;
  return value ? true : undefined;
}

/**
 * 创建操作列
 *
 * 必须传入工厂函数：computed 内部每次重算都会重新调用 factory()，从而完整收集
 * `t()`、字典、外部 ref 等响应式依赖；切语言/权限/字典变化都会触发列重渲染。
 *
 * @example
 * ```ts
 * const actionColumn = createActionColumn(() => ({
 *   actions: [
 *     { label: t('common.edit'), onClick: handleEdit, auth: ['User:Update'] },
 *     { label: t('common.delete'), onClick: handleDelete, type: 'delete', auth: ['User:Delete'] },
 *   ],
 *   dropdownActions: [
 *     { label: t('user.resetPassword'), onClick: handleResetPassword, auth: ['User:ResetPassword'] },
 *   ],
 *   width: 250,
 * }))
 * ```
 */
export function createActionColumn<T extends Recordable = Recordable>(
  factory: () => ActionColumnConfig<T>,
): ComputedRef<CrudActionColumn<T> | undefined> {
  const { hasPermission } = usePermission();
  const { t } = useI18n();

  return computed<CrudActionColumn<T> | undefined>(() => {
    const { actions, dropdownActions, width, title } = factory();
    const staticActions = typeof actions === 'function' ? null : actions;
    const getRowActions: (row: T) => ActionConfig<T>[] = staticActions
      ? () => staticActions
      : (actions as (row: T) => ActionConfig<T>[]);

    const visibleStaticActions = staticActions?.filter(
      (a) => !a.auth || hasPermission(a.auth),
    );
    const visibleDropdownActions = dropdownActions?.filter(
      (a) => !a.auth || hasPermission(a.auth),
    );

    if (visibleStaticActions?.length === 0 && !visibleDropdownActions?.length) {
      return undefined;
    }

    const dropdownWidth = visibleDropdownActions?.length
      ? ACTION_BUTTON_WIDTH
      : 0;
    const defaultWidth = staticActions
      ? visibleStaticActions!.length * ACTION_BUTTON_WIDTH + dropdownWidth
      : DYNAMIC_ACTIONS_BASE_WIDTH + dropdownWidth;

    return {
      width: width ?? defaultWidth,
      title: title ?? t('components.proCrudTable.action'),
      fixed: 'right',
      align: 'center',
      render: (row: T) => {
        const actionItems: ActionItem[] = getRowActions(row).map((a) => ({
          label: a.label,
          onClick: () => a.onClick(row),
          auth: a.auth,
          action: a.type === 'delete' ? 'delete' : undefined,
          type: a.type === 'delete' ? 'error' : a.type,
          color: a.color,
          disabled: resolveDisabled(a.disabled, row),
          ifShow: a.show ? () => a.show!(row) : undefined,
        }));

        const dropdownItems: ActionItem[] | undefined = dropdownActions?.map(
          (a, i) => ({
            label: a.label,
            key: `dropdown_${i}`,
            auth: a.auth,
            onClick: () => a.onClick(row),
            disabled: resolveDisabled(a.disabled, row),
            ifShow: a.show ? () => a.show!(row) : undefined,
          }),
        );

        return h(TableAction, {
          actions: actionItems,
          dropDownActions: dropdownItems,
        });
      },
    };
  });
}
