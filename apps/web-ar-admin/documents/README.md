---
title: 前端技术知识库文档体系规范（AI协作增强版）
type: standard
code: FE-DOC-001
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-04-30
scope: documents/
applies_to: human, ai-agent
---

# 前端技术知识库文档体系规范（AI协作增强版）

## 元数据

- 目标：建立一套对人和 AI 都友好的文档体系，保证规范、手册、决策、演进与高价值参考都能稳定沉淀，同时避免过度设计与文档失控

---

# 1. 文档体系目标

本文档用于定义项目 `documents/` 目录的结构、边界、命名规则、更新规则与最佳实践。

本规范希望解决以下问题：

- 文档放置随意，后期难以检索
- 需求文档、设计文档、规范文档边界不清
- 架构改造与产品迭代混放，长期失控
- 只有立项文档，没有最终落地结果
- 人能勉强理解，但 AI 很难稳定建立上下文
- 文档拆分过细，维护成本过高
- 文档过少，关键背景与决策无法追溯

本规范的核心目标不是“把所有东西都文档化”，而是：

1. 让高价值信息可以被长期追溯
2. 让团队成员和 AI 都能快速理解项目上下文
3. 让需求、设计、规范、决策、演进各归其位
4. 避免为了“看起来规范”而产生大量低价值文档

---

# 2. 总体设计原则

## 2.1 只记录高价值信息

不是所有改动都需要进入 `documents/`。

优先进入 `documents/` 的内容通常满足以下一项或多项：

- 影响多个模块
- 涉及多人协作
- 仅靠代码和 PR 难以还原完整背景
- 会形成长期规则
- 会被反复查询
- 后续需要复盘
- 属于关键架构 / 平台 / 流程决策

以下内容通常不进入正式文档：

- 简单 bug 修复
- 小范围样式调整
- 代码中一看就懂的局部实现
- 一次性很强且不会复用的临时性处理

这类内容优先放在：

- 代码注释
- PR 描述
- Issue / Task
- Commit message

---

## 2.2 目录按职责划分，不按主题堆叠

文档目录必须表达“职责”，而不是“想到什么放什么”。

例如：

- `features/`：具体需求 / 具体改造
- `standards/`：长期规范
- `guides/`：使用手册 / 接入手册
- `decisions/`：关键决策记录
- `evolution/`：演进记录
- `reference/`：背景资料 / 术语 / 外部系统说明

---

## 2.3 一个需求一个目录，但不要拆得过细

推荐：

- 一个需求一个目录
- 目录内默认 1～2 个主文档
- 只有在复杂度真正升高时才继续拆分

不推荐一开始就为每个需求创建大量薄文件。

---

## 2.4 过程文档与沉淀文档分离

这是本规范最重要的原则。

### 过程文档

回答“这次要做什么、怎么做、怎么落地”：

- `features/`
- 部分 `design/`

### 沉淀文档

回答“以后统一怎么做、为什么这么做、是怎么演进过来的”：

- `standards/`
- `guides/`
- `decisions/`
- `evolution/`

---

## 2.5 对人和 AI 都友好

文档体系不仅要让人查得方便，也要让 AI 能快速建立稳定上下文。

因此建议：

- 目录职责清晰
- 命名稳定
- 单个目录主题明确
- 文档头部带状态与更新时间
- 不把多个需求混在同一篇文档中
- 不中英混搭命名
- 不把“最终版、最新版、2026-03-18”塞进文件名

---

## 2.6 AI 协作规则不要只存在于对话里

对于 AI 协作来说，只在对话中口头补充规则是不稳定的。

例如：

- “按照文档规范生成”
- “不要改某个目录”
- “先出计划再执行”

如果这些规则没有沉淀到项目文件中，新会话开始后就可能丢失，或者优先级不清晰。

因此建议：

- 文档归档规则放在 `documents/README.md`
- 项目入口规则放在 `AGENTS.md`
- 执行控制规则放在 `skills/*/SKILL.md`
- AI 相关正式制度放在 `documents/standards/ai-collaboration/`

这样，AI 协作才会从“临时对话约束”升级为“项目默认规则”。

---

# 3. documents 目录最终结构

