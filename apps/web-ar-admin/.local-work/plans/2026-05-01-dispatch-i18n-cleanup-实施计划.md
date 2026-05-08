---
title: 出款组别配置 dispatch 多语言与固定语种清理实施计划
type: plan
status: draft
author: codex
owner: cole
created: 2026-05-01
updated: 2026-05-01
audience: human, ai-agent
---

# 出款组别配置 dispatch 多语言与固定语种清理实施计划

> 本计划只覆盖 `src/views/finance/withdrawOrder/dispatch/` 及其直接使用的 `finance` locale 资源，不扩散到 `withdrawOrder` 其他 tab。

## Goal

- 保留 `DEFAULT_LANGUAGE_OPTIONS` 的固定语种 code 集合，不再依赖全局字典。
- 让固定语种的 `label` 支持多语言，不再在模块内写死中文。
- 去掉 `createLanguageOptions()` 这层已经无业务意义的包装。
- 清理 `dispatch` 模块与 locale 中已确认未使用的 key、映射和测试残留。

## Non-Goals

- 不改动 `src/api/**` 或任何后端接口字段。
- 不改动 `orderDispatchModeList` 的字典来源与解析方式。
- 不处理 `DEFAULT_RULE_TEXTS` 这批默认业务内容的归档方式。
- 不治理 `withdrawOrder/dashboard`、`records`、`report`、`workbench` 等其他 tab。
- 不做跨模块抽象，不新增全局语言工具。

## Scope

### 纳入本轮

- `src/views/finance/withdrawOrder/dispatch/form.ts`
- `src/views/finance/withdrawOrder/dispatch/useDispatchPage.ts`
- `src/views/finance/withdrawOrder/dispatch/components/DispatchGroupEditModal.vue`
- `src/views/finance/withdrawOrder/dispatch/test/form.spec.ts`
- `src/views/finance/withdrawOrder/dispatch/test/useDispatchPage.spec.ts`
- `src/i18n/locales/zh/finance.json`
- `src/i18n/locales/en/finance.json`
- `src/i18n/locales/id/finance.json`
- `src/i18n/locales/vi/finance.json`

### 明确排除

- `src/api/**`
- `src/views/finance/withdrawOrder/**` 中除 `dispatch` 之外的目录
- 默认规则文案 `DEFAULT_RULE_TEXTS` 的内容来源治理
- 登录态页面人工验证链路

## 当前现状

### 1. 固定语种集合

`dispatch/form.ts` 中的 `DEFAULT_LANGUAGE_OPTIONS` 当前同时承载了：

1. 固定语种 code
2. 固定语种显示 label

其中 code 写死符合需求，但 label 仍然是中文常量，导致后台切换语言时，规则配置页签仍显示中文。

### 2. 无效包装函数

`createLanguageOptions()` 当前无论传什么参数都只返回固定默认值；页面侧 `useDispatchPage()` 也已经直接传 `undefined`。这说明该函数只剩“保留旧接口形状”的作用，没有实际业务价值。

### 3. 已确认未使用的 locale / 代码映射

当前已确认可进入清理候选的内容：

- `finance.withdrawOrder.dispatch.dispatchModeTimeRandom`
- `finance.withdrawOrder.dispatch.creator`
- `finance.withdrawOrder.dispatch.edit`
- `finance.withdrawOrder.dispatch.delete`
- `finance.withdrawOrder.dispatch.rules`
- `finance.withdrawOrder.dispatch.memberLevelConfigLink`
- `finance.withdrawOrder.dispatch.memberLevelConfigUnavailable`
- `finance.withdrawOrder.dispatch.timeoutAlertRule`
- `finance.withdrawOrder.dispatch.poolWarning`
- `finance.withdrawOrder.dispatch.warningInterval`
- `createDispatchGroupLabels()` 中对应的死映射字段

> 注意：本轮只清理已经在 `dispatch` 页面中确认不再消费的 key；若后续恢复相关 UI，再按新职责重新建 key。

## 风险

1. 固定语种 label 一旦接入 i18n，现有测试中大量中文常量断言需要同步调整，否则会出现“实现正确、测试仍锁旧行为”的假失败。
2. 清理 locale key 时若误判范围，可能删掉未来准备接回的文案入口。
3. 当前显式存在的 `finance` locale 文件为 `zh/en/id/vi`，新增语种 label key 时需要四套同步，否则会出现运行时缺 key。

## 实施方案

### 方案选择

采用最小改动方案：

1. 保留固定 code 列表
2. 将固定语种 `label` 改为通过 `t()` 生成
3. 删除 `createLanguageOptions()` 包装
4. 清理已确认未使用的 key 与死映射

不采用“抽公共语言 helper”方案，避免把本轮小范围清理扩成跨模块改造。

