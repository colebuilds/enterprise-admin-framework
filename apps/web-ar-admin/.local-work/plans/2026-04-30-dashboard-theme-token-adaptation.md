---
title: 出款数据看板 Dashboard 主题 Token 适配实施计划
type: plan
status: draft
author: codex
owner: cole
created: 2026-04-30
updated: 2026-04-30
audience: human, ai-agent
---

# 出款数据看板 Dashboard 主题 Token 适配实施计划

> 本计划对应 `withdrawOrder/dashboard` 第一轮主题适配实施，不覆盖整个 `withdrawOrder` 模块，也不包含第二轮 render 层样式清理。

## Goal

- 让 `src/views/finance/withdrawOrder/dashboard/` 主视觉层接入全局主题 token。
- 保持现有 `wdb__*` 结构类与页面行为稳定，避免把本轮改造扩大成样式体系重写。

## Non-Goals

- 不在本轮改造整个 `withdrawOrder` 模块。
- 不在本轮把所有自定义类改为 Tailwind。
- 不在本轮大规模重写 `render/h()` 内联布局样式。
- 不在本轮进入 `columns.ts`、`shared.ts`、`ThirdPartyCell.vue`、`OrderAuditLog.vue` 的共享渲染层治理。
- 不改动业务接口、筛选逻辑、弹窗流程与权限逻辑。

## Scope

### 本轮纳入

- `src/views/finance/withdrawOrder/dashboard/index.vue`
- `src/views/finance/withdrawOrder/dashboard/dashboard.less`
- `src/views/finance/withdrawOrder/dashboard/components/StatCard.vue`
- `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`

### 本轮排除

- `src/views/finance/withdrawOrder/dashboard/columns.ts`
- `src/views/finance/withdrawOrder/shared.ts`
- `src/views/finance/withdrawOrder/components/ThirdPartyCell.vue`
- `src/views/finance/withdrawOrder/components/OrderAuditLog.vue`

## Risks

- `dashboard` 现有问题主要集中在外壳与模板层，但共享 render 层测试已经对 `style` 字符串有断言，若本轮下探过深，回归面会明显扩大。
- `StaffPanel.vue` 与 `OrderPanel.vue` 搜索区含较多 `width/flex/min-width` 内联样式，抽取过度容易出现输入框挤压、按钮换行异常。
- `StaffOrderModal.vue` 同时包含模板头部样式与列表列 render 样式，边界不清时容易误伤 `columns.ts`。

## 实施顺序

### 1. 建立改造前基线

- 记录以下场景的改造前截图或人工留档：
  - `/finance/withdrawOrder?tab=dashboard&sub=dashboard`
  - `/finance/withdrawOrder?tab=dashboard&sub=staff`
  - `/finance/withdrawOrder?tab=dashboard&sub=orders`
  - `StaffOrderModal` 打开态
- 先跑 dashboard 相关单测，确认改前基线是绿的。

### 2. 第一批：外壳 Token 化

修改文件：

- `src/views/finance/withdrawOrder/dashboard/index.vue`
- `src/views/finance/withdrawOrder/dashboard/dashboard.less`
- `src/views/finance/withdrawOrder/dashboard/components/StatCard.vue`

改造内容：

- tab 边框、激活态颜色
- section/card 背景、边框、圆角、阴影
- 标题强调线
- divider
- 主/次/辅助文本色
- card hover 边框与阴影
- 统计卡 dot / icon / value 色

约束：

- 保留 `wdb__*` 结构类。
- 不改 DOM 结构。
- 不改 render 层。

### 3. 第二批：主面板模板层收口

修改文件：

- `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue`
- `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`

改造内容：

- 模板里的视觉型 inline style 改 token 或 Tailwind。
- 对明显安全的 `width/flex/min-width` 重复写法，收成局部 class 或 Tailwind。
- 统一搜索区、toolbar、辅助文字、分隔符的主题语义。

约束：

- 不动请求参数构造。
- 不动 filter 状态逻辑。
- 不动 modal create 链路。
- 不重写表格列 render。

### 4. 第三批：Staff Modal 模板视觉

修改文件：

- `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`

改造内容：

- 标题区
- account 标签底色与文字色
- 辅助说明文本
- 底部按钮区

约束：

- 不下探 `columns.ts`
- 不调整时间/时长详情布局 helper

### 5. 本轮收口

- 本轮到此停止，不进入共享 render 层。
- 若第一轮验证通过，再单独开第二轮治理：
  - `dashboard/columns.ts`
  - `shared.ts`
  - `components/ThirdPartyCell.vue`
  - `components/OrderAuditLog.vue`

## 验证清单

### 改前基线

- [ ] 记录 `dashboard / staff / orders / StaffOrderModal` 四个场景基线
- [ ] 运行 dashboard 测试集确认改前为绿

### 第一批后

- [ ] 打开 `?tab=dashboard&sub=dashboard`
- [ ] 检查 tab 激活态、card 背景、divider、title 强调线
- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts
```

### 第二批后

- [ ] 打开 `?tab=dashboard&sub=staff`
- [ ] 打开 `?tab=dashboard&sub=orders`
- [ ] 检查搜索区输入框宽度、按钮换行、toolbar 对齐
- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/orderPanel.spec.ts
```

### 第三批后

- [ ] 打开 `StaffOrderModal`
- [ ] 检查标题区、账号 tag、底部关闭按钮区
- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/staffOrderModal.spec.ts
```

### 收尾

- [ ] 运行：

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test
```

- [ ] 回看四个核心场景：
  - `dashboard`
  - `staff`
  - `orders`
  - `StaffOrderModal`

## 止损规则

- 若第二批开始出现搜索区挤压、按钮换行异常，立即停止抽样式，只保留颜色 token 替换。
- 若测试开始大量因 `style` 断言失败，说明触到了 render 层边界，本轮不再继续下探。
- 若 `StaffOrderModal` 调整牵出列布局变形，本轮只保留模板头部视觉调整，不进入 `columns.ts`。

## 交付标准

- 主容器、卡片、标题、divider、辅助文字改为由全局 token 驱动。
- 页面结构、tab 切换、筛选与 modal 行为保持稳定。
- 本轮不新增新的硬编码视觉色值。
- 本轮不扩大到共享 render 层重构。