```text
documents/
├── README.md
├── assets/
├── archive/
│
├── standards/
│   ├── coding/
│   ├── architecture/
│   ├── infrastructure/
│   ├── api/
│   ├── data/
│   ├── ui/
│   ├── quality/
│   ├── collaboration/
│   └── ai-collaboration/
│
├── guides/
│   ├── onboarding/
│   ├── development/
│   ├── integration/
│   ├── release/
│   ├── debugging/
│   ├── testing/
│   └── troubleshooting/
│
├── design/
│   ├── product/
│   ├── technical/
│   └── ui-ux/
│
├── decisions/
│
├── evolution/
│   ├── architecture/
│   ├── engineering/
│   ├── platform/
│   └── product/
│
├── features/
│   ├── architecture/
│   └── product/
│
├── reference/
│
└── known-issues/
```

---

# 4. 根目录与各目录职责说明

## 4.1 `documents/README.md`

`documents/README.md` 是整个文档体系的总入口。

它的职责是：

- 解释 documents 整体结构
- 解释每个目录的边界
- 说明哪些文档放哪里
- 规定命名规则和更新规则
- 作为团队成员和 AI 的统一导航入口

本文件本身就是文档体系规范，不是某个需求文档。

---

## 4.2 `documents/assets/`

用于存放通用资源，例如：

- 通用流程图
- 通用插图
- 共享截图
- drawio / mermaid 导出图
- 共享附件

注意：

- 如果资源只属于某个具体需求，优先放在对应需求目录下的 `assets/`
- `documents/assets/` 不应变成无分类资源堆积区

---

## 4.3 `documents/archive/`

用于存放已失效但仍需要保留追溯价值的文档。

适合归档的内容：

- 已被替代的旧规范
- 旧版设计方案
- 历史需求文档
- 不再生效但有查询价值的文档

不适合放入的内容：

- 当前仍在执行的需求
- 仍然有效的规范
- 团队懒得分类的杂项文档

`archive/` 是历史归档，不是垃圾桶。

---

## 4.4 `documents/standards/`

用于存放长期有效、团队需要统一遵守的规范。

当前入口文档：

- `documents/standards/README.md`

当前已落地内容：

- `documents/standards/quality/`
- `documents/standards/collaboration/`
- `documents/standards/ai-collaboration/`

这类文档回答的问题是：

**以后统一怎么做。**

### 4.4.1 `standards/coding/`

编码规范。

当前入口文档：

- `documents/standards/coding/README.md`

当前已落地文档：

- `FE-STD-001-前端命名规范.md`
- `FE-STD-002-TypeScript-代码书写规范.md`
- `FE-STD-003-Vue3-SFC-组件书写规范.md`
- `FE-STD-004-Composables-架构与编码规范.md`
- `FE-STD-005-Git分支与提交规范.md`

### 4.4.2 `standards/architecture/`

架构规范。

当前入口文档：

- `documents/standards/architecture/README.md`

当前已落地文档：

- `FE-ARCH-001-前端目录结构规范.md`
- `FE-ARCH-002-应用分层规范.md`
- `FE-ARCH-003-状态管理规范.md`
- `FE-ARCH-004-前端请求规范.md`
- `FE-ARCH-005-API请求分层与调用规范.md`
- `FE-ARCH-006-错误处理规范.md`

### 4.4.3 `standards/infrastructure/`

基础设施与平台能力规范。

当前入口文档：

- `documents/standards/infrastructure/README.md`

当前已落地文档：

- `FE-INFRA-001-Node与包管理器版本治理规范.md`
- `FE-INFRA-002-环境变量与配置分层规范.md`
- `FE-INFRA-003-构建与发布规范.md`
- `FE-INFRA-004-PWA与离线能力规范.md`
- `FE-INFRA-005-容器接入与宿主协作规范.md`
- `FE-INFRA-006-多租户运行时配置装配规范.md`

### 4.4.4 `standards/api/`

接口与 DTO 等规范。

当前入口文档：

- `documents/standards/api/README.md`

当前已落地文档：

