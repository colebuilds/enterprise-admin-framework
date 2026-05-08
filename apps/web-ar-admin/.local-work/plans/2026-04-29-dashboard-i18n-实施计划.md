# 出款数据看板 i18n 实施计划

日期：2026-04-29范围：`src/views/finance/withdrawOrder/dashboard/**` 及其直接复用的出款订单共享弹窗/共享单元格前置依据：

- `documents/standards/coding/FE-STD-008-国际化与字典边界规范.md`
- `documents/guides/development/国际化接入与运行时机制说明.md`

## 1. 目标

在不改动旧 `docs/project-guide.md`、`docs/page-development-guide.md` 的前提下，为出款数据看板模块完成正式国际化接入，并保持以下约束：

- 不再新增页面中文硬编码作为正式来源
- 优先复用 `finance.withdrawOrder.*` 已有 key，不重复建词
- 明确区分本地 locale、后端字典、fallback 的职责
- 保持切语言后无刷新生效
- 不破坏当前 dashboard 三个子模块和弹窗链路的行为与测试

## 2. 范围拆分

### 2.1 三个子模块

1. `DashboardPanel.vue`
2. `StaffPanel.vue`
3. `OrderPanel.vue`

### 2.2 dashboard 内部弹窗

1. `StaffOrderModal.vue`

### 2.3 dashboard 直接依赖的共享弹窗 / 共享单元格

1. `TransferOrderModal.vue`
2. `OrderAuditLog.vue`
3. `ThirdPartyCell.vue`
4. `ThirdPartyRecordModal.vue`

### 2.4 dashboard 共享 TS 与配置层

1. `useDashboardPage.ts`
2. `columns.ts`
3. `statusConfig.ts`
4. `orderReassign.ts`
5. `currentOrderTime.ts`
6. `dictAdapter.ts`
7. `dictConfig.ts`
8. `orderFilterState.ts`
9. `staffFilterState.ts`
10. `timezoneResolver.ts`
11. `useDashboardContext.ts`
12. `useTenantUserScope.ts`

### 2.5 本轮明确不做

1. 不扩到 `records / workbench / report` 全模块
2. 不重构后端字典接口
3. 不改动全局 i18n 运行时设计
4. 不把测试全部重写成新风格，只做与本轮改动直接相关的最小调整

## 3. 当前现状判断

### 3.1 已经国际化较完整的部分

1. `TransferOrderModal.vue`
2. `OrderAuditLog.vue` 的大部分静态字段
3. `ThirdPartyRecordModal.vue` 的大部分表头和按钮
4. `ThirdPartyCell.vue` 的字段 label 与弹窗标题

这些文件需要重点检查剩余中文映射和状态文案，不需要推倒重做。

### 3.2 仍以中文硬编码为主的部分

1. `DashboardPanel.vue`
2. `StaffPanel.vue`
3. `OrderPanel.vue`
4. `StaffOrderModal.vue`
5. `useDashboardPage.ts`
6. `columns.ts`
7. `statusConfig.ts`
8. `orderReassign.ts`

这批是本轮主要实施对象。

### 3.3 边界最敏感的部分

1. `statusConfig.ts`
   - 混合了本地状态按钮、tag、解析逻辑
   - 必须先区分哪些状态 label 该走字典，哪些是页面本地语义

2. `columns.ts`
   - 同时包含表头、tooltip、列内 label、按钮文案
   - 需要避免一边改 i18n，一边破坏现有配置结构

3. `useDashboardPage.ts`
   - 统计卡片结构里同时有 `cardKey`、`presetStates`、`label`、`tooltip`
   - 只能把展示文案国际化，不能把稳定语义 key 也做丢

4. `StaffOrderModal.vue`
   - 有大量表头、列内 label、按钮文案
   - 同时涉及时区标题和第三方详情共享单元格

## 4. key 设计策略

### 4.1 复用优先

优先复用已有：

- `finance.withdrawOrder.merchant`
- `finance.withdrawOrder.memberId`
- `finance.withdrawOrder.orderNo`
- `finance.withdrawOrder.withdrawCategory`
- `finance.withdrawOrder.currency`
- `finance.withdrawOrder.actualAmount`
- `finance.withdrawOrder.orderTime`
- `finance.withdrawOrder.thirdPartyDetail`
- `finance.withdrawOrder.operator`
- `finance.withdrawOrder.common.*`
- `finance.withdrawOrder.workbench.columnLabels.*`

### 4.2 新增 key 的归属

只新增 `dashboard` 独有语义到：

- `finance.withdrawOrder.dashboard.*`

建议分层：

1. `finance.withdrawOrder.dashboard.topTabs.*`
2. `finance.withdrawOrder.dashboard.filters.*`
3. `finance.withdrawOrder.dashboard.actions.*`
4. `finance.withdrawOrder.dashboard.cards.*`
5. `finance.withdrawOrder.dashboard.columns.*`
6. `finance.withdrawOrder.dashboard.tooltips.*`
7. `finance.withdrawOrder.dashboard.messages.*`
8. `finance.withdrawOrder.dashboard.staffModal.*`

