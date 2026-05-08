# 出款数据看板模块权限静态预审

## 1. 基本信息

- 执行模式：`静态预审`
- 模块范围：`src/views/finance/withdrawOrder/dashboard`
- 关联入口：
  - `src/views/finance/withdrawOrder/index.vue`
  - `src/views/finance/withdrawOrder/dashboard/index.vue`
  - `src/router/modules/finance.ts`
- 结论强度说明：
  - 本次只有代码和用户提供的异常截图
  - 没有真实权限树返回体，也没有后台角色勾选原始数据
  - 因此本文档中的问题点只允许标记为“疑似漏接 / 疑似错接 / 疑似部分接”，不能直接定性为最终缺陷

## 2. 预审目标

本次预审只回答两件事：

1. `dashboard` 模块当前已经消费了哪些权限入口
2. `dashboard` 模块里哪些交互点疑似没有把细粒度权限消费完整

不回答以下问题：

- 后端菜单树里最终是否真的存在某个具体权限码
- 某个操作应该归到“查询列表”“操作”“日志”中的哪一个子权限
- 最终应该隐藏、禁用，还是仅依赖接口拦截

这些都需要后续进入“权威核对”再确认。

## 3. 当前已确认的权限消费入口

### 3.1 模块路由入口

`withdrawOrder` 模块路由在 `src/router/modules/finance.ts` 中声明了：

- `Finance:WithdrawOrderManage`
- `Finance:WithdrawOrderManage:WithdrawRecord:GetPageList`

这说明整个出款订单模块的最外层入口已经接了路由权限，但这一层不能代表 `dashboard` 子面板内部的按钮、操作列和批量操作都已经接上。

### 3.2 withdrawOrder 一级 Tab 入口

`src/views/finance/withdrawOrder/index.vue` 已对一级 tab 做了权限过滤：

- `dashboard`
  - `Finance:WithdrawOrderManage:Dashboard:Remote:GetPageList`
  - `Finance:WithdrawOrderManage:Dashboard:RealTimeState:GetPageList`
  - `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder:GetPageList`
- `dispatch`
  - `Finance:WithdrawOrderManage:GroupConfig:GetPageList`
- `report`
  - `Finance:WithdrawOrderManage:EmployeeReport:GetPageList`
- `records`
  - `Finance:WithdrawOrderManage:WithdrawRecord:GetPageList`

这层已经明确：`dashboard` 页签的可见性，是用三个 `GetPageList` 类权限的 OR 关系控制。

### 3.3 dashboard 二级 Top Tab 入口

`src/views/finance/withdrawOrder/dashboard/index.vue` 已对三个子面板做了权限过滤：

- `dashboard`
  - `Finance:WithdrawOrderManage:Dashboard:Remote:GetPageList`
- `staff`
  - `Finance:WithdrawOrderManage:Dashboard:RealTimeState:GetPageList`
- `orders`
  - `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder:GetPageList`

当前已确认：

- `dashboard` 模块已经消费了“页面 / 子面板可见性”这一层权限
- 当前没有看到在 `dashboard/index.vue` 层再继续消费按钮级、操作级或日志级子权限

## 4. 交互点盘点

### 4.1 远程出款数据面板 `DashboardPanel`

已看到的交互点：

- 商户筛选
- 查询
- 重置
- 手动刷新
- 员工状态卡片点击跳转
- 订单状态卡片点击跳转
- 今日订单卡片点击跳转

当前代码现状：

- 这部分交互没有看到 `v-permission`
- 没有看到 `hasPermission`
- 没有看到基于权限的卡片过滤

静态预审判断：

- 目前只能确认它完全依赖 top tab 的 `GetPageList` 入口权限
- 若后端菜单树里还有更细的“查询”“刷新”“跳转”类权限，这里属于疑似未接

### 4.2 员工实时状态面板 `StaffPanel`

已看到的交互点：

- 商户筛选
- 账号筛选
- 查询
- 重置
- 手动刷新
- 行操作：查看订单
- 行操作：开始派单
- 行操作：停止派单
- 行操作：解除异常

当前代码现状：

- 页面顶部筛选和按钮没有看到额外权限消费
- 行操作按钮是否显示由 `createStaffColumns + resolveStaffActions` 根据行状态控制
- 没有看到对这些动作使用 `auth`、`v-permission` 或 `hasPermission`
- `handleStopAssign / handleStartAssign / handleReleaseAnomaly` 最终会直接走接口调用，也没有看到权限兜底

静态预审判断：

- “查看订单 / 开始派单 / 停止派单 / 解除异常”属于明显的高风险动作
- 如果真实权限树里对员工实时状态存在“操作”类子权限，这里是疑似漏接点
- 即使后续 UI 层补了权限，这三个 handler 仍建议在实现上增加二次兜底

### 4.3 当前提现订单面板 `OrderPanel`

已看到的交互点：

- 商户筛选
- 会员 ID
- 订单号
- 提现大类
- 提现金额区间
- 申请时间
- 更新时间
- 币种
- 查询
- 重置
- 批量转派
- 状态筛选 tabs
- 表格操作：转派
- 表格操作：订单审核日志

当前代码现状：

- 顶部 `查询`、`重置`、`批量转派` 没有看到独立权限消费
- `createOrderColumns` 的操作列直接渲染 `转派` 和 `订单审核日志`
- 操作列没有 `auth`
- 没有看到基于权限的操作列裁剪

静态预审判断：

