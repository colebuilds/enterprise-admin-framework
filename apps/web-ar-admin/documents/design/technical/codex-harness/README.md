---
title: Codex Harness
type: design
status: draft
owner: cole
scope: 当前 Codex 发行版与长期 Harness 产品的总览
applies_to: human, ai-agent
---

# Codex Harness

## 1. 文档定位

本文档是 `codex-harness/` 目录的总入口，用于说明当前发行版的产品定义、总体边界、总架构与主执行链路。

本文档不展开：

- Harness 内核实现细节
- 具体 phase contract 设计
- 具体 plugin contract 细节
- 具体 prompt 正文
- 具体 monorepo package 细节

这些内容由后续分文档和 `harness-system/` 目录中的内核文档继续承接。

---

## 2. 当前发行版一句话定义

**Codex Harness 是 Harness 的第一版 Codex 适配发行版。**

它的目标不是堆积零散配置、prompt 或 skills，而是把：

- Codex 最佳配置
- 单模型阶段化工作流
- skill workflow 增强
- 文档治理
- AI 协作规范
- Harness 执行内核

整合成一套可接入项目、可开箱使用、可持续演进的工程协作系统。

---

## 3. 长期产品一句话定义

**Harness 是一个宿主无关的复杂需求执行骨架。**

长期产品的目标不是绑定某一个模型，而是围绕：

- 复杂需求如何对象化
- 如何拆成批次、子任务与执行单元
- 如何通过执行闸门进入正式执行态
- 如何在运行态中持续推进、恢复、收口
- 如何把代码与文档都沉淀成正式产物

来构建正式执行系统。

---

## 4. 为什么当前是 Codex-first

当前阶段，系统先只围绕 `Codex` 构建，不追求多宿主扩展。

原因不是为了收缩能力，而是为了先把复杂需求拆解与执行系统打稳。

在当前版本里，复杂需求能否被稳定拆解，直接取决于以下几层是否协同：

- 模型能力
- Codex 配置
- Profiles
- 角色提示词
- Skills
- 项目规则
- 文档治理

因此，当前最优先目标不是扩更多模型，而是先把单模型 `Codex` 变成一个稳定的复杂需求执行宿主。

---

## 5. 当前产品边界

当前发行版不是：

- 通用多模型 orchestration 平台
- DeerFlow 式 graph execution engine
- 通用 deep research 平台
- 单纯 prompt/skill 仓库
- 纯文档知识库
- 单纯 coding assistant

当前发行版是：

- 面向 Codex 的单模型工程协作系统
- 以复杂需求拆解与持续执行为目标的工作骨架
- 以文档治理与 AI 协作规范为约束层的执行系统
- 以内核生命周期、任务对象和 runtime control plane 为底层支撑的治理型产品

---

## 6. 长期产品边界

长期 `Harness` 也不应被定义为：

- 通用多模型研究平台
- 报告 / 播客 / PPT 生成平台
- 纯技能市场
- 纯 prompt 平台
- 只会执行但没有治理和控制面的 agent runtime

长期 `Harness` 应被定义为：

- 宿主无关的复杂需求执行骨架
- 以任务对象、生命周期、执行闸门、运行态推进为核心的执行系统
- 以文档与 AI 协作治理为长期约束层的工程协作产品

---

## 7. 三层业务协作架构

当前系统建议按三层理解。

### 7.1 Codex 工作骨架层

负责：

- Codex 配置
- Profiles
- PIR 角色阶段
- Prompt 约束
- Skill workflow 接入
- 用户接入后的开箱使用体验

这一层回答的是：

**Codex 在项目里该如何稳定工作。**

### 7.2 Harness 执行内核层

负责：

- 任务对象
- 生命周期
- 批次与工作单元
- runtime control plane
- blocked / resume
- plugin attach / resolution
- diagnostics -> remediation 闭环

这一层回答的是：

**复杂需求如何被正式执行。**

### 7.3 文档与 AI 协作治理层

负责：

- 文档体系总纲
- 文档归档路由
- AI 协作规范
- 项目入口规则
- 文档产物化

这一层回答的是：

**需求、设计、交付与演进信息如何沉淀为正式规则与正式产物。**

---

## 8. 产品实现分层