- `FE-API-001-接口定义与类型组织规范.md`
- `FE-API-002-接口模块划分与导出规范.md`
- `FE-API-003-请求参数与响应数据处理规范.md`
- `FE-API-004-接口异常与业务错误处理规范.md`
- `FE-API-005-接口Mock与联调协作规范.md`

### 4.4.5 `standards/data/`

数据规范。

当前入口文档：

- `documents/standards/data/README.md`

当前已落地文档：

- `FE-DATA-001-领域数据模型与命名规范.md`
- `FE-DATA-002-状态数据归属与持久化规范.md`
- `FE-DATA-003-本地存储与缓存数据规范.md`
- `FE-DATA-004-枚举字典与展示映射规范.md`
- `FE-DATA-005-金额时间与敏感数据处理规范.md`

### 4.4.6 `standards/ui/`

页面结构、组件配置、行为表达等 UI 相关规范。

当前入口文档：

- `documents/standards/ui/README.md`

### 4.4.7 `standards/quality/`

质量保障规范。

当前入口文档：

- `documents/standards/quality/README.md`

用于存放开发质量相关的长期规则，回答的问题是：

**如何定位问题、如何修复问题、如何验证问题不会再次发生。**

建议至少包括：

- `调试规范.md`
- `Bug修复规范.md`
- `测试规范.md`
- `回归验证规范.md`
- `Mock规范.md`

### 4.4.8 `standards/collaboration/`

协作治理规范。

当前入口文档：

- `documents/standards/collaboration/README.md`

用于存放人和 AI 都需要共同遵守的协作规则，回答的问题是：

**改动如何被创建、约束、检查、提交、合并与放行。**

建议至少包括：

- `Git-分支规范.md`
- `Git-提交规范.md`
- `变更控制规范.md`
- `代码评审规范.md`
- `文档编写与元数据规范.md`
- `monorepo包内文档治理规范.md`

当项目存在多个 `apps/*`、`packages/*`，且需要同时治理根级 `documents/`、包内 `documents/` 与包根 `README.md` 时，应进一步遵守：

- `documents/standards/collaboration/FE-COLLAB-002-monorepo包内文档治理规范.md`

### 4.4.9 `standards/ai-collaboration/`

AI 协作规范。

当前入口文档：

- `documents/standards/ai-collaboration/README.md`

用于存放 AI 协作相关正式制度，回答的问题是：

**在本项目中，AI 应该如何协作、如何执行、如何受控。**

建议至少包括：

- `FE-AI-000-AI协作开发规范.md`
- `FE-AI-001-AI变更控制协议.md`
- `FE-AI-002-AI任务边界模板.md`
- `FE-AI-003-AI子任务协作与主代理协调规范.md`

它们的职责分别是：

- `FE-AI-000-AI协作开发规范.md`：说明 AI 协作整体体系、规则分层、完整链路
- `FE-AI-001-AI变更控制协议.md`：约束 AI 在修改文件、执行命令时的执行流程
- `FE-AI-002-AI任务边界模板.md`：定义单次任务中的边界、权限和确认方式
- `FE-AI-003-AI子任务协作与主代理协调规范.md`：定义复杂任务中的主代理职责、子任务拆分方式和并发协调规则

### 4.4.10 `standards/` 入口推进计划

`standards/` 不建议一次性为所有子目录机械补空文档。

推荐按以下顺序推进：

1. 优先维护已经有实际内容的目录：

- `standards/quality/`
- `standards/collaboration/`
- `standards/ai-collaboration/`

2. 当 `coding/architecture/infrastructure/api/data/ui` 中任一目录准备承载第一篇正式规范时，再补该目录的 `README.md`
3. 当同一目录下规范数量增多时，再增加 `INDEX.md` 做导航
4. 在没有真实规范内容前，不把空目录误当成“规范体系已落地”

---

## 4.5 `documents/guides/`

用于存放手册和操作说明。

当前入口文档：

- `documents/guides/README.md`

这类文档回答的问题是：

**怎么用、怎么接、怎么操作。**

建议至少包括：

- `guides/debugging/`：调试手册、问题定位手册
- `guides/testing/`：Vitest / Playwright / Mock / 覆盖率 / CI 测试手册
- `guides/integration/`：外部系统与平台接入手册

当前已落地文档：

