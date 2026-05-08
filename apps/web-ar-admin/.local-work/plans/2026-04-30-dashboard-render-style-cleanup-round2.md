---
title: 出款数据看板 Dashboard Render 层样式清理实施计划（第二轮）
type: plan
status: draft
author: codex
owner: cole
created: 2026-04-30
updated: 2026-04-30
audience: human, ai-agent
---

# 出款数据看板 Dashboard Render 层样式清理实施计划（第二轮）

> 本计划对应 `withdrawOrder/dashboard` 第二轮样式治理。第一轮已完成页面壳与模板层 token 适配；本轮只处理 render 层和共享展示层里的视觉硬编码，不扩展到业务逻辑和页面结构重写。

## Goal

- 清理 `withdrawOrder/dashboard` render 层与共享展示层中的硬编码颜色、背景、边框、圆角、阴影。
- 让第二轮范围内的列表列、详情块、三方信息块、审核日志弹窗继续向全局 `--ui-*` token 收口。
- 保持第一轮已稳定的页面结构、模板层布局和现有业务行为不变。

## Non-Goals

- 不在本轮改动查询逻辑、筛选状态、接口参数拼装或弹窗打开链路。
- 不在本轮把所有 `style:` 字符串清零；高频重复布局可保留，优先只清视觉语义。
- 不在本轮重写 `VNode` 结构，不为了“全 Tailwind”强行改造 render 函数。
- 不回头修改第一轮已稳定的 `dashboard/index.vue`、`dashboard.less`、`DashboardPanel.vue`、`StaffPanel.vue`、`OrderPanel.vue` 页面壳与模板层，除非第二轮联动必须补。

## Scope

### 本轮纳入

- `src/views/finance/withdrawOrder/shared.ts`
- `src/views/finance/withdrawOrder/components/ThirdPartyCell.vue`
- `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`
- `src/views/finance/withdrawOrder/dashboard/columns.ts`
- `src/views/finance/withdrawOrder/components/OrderAuditLog.vue`

### 本轮排除

- `src/views/finance/withdrawOrder/dashboard/index.vue`
- `src/views/finance/withdrawOrder/dashboard/dashboard.less`
- `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts`
- `src/views/finance/withdrawOrder/dashboard/orderFilterState.ts`
- `src/views/finance/withdrawOrder/dashboard/staffFilterState.ts`
- `src/views/finance/withdrawOrder/dashboard/orderReassign.ts`
- `src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts`

## Risks

- `shared.ts`、`ThirdPartyCell.vue`、`StaffOrderModal.vue`、`columns.ts` 已有测试直接依赖 `style` 字符串片段，若连布局字符串一起改，很容易引发非必要测试回归。
- `columns.ts` 同时被员工实时状态页和当前提现订单页复用，一处列 render 改动可能联动两张表。
- `OrderAuditLog.vue` 同时包含信息卡样式和表格列 render 样式，若边界不清，容易把视觉治理扩展成字段映射重构。

## 实施顺序

### 1. 建立第二轮改造前基线

- 先跑与第二轮直接相关的测试集，确认当前基线为绿：
  - `thirdPartyCell.spec.ts`
  - `staffOrderModal.spec.ts`
  - `staffColumns.spec.ts`
  - `orderColumns.spec.ts`
  - `columns.spec.ts`
- 保留第一轮的手工视觉基线结论，不重新扩大到全模块截图。

### 2. 第一批：共享 helper 视觉 token 化

修改文件：

- `src/views/finance/withdrawOrder/shared.ts`

改造内容：

- `colTitle`：帮助图标、Tooltip 分隔线、标题高亮、辅助文案色改为 token。
- `renderGrid`：label/value 的灰阶与主文本色改为 token。
- `createDetailRowStyleSet`：详情型 label/value 颜色改为 token。

约束：

- 保留 `flex: 0 0`、`text-align: left` 这类测试依赖布局字符串。
- 不改 helper 函数签名，不改调用方式。

