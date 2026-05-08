---
name: module-i18n-onboarding-sop
description: 用于在当前仓库基于既有 i18n 方案，为一个明确模块或页面执行模块内多语言接入；它依赖 documents 中已整理好的方案、规范与实现手册，特别适合用户提到国际化、多语言、i18n、namespace、switchLocale、补 locale、无刷切语言、提示词模板等场景。
keywords: i18n, 国际化, 多语言, locale, namespace, switchLocale, zh/en, vi, id, 无刷切换, 模块内多语言接入, 模块内国际化接入, 模块 i18n 接入, 提示词, 模块接入, module-i18n-onboarding-sop
---

# Module I18n Onboarding SOP

## 目标

- 为当前仓库提供“模块内多语言接入”的稳定执行口径。
- 把提示词模板、人工流程、自查口径和动态切语言约束收束到一次可复用的 skill 中。
- 避免每次为具体模块接入既有 i18n 方案时重新口头解释规则。
- 它不是全局多语言方案，也不负责设计新的 i18n 机制，只负责把明确模块接入仓库现有方案。

## 上游依赖

本 skill 的上游来源不是它自己，而是 `documents` 中的正式文档栈：

1. 方案层：`documents/design/technical/2026-05-01-前端国际化方案.md`
2. 规则层：`documents/standards/coding/FE-STD-008-国际化与字典边界规范.md`
3. 实现层：`documents/guides/development/国际化接入与运行时机制说明.md`
4. 提示词层：`documents/guides/development/模块内多语言接入AI提示词模板.md`

本 skill 只负责把这套既有口径执行到某个明确模块上，不替代上层文档。

## 适用场景

- 用户要求为一个页面或模块做多语言接入。
- 用户提到 `i18n`、`国际化`、`多语言`、`namespace`、`switchLocale`、`补 locale`。
- 用户希望先生成一段可直接发给 AI 的提示词，再开始实施。
- 用户希望盘点现有模块里哪些写法不支持动态切语言。

不优先用于：

- 只改一两个现成 locale key 的微小文案调整
- 纯后端字典问题，但不涉及本地 locale 接入
- 设计新的多语言架构、locale 策略或全局治理方案
- 与国际化无关的普通页面开发

## 输入要求

- 至少给出一个真实目标：
  - 页面目录路径，例如 `src/views/operations/takePackage`
  - 或页面文件路径，例如 `src/views/finance/rechargeType/index.vue`
- 如果用户没有给路径，但能从上下文确定目标模块，也可以继续。

## 执行步骤

1. 先读取正式规则源：
   - `AGENTS.md`
   - `documents/design/technical/2026-05-01-前端国际化方案.md`
   - `documents/guides/development/国际化接入与运行时机制说明.md`
   - `documents/standards/coding/FE-STD-008-国际化与字典边界规范.md`
   - 如用户要提示词模板，优先读取 `documents/guides/development/模块内多语言接入AI提示词模板.md`
2. 先明确本次目标是：
   - 直接实施接入
   - 先盘点后实施
   - 只生成提示词 / SOP
3. 如果进入实施，先输出：
   - 受影响文件清单
   - 预计执行步骤
   - namespace 判断
   - 是否存在顶层缓存 `t()` 的高风险点
4. 页面接入时优先遵守以下原则：
   - 优先复用已有 key
   - 当前运行时启用语种以 `src/i18n/index.ts` 的 `SUPPORT_LOCALES` 为准，现状为 `en/zh/vi/id`
   - 缺失时至少补齐 `zh/en`；若目标 namespace 已存在 `vi/id` 资源，同步补齐
   - `t()` 必须发生在模板、`computed`、render 或运行时工厂中
   - 禁止模块顶层缓存 `t()` 结果
   - 列表列、选项、label map、表单校验、message、tooltip 都要按 `switchLocale()` 视角检查
5. 若涉及共享 TS 模块，重点排查：
   - `const xxx = [{ label: t('...') }]`
   - `const xxx = { title: t('...') }`
   - `LABEL_MAP = { ...t('...') }`
   - `Object.freeze({ ... t('...') ... })`
   - `memoize(factoryUsingT)`
6. 完成后至少回报：
   - 改动文件
   - 验证结果
   - 剩余风险
   - 手工烟测入口
   - 是否同步更新了文档

## 风险与禁止项

- 不要只补单边语言。
- 不要只改 `localStorage` 里的语言值来声称“支持切换”。
- 不要顺手重构无关业务逻辑。
- 不要把“文案变”改成“值变、参数变、查询变、接口变”。
- 不要默认后端字典会随 locale 自动双语化；字典与本地 locale 不是同一件事。

## 输出要求

- 如果用户要提示词：
  - 优先给最终标准提示词
  - 视情况补极短版或只盘点版
- 如果用户要实施：
  - 先给受影响文件和执行步骤，再开始改动
  - 结束后汇报验证结果、风险点、手工烟测入口
- 如果用户要 review：
  - 优先说明是否只影响文案与切语言行为
  - 明确是否会影响业务逻辑、状态值、查询参数和接口调用

## 关联

- `documents/design/technical/2026-05-01-前端国际化方案.md`
- `documents/guides/development/模块内多语言接入AI提示词模板.md`
- `documents/guides/development/国际化接入与运行时机制说明.md`
- `documents/standards/coding/FE-STD-008-国际化与字典边界规范.md`
- `AGENTS.md`