- `guides/testing/项目测试执行指南.md`
- `guides/debugging/项目调试入口指南.md`
- `guides/integration/接口与宿主联调指南.md`
- `guides/release/发布前验证与检查指南.md`
- `guides/troubleshooting/常见问题排查指南.md`
- `guides/development/README.md`
- `design/technical/2026-05-01-前端国际化方案.md`
- `guides/development/AI技能调用一页口令卡.md`
- `guides/development/AI技能调用速查手册.md`
- `guides/development/模块内多语言接入AI提示词模板.md`
- `guides/development/权限接入与模块核对SOP.md`
- `guides/development/权限核对AI提示词模板.md`
- `guides/development/规范落地执行指南.md`
- `guides/onboarding/项目上手路径指南.md`

如果你在当前仓库里主要想解决下面这些问题：

1. 忘了该点哪个 skill
2. 忘了提示词怎么写
3. 想快速发起一个模块内多语言接入任务
4. 想先理解这套系统的多语言方案是什么
5. 想快速发起一个模块级权限核对任务

优先从以下入口开始：

1. `guides/development/README.md`
2. `guides/development/AI技能调用一页口令卡.md`
3. `guides/development/AI技能调用速查手册.md`
4. `design/technical/2026-05-01-前端国际化方案.md`
5. `guides/development/模块内多语言接入AI提示词模板.md`
6. `guides/development/权限核对AI提示词模板.md`

---

## 4.6 `documents/design/`

用于存放独立性较强、可跨需求复用或可单独讨论的设计方案。

**`design/` vs `features/` 判断标准（一句话版）：**

> 这个改造结束后，还会有人反复来查这份设计文档吗？
>
> - **是** → `design/technical/`（系统级设计，跨需求复用）
> - **否** → `features/`（本次需求的过程文档，做完即归档）

示例：

- 字典系统架构设计 → `design/technical/`（其他模块迁移时反复参考）
- 出款看板的 API 合约 → `features/product/出款数据看板/`（专属于该需求）

当前入口文档：

- `documents/design/README.md`

当前已落地文档：

- `documents/design/technical/2026-05-01-前端国际化方案.md`
- `documents/design/technical/AR-V2-架构设计原则.md`
- `documents/design/technical/AR-V2-初版架构蓝图.md`
- `documents/design/technical/AR-V2-runtime层初版方案.md`
- `documents/design/technical/AR-V2-runtimeStore初版方案.md`

---

# 5. documents/ 以外的 AI 产物位置

`documents/README.md` 只定义 `documents/` 内部结构。完整的文档体系还包含以下两个目录，AI 需要同时了解：

## 5.1 `.local-work/` — 执行阶段临时产物

**不进 `documents/`，服务于当次执行过程，不做长期沉淀。**

| 子目录 | 存放内容 |
| --- | --- |
| `.local-work/plans/` | AI 生成的实施计划（writing-plans / brainstorming 产物） |
| `.local-work/permission-audits/` | 权限核对过程文档（前置审计、权威核对） |
| `.local-work/session-context/` | 跨 session 的上下文交接文档 |

判断标准：**这个文档一个月后还有人查吗？是 → `documents/`；否 → `.local-work/`**

## 5.2 `.migration/` — 迁移专项文档

本项目迁移阶段专用，存放：

| 文件/目录                     | 内容                                         |
| ----------------------------- | -------------------------------------------- |
| `.migration/runbook.md`       | 当前阶段、当前任务、下一步（执行手册）       |
| `.migration/tracker.md`       | 模块迁移状态追踪                             |
| `.migration/e2e-inventory.md` | E2E 用例清单                                 |
| `.migration/specs/`           | 迁移各子系统的技术方案（字典、i18n、权限等） |

迁移完成后，`specs/` 中有长期参考价值的内容迁入 `documents/design/technical/`，其余归档至 `documents/archive/`。

## 5.3 AI 产物存放速查

```
实施计划（writing-plans）       → .local-work/plans/
技术设计方案（brainstorming）   → documents/design/technical/
迁移技术方案                   → .migration/specs/
已完结的历史文档               → documents/archive/
长期规范                       → documents/standards/
操作手册/SOP                   → documents/guides/
```
