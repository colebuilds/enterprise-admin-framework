import type {
  ApprovalInitial,
  ApprovalOutput,
  PermCardTenantOption,
  WithdrawInitial,
  WithdrawOutput,
} from './permCardTypes';

/**
 * 判断 initial 是否属于 Withdraw 类型。两个 Card 共用 helper 时用它分流。
 * Withdraw 有 `withdraw_UserRank`，Approval 有 `approval_UserRole`，字段名唯一。
 */
function isWithdrawInitial(
  data: ApprovalInitial | WithdrawInitial,
): data is WithdrawInitial {
  return 'withdraw_UserRank' in data;
}

/**
 * 状态字段归一化：后端类型声明为 string（"0"/"1"），但实际下发常是 number（0/1），
 * 单纯 `=== '1'` 严格相等会永远返回 false，导致"接口开但界面关"的展示反转。
 * 统一通过这个函数判断各种 truthy 表达式 → 兼容 1 / "1" / true。
 */
export function isEnabledFlag(value: unknown): boolean {
  return value === 1 || value === '1' || value === true;
}

/**
 * 统一的 enabled 推断规则：
 * - 显式 override → 直接用（**这是默认入口**：编辑场景从 userInfo.xxxState 派生；
 *   复制 / 批量赋权场景从源用户的 userInfo.xxxState 派生，由父组件取值后传入）。
 * - 无 initial（纯新增）→ false。
 * - 有 initial 但无 override → 退到 initial 自带的 state 字段；缺失时默认 false。
 *
 * 注意：绝不能用 `withdraw_UserRank` / `approval_UserRole` 反推 enabled。
 * 这两个字段表示"曾经配过的角色 / 职位"（configured），与 enabled 是独立维度。
 * 把 configured 当 enabled，会导致复制"已配置但已关闭"的用户时卡片被错误打开。
 */
export function resolveInitialEnabled(
  initial: ApprovalInitial | undefined | WithdrawInitial,
  override: boolean | undefined,
): boolean {
  if (override !== undefined) return override;
  if (!initial) return false;
  if (isWithdrawInitial(initial)) {
    // SysUsersDetailWithdrawConfigRsp 不带 EnableState；正确的状态来源是 userInfo.withdraw_EnableState，
    // 父组件应通过 initial-enabled 显式传入。这里走到说明父组件漏传，保守默认关
    return false;
  }
  return isEnabledFlag(initial.approval_UserState);
}

/**
 * 把卡内部 form（TenantIds 是 number[]）转为接口要求的 payload（TenantIds 是逗号分隔 string）。
 * 同时把 undefined 的 configGroupId 规范成 0。
 * `enabled` 单独透传到 `withdraw_EnableState`，与 approval_UserState 对齐，
 * 让父组件即使在关闭状态也能把完整结构发给后端。
 */
export function toWithdrawPayload(
  form: {
    withdraw_ApprovalConfig?: WithdrawOutput['withdraw_ApprovalConfig'];
    withdraw_ConfigGroupId?: number;
    withdraw_ParentSysUserIds: string;
    withdraw_SysCurrency?: string;
    withdraw_TenantIds: number[];
    withdraw_UserRank: string;
  },
  enabled: boolean,
): WithdrawOutput {
  return {
    withdraw_EnableState: (enabled
      ? 1
      : 0) as WithdrawOutput['withdraw_EnableState'],
    withdraw_ConfigGroupId: Number(form.withdraw_ConfigGroupId) || 0,
    withdraw_UserRank: form.withdraw_UserRank,
    withdraw_ParentSysUserIds: form.withdraw_ParentSysUserIds,
    withdraw_ApprovalConfig: form.withdraw_ApprovalConfig
      ? { ...form.withdraw_ApprovalConfig }
      : undefined,
    withdraw_SysCurrency: form.withdraw_SysCurrency,
    withdraw_TenantIds: form.withdraw_TenantIds.join(','),
  };
}

/**
 * 同样把审批 form 转为 payload。approval_UserState 以当前 enabled 布尔为准。
 */
export function toApprovalPayload(
  form: {
    approval_IsRequireApproval: string;
    approval_PermissionConfig: ApprovalOutput['approval_PermissionConfig'];
    approval_RoleAuthorize: number[];
    approval_SubRoleAuthorize: number[];
    approval_TenantIds: number[];
    approval_UserRole: number;
  },
  enabled: boolean,
): ApprovalOutput {
  return {
    approval_TenantIds: form.approval_TenantIds.join(','),
    approval_UserRole:
      form.approval_UserRole as unknown as ApprovalOutput['approval_UserRole'],
    approval_RoleAuthorize: form.approval_RoleAuthorize,
    approval_SubRoleAuthorize: form.approval_SubRoleAuthorize,
    approval_IsRequireApproval: Number(
      form.approval_IsRequireApproval,
    ) as ApprovalOutput['approval_IsRequireApproval'],
    approval_UserState: (enabled
      ? 1
      : 0) as ApprovalOutput['approval_UserState'],
    approval_PermissionConfig: form.approval_PermissionConfig
      ? { ...form.approval_PermissionConfig }
      : undefined,
  };
}

/**
 * 已选 TenantIds 按当前归属商户范围收窄：返回仍合法的子集。
 * 返回值是新数组（和旧数组长度不同或同 id 顺序有变时需要更新到 form）。
 */
export function pruneTenantIds(
  current: number[],
  allowedOptions: PermCardTenantOption[],
): number[] {
  if (current.length === 0) return current;
  const allow = new Set(allowedOptions.map((o) => Number(o.value)));
  const next = current.filter((id) => allow.has(id));
  return next.length === current.length ? current : next;
}
