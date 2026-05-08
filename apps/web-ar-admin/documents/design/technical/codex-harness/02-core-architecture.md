---
title: Codex Harness 核心架构
type: design
status: draft
owner: cole
scope: 系统分层与连接关系
applies_to: human, ai-agent
---

# Codex Harness 核心架构

## 1. 文档定位

本文档用于定义当前发行版的核心架构分层、各层职责与层间连接关系。

本文档回答的问题是：

- 整个系统应分为哪几层
- 每一层分别负责什么
- 哪些能力属于工作骨架层
- 哪些能力属于执行内核层
- 哪些能力属于文档与 AI 协作治理层
- `PIR`、`superpowers`、`Harness`、主/子 agent 分别在哪一层
- 为什么长期要采用 `Harness core + adapter-codex` 的产品实现分层

本文档不展开：

- 具体生命周期阶段细节
- 具体任务对象字段
- 具体执行闸门与批次模型
- 具体 prompt 与 skill 正文
- 具体 monorepo package 字段与脚本

这些内容由后续执行模型、接入策略与 packaging 文档继续展开。

---

## 2. 总体架构原则

当前发行版不是单层系统，而是一个多层协作骨架。

如果把：

- Codex 配置
- 角色
- skills
- 文档规范
- AI 协作规则
- Harness 内核
- 主/子 agent 运行时
- CLI 与宿主适配

全部混在一起，系统很快就会失去边界。

因此当前应采用两套同时成立的分层视角：

1. 业务协作分层
2. 产品实现分层

业务协作分层用于说明：

- 用户如何接入
- 系统如何协作
- 复杂需求如何进入正式执行

产品实现分层用于说明：

- 哪些是长期 `Harness core`
- 哪些是当前 `adapter-codex`
- 哪些是 CLI、docs-kit、skills-kit 等外围实现

---

## 3. 业务协作三层架构

当前系统建议按三层理解。

1. `Codex 工作骨架层`
2. `Harness 执行内核层`
3. `文档与 AI 协作治理层`

```text
输入需求 / PRD / 多轮讨论
  ->
Codex 工作骨架层
  ->
Harness 执行内核层
  ->
文档与 AI 协作治理层
  ->
代码产物 + 文档产物 + 执行状态 + 演进信息
```

更准确地说：

- `Codex 工作骨架层` 负责让 Codex 稳定工作
- `Harness 执行内核层` 负责让复杂需求正式执行
- `文档与 AI 协作治理层` 负责让规则和产物稳定沉淀

---

## 4. Codex 工作骨架层

## 4.1 这一层是什么

`Codex 工作骨架层` 是当前发行版的上层交互与协作骨架。

它的核心目标不是执行复杂任务本身，而是：

**让 Codex 在项目中以稳定、可复用、可预测的方式工作。**

## 4.2 这一层负责什么

这一层主要负责：

- Codex 配置
- Profiles
- PIR 角色阶段
- Prompt 结构
- Skill workflow 接入
- 用户接入后的开箱使用体验

它解决的是：

- 同一个模型在不同任务中行为漂移
- 分析、实现、review 混在一起
- 项目接入后没有稳定默认行为
- 配置、提示词、skill 各自分散

## 4.3 这一层包含哪些核心元素

当前建议这一层至少包含：

- `config.toml`
- `plan / dev / review` profiles
- `Planner / Implementer / Reviewer`
- 角色提示词
- `superpowers` skill/workflow 映射
- 项目入口 `AGENTS.md`

## 4.4 这一层不负责什么

这一层不负责：

- 任务对象建模
- 生命周期推进
- blocked / resume
- 多批次运行态
- diagnostics 升级链路

这些属于执行内核层。

---

## 5. Harness 执行内核层

## 5.1 这一层是什么

`Harness 执行内核层` 是整个系统的底层正式执行内核。

它的核心目标是：

**把复杂需求从“被理解”推进为“被正式执行”。**

## 5.2 这一层负责什么

这一层主要负责：

- 任务对象
- 生命周期
- 批次与工作单元
- runtime control plane
- blocked / resume
- plugin attach / resolution
- diagnostics -> remediation 闭环
- 主 agent 调度的运行态承载

它解决的是：

- 需求拆解之后如何持续推进
- 长任务与复杂任务如何正式承载
- 多任务如何编排
- 中断后如何恢复
- 异常如何进入修复闭环

## 5.3 这一层包含哪些核心元素

当前建议这一层至少包含：

- Requirement / Task / Batch / Work Item / Execution Unit
- phase contract
- runtime state
- phase resolution
- plugin assembly
- blocked / resume protocol
- diagnostics upgrade path
- host adapter 接入点

## 5.4 这一层不负责什么

这一层不负责：

- 产品总叙事
- 用户接入说明
- 文档目录职责定义
- AI 协作制度表达
- skills 的产品定位说明

这些属于产品层或治理层。

---

## 6. 文档与 AI 协作治理层

## 6.1 这一层是什么

`文档与 AI 协作治理层` 是整个系统的规则层与沉淀层。

它的核心目标是：

**让规则不只存在于对话中，让执行结果不只停留在代码里。**

## 6.2 这一层负责什么

这一层主要负责：

- 文档体系总纲
- 文档目录路由
- AI 协作规范
- 项目级默认规则
- 文档产物化
- 需求、设计、交付、演进信息沉淀

它解决的是：