### 3. 第二批：ThirdPartyCell 与 StaffOrderModal 列 render 视觉清理

修改文件：

- `src/views/finance/withdrawOrder/components/ThirdPartyCell.vue`
- `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`

改造内容：

- `ThirdPartyCell.vue`
  - 空态色、详情链接色、footer 区辅助色改为 token。
  - 优先复用 `createDetailRowStyleSet` 的 token 化结果，保持现有对齐结构不变。
- `StaffOrderModal.vue`
  - 成员 ID 蓝色、订单号灰色、空态灰色等列 render 里的硬编码色值改为 token。
  - 只处理列内视觉值，不动列结构和业务请求。

约束：

- 不改 `ThirdPartyRecordModal` 打开链路。
- 不改 `StaffOrderModal` 顶部模板头部，因为第一轮已稳定。

### 4. 第三批：列工厂 render 视觉清理

修改文件：

- `src/views/finance/withdrawOrder/dashboard/columns.ts`

改造内容：

- `renderTenantTags`：容器、tag 内容溢出、辅助结构的视觉值改为 token。
- 员工页/订单页列 render 里的链接色、辅助灰色、空态色、强调色统一走 token。
- 对重复出现的轻量视觉片段优先抽小 helper 或复用 `shared.ts` 能力，避免散落更多字符串。

约束：

- 不大改 `renderGrid` / `renderDetailRows` 的布局协议。
- 不动员工操作列与订单操作列的行为逻辑。

### 5. 第四批：审核日志弹窗视觉清理

修改文件：

- `src/views/finance/withdrawOrder/components/OrderAuditLog.vue`

改造内容：

- 信息卡背景、边框、文本色、accent 色、时区辅助色改为 token。
- `logColumns` 中操作人、动作类型、时间、状态、内容、备注的 render 色值改为 token。

约束：

- 不改 `loadLogData` 字段映射。
- 不改弹窗调用方和接口请求。

### 6. 本轮收口

- 跑完第二轮相关测试集。
- 静态扫描第二轮范围内的 `#hex` / `rgba(...)` 残留。
- 若仍有残留，必须说明是否属于下一轮或业务有意保留，不做“默认忽略”。

## 验证清单

### 改前基线

- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/thirdPartyCell.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffOrderModal.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts
```

### 第一批后

- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts
```

### 第二批后

- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/thirdPartyCell.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffOrderModal.spec.ts
```

### 第三批后

- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts
```

### 第四批后

- [ ] 若有对应单测则一并运行第二轮全集；若无专用单测，则至少跑：

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test
```

### 收尾

- [ ] 静态扫描第二轮文件范围内的硬编码视觉值：

```bash
rg -n -P '#(?:[0-9a-fA-F]{3}){1,2}|rgba\\(' \
  src/views/finance/withdrawOrder/shared.ts \
  src/views/finance/withdrawOrder/components/ThirdPartyCell.vue \
  src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue \
  src/views/finance/withdrawOrder/dashboard/columns.ts \
  src/views/finance/withdrawOrder/components/OrderAuditLog.vue
```

## 止损规则

- 若 `thirdPartyCell.spec.ts` 或 `staffOrderModal.spec.ts` 因为 label 对齐 style 断言大面积变红，立即停止修改布局字符串，只保留颜色 token 化。
- 若 `columns.ts` 的改动开始同时影响员工页和订单页多列结构，先收口到高频 helper（如 `renderTenantTags`），不要继续扩展。
- 若 `OrderAuditLog.vue` 的视觉治理需要牵出字段结构或接口适配调整，本轮停止在样式层，不进入数据层重构。

## 交付标准

- 第二轮范围内的 render 层硬编码视觉值显著减少，并以全局 token 为主。
- 共享 helper 的视觉语义统一，不再继续扩散新的 `#hex` / `rgba(...)`。
- 相关测试保持通过，不因“追求纯 class 写法”引入不必要回归。
- 本轮不扩展到业务逻辑和页面结构重构。