除了业务协作三层之外，当前产品实现还应按长期产品方向理解为：

- `core`
- `runtime`
- `cli`
- `adapter-codex`
- `docs-kit`
- `skills-kit`

其中：

- `core + runtime` 承载长期 `Harness` 本体
- `adapter-codex` 承载当前第一版发行形态
- `cli` 承载接入命令面
- `docs-kit` 与 `skills-kit` 承载文档模板与 workflow glue

---

## 9. 复杂需求执行主链路

当前发行版的主链路不是“收到一句话需求就开始写代码”，而是：

1. 用户输入一句话需求、PRD 或多轮讨论结果
2. 需求进入分析与澄清阶段
3. 需求被收敛为正式任务对象
4. 长任务与复杂任务被拆为批次、子任务与执行单元
5. 在确认动作前，任务必须达到“可执行最小单元”状态
6. 用户触发 `开始执行`
7. 系统进入正式执行态
8. 主 agent 调度查询子 agent 与执行子 agent 持续推进
9. 进入验证、提交与收口阶段
10. 若执行中发生异常，由 diagnostics 闭环反哺系统

其中最关键的执行闸门是：

**`开始执行` 之前，任务必须已经收敛为可执行最小单元。**

这条规则是整个系统从“聊天协作”升级为“受控执行”的根。

---

## 10. PIR、superpowers、Harness 的关系

当前系统中，这三者不能混为一谈。

### 10.1 PIR

`PIR` 负责定义阶段角色语义：

- `Planner`
- `Implementer`
- `Reviewer`

它解决的是：

**任务在不同阶段由谁负责、该做什么。**

### 10.2 superpowers

`superpowers` 负责提供 skill/workflow 增强层。

它解决的是：

**各阶段采用什么工作流去执行。**

当前更适合将 `superpowers` 视为：

- workflow library
- role-to-skill mapping layer
- 当前 `adapter-codex` 的 workflow 增强层

而不是系统内核本体。

### 10.3 Harness

`Harness` 负责底层执行内核。

它解决的是：

- 任务对象如何承载
- 生命周期如何推进
- runtime 如何记录和恢复
- 多批次、多任务如何编排
- blocked / resume 如何成立

所以三者关系应为：

- `PIR`：阶段角色语义层
- `superpowers`：workflow / skill 层
- `Harness`：执行内核层

---

## 11. 文档索引

本目录下后续文档分工如下：

- `01-product-definition.md`
  - 当前发行版与长期产品本体的定义、边界、目标、非目标
- `02-core-architecture.md`
  - 三层业务协作架构与产品实现分层
- `03-execution-model.md`
  - 任务对象、生命周期、执行闸门、批次、无中断执行
- `04-roles-and-agent-runtime.md`
  - 阶段角色与主/子 agent 运行时映射
- `05-skill-integration-strategy.md`
  - `superpowers` 与本地 skill 接入策略
- `06-documentation-and-ai-governance.md`
  - 文档产物化与 AI 协作治理目标
- `07-product-packaging-and-monorepo.md`
  - 长期 `Harness` 与当前 `adapter-codex` 的产品实现分层
- `08-cli-and-bootstrap-design.md`
  - `init / doctor / upgrade` 命令面与第一版项目引导设计

与本目录配套的 Codex 工程协作手册位于：

- `documents/guides/development/codex-pir/`

其中主要承接：

- `PIR` 阶段角色方法
- `Codex` 配置与 profiles
- prompts 组织方式
- 官方能力与项目约定的边界说明

---

## 12. 与 harness-system 的关系

`codex-harness/` 与 `harness-system/` 的分工必须区分：

- `codex-harness/`
  - 承担产品总叙事、当前发行版叙事与长期产品边界说明
- `harness-system/`
  - 继续承担任务对象、生命周期、runtime control plane、plugin attach / resolution、diagnostics 等底层技术依据

换句话说：

- `codex-harness` 是产品层总纲
- `harness-system` 是内核实现层依据

---

## 13. 一句话总结

**当前应把 `Codex Harness` 视为 `Harness` 的第一版 Codex 适配发行版：业务协作上继续使用三层架构，产品实现上开始形成 `Harness core + adapter-codex + CLI 接入面` 的长期边界。**