### 4.3 明确不新增的低质量 key

1. `dashboard.text1`
2. `dashboard.btn1`
3. `dashboard.card1`
4. 以实现位置、序号、A/B/C 作为语义的 key

## 5. 字典 / locale / fallback 决策

### 5.1 继续走 locale 的

1. 面板标题
2. 查询/重置/批量转派等按钮
3. 表头
4. tooltip
5. 弹窗标题
6. 成功/失败提示语
7. 本地说明性文本

### 5.2 优先走字典的

1. `withdrawWorkStateList`
2. `withdrawWorkProcessStateList`
3. `currencyList`
4. `withdrawCategoryList`
5. 已存在全局来源的状态与选项 label

### 5.3 只保留为 fallback 的

1. `--`
2. 字典缺失时回退到原始值
3. 明确标注为临时兜底的本地状态映射

## 6. 技术接入策略

### 6.1 `.vue` 文件

统一使用 `useI18n()`，并通过：

- `computed`
- `reactive`
- 或 render 时生成

来保证切语言后无刷新更新。

### 6.2 纯 TS 文件

按三类处理：

1. 能留在组件层 `computed` 的，不在纯 TS 内翻译
2. 需要共享配置生成的，优先把 `t` 作为参数传入工厂函数
3. 必须在共享模块内读翻译时，只能在运行时函数内读取，不允许模块顶层静态求值

### 6.3 现有高风险文件

1. `columns.ts`
2. `statusConfig.ts`
3. `useDashboardPage.ts`
4. `orderReassign.ts`

这些文件在实现时必须先统一“怎么取 t”，再做实际文案迁移。

## 7. 分批实施

### 第 1 批：locale 资源与 key 设计

目标：

- 完成 `finance.json` 的 key 盘点与补齐
- 明确哪些复用、哪些新增

动作：

1. 盘点 `finance.withdrawOrder.*` 现有可复用 key
2. 为 dashboard 独有文案补 `zh/en` 对称 key
3. 不改业务代码，只先把资源准备完整

产物：

- `src/i18n/locales/zh/finance.json`
- `src/i18n/locales/en/finance.json`

### 第 2 批：三个子模块组件层

目标：

- 先把页面最直观的中文硬编码替换为 `t()`

对象：

1. `DashboardPanel.vue`
2. `StaffPanel.vue`
3. `OrderPanel.vue`

重点：

1. 搜索区域 label / placeholder
2. 按钮文案
3. 面板标题
4. 弹窗确认文案入口

### 第 3 批：dashboard 内部弹窗

目标：

- 收口 `StaffOrderModal.vue`

重点：

1. 表头
2. 列内 label
3. 按钮
4. UTC 标题文本

### 第 4 批：共享 TS 与配置层

目标：

- 让 `useDashboardPage.ts`、`columns.ts`、`statusConfig.ts`、`orderReassign.ts` 正式走 i18n

重点：

1. 卡片 label / tooltip
2. 列标题 / tooltip / 行内 label
3. 状态按钮与 tag 文案
4. 校验提示语

### 第 5 批：共享弹窗 / 共享单元格收口

对象：

1. `TransferOrderModal.vue`
2. `OrderAuditLog.vue`
3. `ThirdPartyCell.vue`
4. `ThirdPartyRecordModal.vue`

目标：

- 只补剩余未收口的中文点，不重复推翻已完成的 i18n 结构

### 第 6 批：测试与校验

目标：

- 保证 locale key、组件渲染和纯 TS 配置都可验证

动作：

1. 调整受影响的 spec
2. 统一 mount 时的 i18n 注入或 `t` stub
3. 运行 `pnpm i18n:check`
4. 运行 dashboard 定向测试

## 8. 风险点

1. 后端字典是否随语言切换变化，不由前端 `t()` 自动解决
2. `statusConfig.ts` 可能混有“应走字典”和“应走 locale”的两类状态
3. `columns.ts` 若在模块顶层静态求值，会直接破坏无刷新切语言
4. 测试当前大量直接断言中文，需要同步调整
5. 共享弹窗若改动过深，容易把 `records / workbench / report` 一并带入

## 9. 验收标准

1. dashboard 三个子模块和直接相关弹窗不再依赖中文硬编码作为正式文案来源
2. 新增 key 符合 `finance.withdrawOrder.*` 语义分层，不出现 `text1 / btn1` 之类低质量 key
3. 已有字典状态未被重复建本地 locale 来源
4. 切语言后页面关键文案无需刷新即可更新
5. `pnpm i18n:check` 通过
6. dashboard 定向测试通过

## 10. 建议执行顺序

1. 先 review 本计划
2. 再执行第 1 批资源补齐
3. 之后按组件层 → 弹窗层 → TS 配置层 → 测试层推进

不建议一口气全改，因为：

- key 结构若先没定住，后面会来回返工
- 纯 TS 模块接法若先没统一，容易一半 `useI18n`、一半顶层 `i18n.global.t`