## 目标 key 设计

固定语种 label 建议落到模块本地 key：

- `finance.withdrawOrder.dispatch.languageLabels.en`
- `finance.withdrawOrder.dispatch.languageLabels.vi`
- `finance.withdrawOrder.dispatch.languageLabels.my`
- `finance.withdrawOrder.dispatch.languageLabels.ph`
- `finance.withdrawOrder.dispatch.languageLabels.zh`

这样可以满足：

- `dispatch` 模块内部闭环
- 不依赖平台字典
- 后续若该模块有独立语言展示需求，改动边界清晰

## 实施步骤

### 第 1 步：建立测试基线

- [ ] 补或调整 `form.spec.ts`，让固定语种 `label` 断言不再依赖中文硬编码行为。
- [ ] 补或调整 `useDispatchPage.spec.ts`，锁住页面打开弹窗时直接使用固定语种 options 的行为。
- [ ] 先运行相关单测，确认改前失败点准确反映目标变化。

### 第 2 步：补齐 locale 资源

- [ ] 在 `zh/en/id/vi` 四套 `finance.json` 的 `dispatch` 下新增 `languageLabels`。
- [ ] 保持四套 key 完全对称。
- [ ] 不新增新的公共命名空间，只在 `dispatch` 模块下落 key。

### 第 3 步：重构固定语种 options 生成方式

- [ ] 将 `DEFAULT_LANGUAGE_OPTIONS` 从“完整 `{ value, label }` 列表”调整为更贴近语义的固定 code 集合或基于 code 的静态描述。
- [ ] 在 `form.ts` 中新增一个通过 `t()` 生成 `DispatchLanguageOption[]` 的工厂函数。
- [ ] 删除 `createLanguageOptions()` 及其无意义的入参兼容逻辑。
- [ ] 保留 `getDefaultLanguageOptions()` 的必要性判断：若只剩简单转发，也一并收敛或重命名。

### 第 4 步：页面接入新工厂

- [ ] `useDispatchPage.ts` 改为直接调用新的固定语种 options 工厂。
- [ ] 确保 `DispatchGroupEditModal.vue` 不需要额外兼容逻辑，只消费 `langOptions` 最终结果。

### 第 5 步：清理死映射与未使用 key

- [ ] 删除 `createDispatchGroupLabels()` 中已确认未使用的 `poolWarning` / `warningInterval` 映射。
- [ ] 清理 `dispatch` locale 中已确认未使用的 key：
  - [ ] `dispatchModeTimeRandom`
  - [ ] `creator`
  - [ ] `edit`
  - [ ] `delete`
  - [ ] `rules`
  - [ ] `memberLevelConfigLink`
  - [ ] `memberLevelConfigUnavailable`
  - [ ] `timeoutAlertRule`
  - [ ] `poolWarning`
  - [ ] `warningInterval`
- [ ] 同步移除测试中仅用于验证这些遗留 key 的旧断言。

### 第 6 步：测试收口

- [ ] 更新 `form.spec.ts` 中固定语种 options 的期望值。
- [ ] 更新 `useDispatchPage.spec.ts` 中弹窗 props 的固定语种断言。
- [ ] 保持 `dispatchMode` 继续通过 `orderDispatchModeList` 解析，不回退到本地模块文案。

## 验证清单

### 单测

- [ ] `pnpm test:unit src/views/finance/withdrawOrder/dispatch/test/form.spec.ts`
- [ ] `pnpm test:unit src/views/finance/withdrawOrder/dispatch/test/useDispatchPage.spec.ts`

### 静态检查

- [ ] `git diff --check -- src/views/finance/withdrawOrder/dispatch src/i18n/locales/zh/finance.json src/i18n/locales/en/finance.json src/i18n/locales/id/finance.json src/i18n/locales/vi/finance.json`

### 可选补充

- [ ] 若本地有登录态，再人工检查 `http://localhost:7749/finance/withdrawOrder?tab=dispatch` 的规则配置页签语言显示

## 交付标准

- 固定语种 code 继续写死，`label` 不再写死中文。
- `createLanguageOptions()` 被移除，页面不再保留“假动态”语种来源。
- `dispatch` 模块中已确认未使用的 key 与死映射被清理。
- `dispatchMode` 仍保持走全局字典 `orderDispatchModeList`。
- 相关单测通过，diff 无格式问题。

## 后续可选议题

以下内容不在本轮，但值得单独开题：

1. `DEFAULT_RULE_TEXTS` 是否应迁入 locale 或正式配置源
2. `dispatch` 语种标签是否应沉淀为跨模块可复用的公共语言名 key
3. `dispatch` 模块剩余 locale key 的系统性清点