- 文档放置随意
- 文档边界不清
- AI 规则只存在于临时对话中
- 项目规则缺少持久化入口
- 代码有了但知识沉淀没有形成

## 6.3 这一层包含哪些核心元素

当前建议这一层至少包含：

- `documents/README.md`
- `documents/standards/ai-collaboration/*`
- 项目文档路由规则
- 文档归档规则
- 文档生成与落盘目标
- 与 `AGENTS.md` 的联动约束

## 6.4 这一层不负责什么

这一层不负责：

- 代替生命周期内核
- 代替运行态控制面
- 代替 Codex profiles
- 代替 skills 具体工作流

它负责约束和沉淀，不负责替代执行。

---

## 7. 关键能力如何映射到三层

### 7.1 PIR

`PIR` 属于 `Codex 工作骨架层`。

它的职责是：

- 规定阶段角色语义
- 让 Codex 在不同阶段有稳定行为

### 7.2 superpowers

`superpowers` 主要属于 `Codex 工作骨架层` 的 skill/workflow 增强部分。

它的职责是：

- 为 `Planner / Implementer / Reviewer` 提供 workflow layer

它不应被视为执行内核。

### 7.3 Harness

`Harness` 属于 `Harness 执行内核层`。

它的职责是：

- 承担任务对象、生命周期、运行态、恢复、诊断闭环

### 7.4 主 agent / 子 agent

主 agent 与查询/执行子 agent 的运行时编排，主要属于 `Harness 执行内核层`。

但其阶段语义由 `PIR` 提供，因此两者是跨层连接关系：

- `PIR` 提供阶段角色语义
- `Harness` 提供运行态执行承载

### 7.5 文档规范与 AI 协作规范

这些属于 `文档与 AI 协作治理层`。

它们不负责执行本身，但负责：

- 路由规则
- 归档规则
- 默认行为约束

---

## 8. 三层之间如何连接

这三层不是孤立存在的，而是通过明确连接关系组成闭环。

### 8.1 工作骨架层 -> 执行内核层

连接方式：

- `Planner` 负责把输入收敛为可执行内容
- `开始执行` 作为执行闸门
- `Implementer` 进入执行态
- `Reviewer` 进入验证与收口语义

也就是说：

工作骨架层定义“该怎么进入执行”，执行内核层定义“进入执行后怎么持续推进”。

### 8.2 执行内核层 -> 治理层

连接方式：

- 任务状态需要被正式记录
- 执行结果需要被沉淀为正式文档产物
- diagnostics 需要反哺治理与修复闭环

也就是说：

执行内核层保证任务能跑，治理层保证结果能沉淀。

### 8.3 治理层 -> 工作骨架层

连接方式：

- 文档规范和 AI 协作规范反向约束 Codex 行为
- 项目规则通过 `AGENTS.md`、文档规范、skills 影响工作骨架层

也就是说：

治理层不是收尾附属层，而是工作骨架层的长期约束来源。

---

## 9. 产品实现分层

除了业务协作三层之外，当前产品实现还应采用更明确的包级分层。

长期来看，产品实现不应继续停留在“单仓混合叙事”状态，而应演进为：

1. `core`
2. `runtime`
3. `cli`
4. `adapter-codex`
5. `docs-kit`
6. `skills-kit`

这组分层不是替代业务协作三层，而是：

- 用来承载真正的产品代码与可发布资产
- 用来把长期 `Harness` 本体与当前 `Codex` 发行版分开

---

## 10. Core 与 Adapter 边界

## 10.1 Core

`core` 与 `runtime` 应尽量承载宿主无关的产品能力，例如：

- 任务对象模型
- 生命周期模型
- 执行闸门模型
- 批次 / Work Item / Execution Unit 模型
- blocked / resume 抽象
- runtime state schema
- plugin attach / resolution 抽象
- diagnostics 升级闭环抽象

这些能力不应该被绑定死在 `Codex` 上。

## 10.2 Adapter

`adapter-codex` 应承载当前宿主专属能力，例如：

- `config.toml` 生成与合并
- `AGENTS.md` 注入规则
- Codex profiles
- Codex prompt/profile/skill routing
- Codex 项目接入模板

这些能力明确属于：

- 当前版本发行层
- 当前宿主适配层

---

## 11. 为什么采用 Monorepo

当前产品已经不再只是文档集合，而是一个逐步走向独立产品的系统。

因此，长期采用 monorepo 有三个直接好处：

### 11.1 把核心与适配层分开

如果长期继续把：

- 核心模型
- Codex 适配
- 文档模板
- skills glue
- CLI

混在一起，后续扩展到其他宿主时会非常痛苦。

### 11.2 让第一版发行与长期产品解耦

当前第一版只做 `adapter-codex`，但长期产品不应被 `Codex` 绑死。

### 11.3 让安装、升级、校验与模板生成进入正式产品结构

用户最终接入产品时，需要的是：

- `init`
- `doctor`
- `upgrade`

这类正式产品命令面，而不是散落文档与手工复制动作。

---

## 12. 当前阶段的架构收敛结论

当前最合理的架构收敛方式是：

- 业务协作上继续采用三层总架构
- 产品实现上开始形成 `Harness core + adapter-codex` 的边界
- `Codex Harness` 继续作为第一版发行叙事
- `Harness` 作为长期产品本体

一句话说：

**当前不需要推翻已有三层架构，但必须补上长期 `Harness` 与当前 `adapter-codex` 的产品实现分层。**
