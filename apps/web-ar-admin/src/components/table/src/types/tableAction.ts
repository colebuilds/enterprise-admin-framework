/* oxlint-disable */
import type { Component } from 'vue';
import type { HTMLAttributes } from 'vue';

import { NButton } from 'naive-ui';

import { PermissionsEnum } from '#/enums/permissionsEnum';
export interface ActionItem
  extends HTMLAttributes, Partial<InstanceType<typeof NButton>> {
  onClick?: Fn;
  label?: string;
  type?: 'default' | 'error' | 'info' | 'primary' | 'success' | 'warning';
  // 设定 color 后会覆盖 type 的样式
  color?: string;
  icon?: Component;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  action?: string;
  key?: string;
  // 权限编码控制是否显示
  auth?: PermissionsEnum | PermissionsEnum[] | string | string[];
  // 业务控制是否显示
  ifShow?: ((action: ActionItem) => boolean) | boolean;
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: Component;
}
