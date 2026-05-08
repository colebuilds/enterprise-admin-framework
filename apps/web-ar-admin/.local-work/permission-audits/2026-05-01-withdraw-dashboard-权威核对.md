# 出款数据看板权限权威核对

- 日期：2026-05-01
- 模块：`src/views/finance/withdrawOrder/dashboard`
- 结论状态：已拿到真实权限树，完成权威核对

## 真实权限树来源

- 环境：`https://sit-tenantadmin.lottotest6688.com`
- 获取方式：
  1. `POST /api/Login/Login`
  2. `POST /api/Home/GetSysUserInfo`
- 说明：本记录不落账号、密码、token 等敏感信息

## 本次 dashboard 权限子树

- `Finance:WithdrawOrderManage:Dashboard` `menuType=2`
- `Finance:WithdrawOrderManage:Dashboard:Remote` `menuType=2`
  - `Finance:WithdrawOrderManage:Dashboard:Remote:GetPageList` `menuType=3`
  - `Finance:WithdrawOrderManage:Dashboard:Remote:OperateAction` `menuType=3`
- `Finance:WithdrawOrderManage:Dashboard:RealTimeState` `menuType=2`
  - `Finance:WithdrawOrderManage:Dashboard:RealTimeState:GetPageList` `menuType=3`
  - `Finance:WithdrawOrderManage:Dashboard:RealTimeState:OperateAction` `menuType=3`
- `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder` `menuType=2`
  - `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder:GetPageList` `menuType=3`
  - `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder:OperateAction` `menuType=3`

## 页面交互点盘点

- 提现订单管理页顶层 `dashboard` Tab 可见性
- dashboard 内顶层三子 Tab：
  - 远程出款数据看板
  - 员工实时状态
  - 当前提现订单
- 远程出款数据看板：
  - 商户筛选
  - 查询 / 重置
  - 手动刷新 / 自动刷新
  - 员工状态卡跳转
  - 订单状态卡跳转
  - 今日订单卡跳转到提现记录
- 员工实时状态：
  - 商户 / 账号 / 状态筛选
  - 查询 / 重置 / 刷新
  - 查看订单
  - 开始派单
  - 停止派单
  - 解除异常
- 当前提现订单：
  - 查询条件
  - 查询 / 重置
  - 批量转派
  - 行内转派
  - 订单审核日志

## 已确认问题

### 1. dashboard 根上下文会越权预加载远程统计

- 文件：
  - `src/views/finance/withdrawOrder/index.vue`
  - `src/views/finance/withdrawOrder/dashboard/index.vue`
  - `src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts`
- 现状：
  - `dashboard` 顶层 Tab 只要命中任一子面板 `GetPageList` 就可见
  - dashboard 根组件挂载时会无条件执行 `refreshDashboardStats()`
  - `refreshDashboardStats()` 直接请求 `getDashboardData`
- 结果：
  - 若用户只有 `RealTimeState:GetPageList` 或 `CurrentWithdrawOrder:GetPageList`
  - 进入 dashboard 时仍会先打远程看板统计接口
  - 这与真实权限树把 `Remote` 作为独立子页面的定义不一致

### 2. menuType 2 页面层权限码未被消费

- 文件：
  - `src/views/finance/withdrawOrder/dashboard/permissions.ts`
  - `src/views/finance/withdrawOrder/dashboard/index.vue`
  - `src/views/finance/withdrawOrder/index.vue`
- 现状：
  - 本地常量只建了 `GetPageList / OperateAction`
  - 真实权限树里的以下 `menuType=2` 节点本地都没有消费：
    - `Finance:WithdrawOrderManage:Dashboard`
    - `Finance:WithdrawOrderManage:Dashboard:Remote`
    - `Finance:WithdrawOrderManage:Dashboard:RealTimeState`
    - `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder`
- 结果：
  - 当前实现把“页面可见性”和“查询列表权限”混成一层
  - 后续只要后台继续按 `menuType=2 -> 页面`、`menuType=3 -> 按钮/查询` 演进，前端会持续错层

## 当前已对齐的点

- 员工实时状态 `OperateAction` 已同时用于：
  - 操作列显隐
  - handler 二次兜底
- 当前提现订单 `OperateAction` 已同时用于：
  - 批量转派按钮显隐
  - 行内转派 / 日志入口显隐
  - handler 二次兜底

## 范围说明

- 本记录当前结论仅覆盖 `src/views/finance/withdrawOrder/dashboard`
- `dashboard -> records` 的跨 Tab 跳转权限问题不计入本次页面核对主结论

## 建议修复顺序

1. 先修 dashboard 根上下文的远程统计预加载
2. 再决定是否要把 `menuType=2` 页面层权限补进 dashboard 可见性控制
3. 最后再看是否需要把 `GetPageList` 收敛为纯查询权限
