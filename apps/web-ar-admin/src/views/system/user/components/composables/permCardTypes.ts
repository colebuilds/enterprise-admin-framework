import type { SelectOption } from 'naive-ui';

import type {
  BatchAddSysUsersApprovalApiConfigReq,
  BatchAddSysUsersWithdrawConfigReq,
  SysUsersDetailApprovalApiConfigRsp,
  SysUsersDetailWithdrawConfigRsp,
} from '#/api/system';

/**
 * 统一的商户选项结构，下发给权限卡片的过滤用。
 * 注意与 `useTenantOptions` 的 TenantOption 区分：这里只保留卡片真正要用的两个字段，
 * 不泄露业务无关的 raw 数据。
 * 交叉 naive-ui `SelectOption` 后即可直接绑到 n-select :options。
 */
export type PermCardTenantOption = SelectOption & {
  label: string;
  value: number | string;
};

/**
 * 权限卡统一 props 合同：
 * - `initial` 是唯一的"数据来源"入口，`undefined` 表示新增；有值就是回显（编辑或复制共用同一条路径）。
 * - `initialEnabled` 仅作首次 seed，用来承载编辑场景从 userInfo 派生的权威启用态。其他场景留空让卡片自行推断。
 * - `tenantOptions` 是当前归属商户范围；card 内部的商户选择和派生列表都跟随它收窄。
 */
export interface PermCardProps<TInitialData> {
  initial?: TInitialData;
  initialEnabled?: boolean;
  tenantOptions?: PermCardTenantOption[];
}

// ─── Withdraw ──────────────────────────────────────────────

export type WithdrawInitial = SysUsersDetailWithdrawConfigRsp;

/** 出款权限卡对外输出：直接塞到父组件的提交 payload 里即可 */
export type WithdrawOutput = BatchAddSysUsersWithdrawConfigReq;

/** 出款卡的内部快照：职位 / 币种 / 上级 / 商户。切职位 / 切币种再切回时用来恢复。 */
export interface WithdrawSnapshot {
  enabled: boolean;
  userRank: string;
  configGroupId: number | undefined;
  superiorIds: string[];
  currencyType: 'Fiat' | 'USDT';
  sysCurrency: string | undefined;
  tenantIds: number[];
}

// ─── Approval ──────────────────────────────────────────────

export type ApprovalInitial = SysUsersDetailApprovalApiConfigRsp;

/** 人工充值审批卡对外输出 */
export type ApprovalOutput = BatchAddSysUsersApprovalApiConfigReq;

/** 审批卡内部快照：角色 / 一二级操作 / 商户 / 限额。切角色回来时恢复。 */
export interface ApprovalSnapshot {
  enabled: boolean;
  userRole: number;
  roleAuthorize: number[];
  subRoleAuthorize: number[];
  tenantIds: number[];
  isRequireApproval: string;
  permissionConfig: ApprovalOutput['approval_PermissionConfig'] | undefined;
}