- `批量转派` 和 `转派` 明显属于高风险动作，是当前模块最强的疑似漏接点
- `订单审核日志` 至少没有接独立子权限；它最终应归到“查询列表”“日志”还是“操作”，需要真实权限树再确认
- 从用户截图看，`当前提现订单` 下疑似存在“查询列表 / 操作”两个子权限位，当前前端未体现这层细分

## 5. 模块权限码清单

### 5.1 已确认存在于代码中的权限码

- `Finance:WithdrawOrderManage`
- `Finance:WithdrawOrderManage:WithdrawRecord:GetPageList`
- `Finance:WithdrawOrderManage:Dashboard:Remote:GetPageList`
- `Finance:WithdrawOrderManage:Dashboard:RealTimeState:GetPageList`
- `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder:GetPageList`

### 5.2 仅能推断、尚未确认的权限位

以下权限位不是从代码里确认出来的，而是基于页面形态和用户截图做的推断：

- `Dashboard:Remote` 下疑似存在查询 / 刷新 / 跳转类子权限
- `Dashboard:RealTimeState` 下疑似存在操作类子权限
- `Dashboard:CurrentWithdrawOrder` 下疑似存在至少“查询列表”“操作”两类子权限
- `订单审核日志` 是否还有单独“日志”类子权限，当前无法确认

## 6. 权限消费映射表

| 区域 | 交互点 | 推断权限位 | 当前消费方式 | 当前表现 | 静态预审结论 |
| --- | --- | --- | --- | --- | --- |
| dashboard 顶层 | `dashboard/staff/orders` top tab | 已确认三个 `GetPageList` | `hasPermission` | 已按权限显示/隐藏 | 已接 |
| DashboardPanel | 查询 / 重置 / 手动刷新 | 疑似查询或刷新类子权限 | 未见独立消费 | 依赖 top tab 可见性 | 疑似部分接 |
| DashboardPanel | 卡片点击跳转 | 疑似跳转或查询类子权限 | 未见独立消费 | 依赖 top tab 可见性 | 疑似部分接 |
| StaffPanel | 查询 / 重置 / 手动刷新 | 疑似查询类子权限 | 未见独立消费 | 依赖 top tab 可见性 | 疑似部分接 |
| StaffPanel | 查看订单 | 疑似操作或详情类子权限 | 未见独立消费 | 由行状态决定显示 | 疑似漏接 |
| StaffPanel | 开始派单 / 停止派单 / 解除异常 | 疑似操作类子权限 | 未见独立消费 | 由行状态决定显示 | 疑似漏接 |
| StaffPanel | 开始派单 / 停止派单 / 解除异常 handler | 疑似操作类子权限 | 未见二次校验 | 直接调接口 | 疑似缺少兜底 |
| OrderPanel | 查询 / 重置 | 疑似查询列表权限 | 未见独立消费 | 依赖 top tab 可见性 | 疑似部分接 |
| OrderPanel | 批量转派 | 疑似操作类子权限 | 未见独立消费 | 始终显示 | 疑似漏接 |
| OrderPanel | 操作列 `转派` | 疑似操作类子权限 | 未见 `auth` | 始终显示 | 疑似漏接 |
| OrderPanel | 操作列 `订单审核日志` | 疑似日志或操作类子权限 | 未见 `auth` | 始终显示 | 疑似漏接 |

## 7. 与用户截图对应的问题理解

结合当前代码和截图，本次静态预审对截图问题的理解如下：

1. 用户账号能够看到 `当前提现订单` top tab
   - 这与 `dashboard/index.vue` 里只校验 `Finance:WithdrawOrderManage:Dashboard:CurrentWithdrawOrder:GetPageList` 一致
2. 截图里后台权限树疑似把 `当前提现订单` 继续拆成了“查询列表”和“操作”
3. 当前前端只消费了 top tab 可见性这层权限，没有把“操作”这层细粒度权限接到：
   - `批量转派`
   - 行操作 `转派`
   - 行操作 `订单审核日志`

因此，截图暴露的问题在静态预审口径下，应描述为：

- `dashboard` 模块当前只接了 `GetPageList` 层级权限
- `当前提现订单` 面板下的操作入口疑似没有继续消费更细的子权限
- 这属于“疑似部分接 + 疑似漏接”并存的问题

## 8. 建议进入权威核对时补齐的前置数据

要把这份静态预审升级成最终问题单，至少还需要：

1. 当前账号对应的真实 `menus/authCode/menuType/children` 返回体
2. 后台权限树里 `Dashboard -> Remote / RealTimeState / CurrentWithdrawOrder` 的原始节点结构
3. 截图里“查询列表 / 操作”的真实 `authCode`
4. 如有需要，再补一组有限权限账号做页面行为验证

## 9. 后续修复建议

在没有真实权限树之前，只建议先准备修复位，不建议直接拍脑袋绑定权限码。

推荐修复顺序：

1. 先拿真实权限树，把 `dashboard` 三个子面板的子权限位盘清
2. 优先修 `OrderPanel`
   - `批量转派`
   - 操作列 `转派`
   - 操作列 `订单审核日志`
3. 再修 `StaffPanel`
   - 行操作按钮
   - handler 二次兜底
4. 最后判断 `DashboardPanel` 是否需要继续细分刷新 / 跳转类权限

## 10. 本次预审的剩余风险

- 没有真实权限树，无法确认“日志”到底是不是独立权限位
- 没有有限权限账号，无法验证 UI 表现是否和截图完全一致
- `dashboard/test/**/*.spec.ts` 当前没有搜索到明显的权限消费覆盖，后续若实施修复，建议补最少一组权限相关单测
