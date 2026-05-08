---
title: Harness skill 协议模型
type: design
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness skill 协议模型

## 1. 目标

本文档用于定义 Harness 当前阶段的 skill 协议模型，使各类 skill 不再只是各自独立规则，而能围绕统一任务对象和 runtime 控制面协同工作。

本文档回答的问题是：

- 核心 skill 各自承接哪一层任务对象
- 各 skill 消费什么输入
- 各 skill 输出什么结果
- 各 skill 之间如何交接
- 哪些状态必须回写 runtime
- 哪些关键检查点必须写入事件

## 2. 为什么需要 skill 协议模型

当前 skill 已经具备分层，但如果没有统一协议，仍会存在以下问题：

- task-flow、orchestration、runtime-recording 依赖对话记忆而不是统一对象
- 同一状态在不同 skill 中重复判断
- runtime 写入责任不清
- 自动执行与总收口难以形成稳定闭环

因此，Harness 需要一个明确的 skill 协议模型。

## 3. 核心 skill 分层

当前阶段，Harness 至少包含以下核心 skill 层：

- 任务流层
- 编排层
- runtime 承接层
- 文档治理层

### 3.1 任务流层

代表 skill：

- `harness-task-flow`

职责：

- 形成任务对象
- 推进任务卡、边界、计划、执行入口判断
- 固定当前任务所处阶段

### 3.2 编排层

代表 skill：

- `ai-subtask-orchestration`

职责：

- 判断是否需要多 agent
- 承接拆分方案
- 确定执行协作方式

### 3.3 runtime 承接层

代表 skill：

- `harness-runtime-recording`

职责：

- 把任务对象、阶段状态、执行入口与关键检查点回写到 runtime
- 形成最小恢复锚点

### 3.4 文档治理层

代表 skill：

- `document-governance`

职责：

- 判断文档是否需要新增或更新
- 判断文档落点、挂载与元数据完整性

## 4. skill 与任务对象模型的关系

### 4.1 `harness-task-flow`

主要承接：

- 总任务
- 中任务

输出结果至少包括：

- 当前任务对象
- 当前阶段
- 下一步入口

### 4.2 `ai-subtask-orchestration`

主要承接：

- 中任务
- 可提交单元拆分方案

输出结果至少包括：

- `agent_mode`
- `agent_split_reason`
- `agent_split_plan`

### 4.3 `harness-runtime-recording`

主要承接：

- 总任务快照
- 中任务快照
- 可提交单元快照
- 执行入口状态
- 验证与提交检查点

### 4.4 `document-governance`

主要承接：

- 文档对象
- 文档落点判断
- 文档挂载判断

输出结果至少包括：

- 文档动作
- 文档落点
- 文档挂载要求

## 5. 最小输入 / 输出协议

### 5.1 `harness-task-flow`

输入至少包括：

- 用户需求
- 项目上下文
- 当前任务对象（若已存在）
- 前置判断结果

输出至少包括：

- 任务对象
- 当前阶段
- 当前边界
- 当前计划
- 当前执行入口判断结果

输出去向：

- `ai-subtask-orchestration`
- `harness-runtime-recording`
- `document-governance`

### 5.2 `ai-subtask-orchestration`

输入至少包括：

- 当前任务对象
- 当前边界
- 当前计划
- 当前文件范围

输出至少包括：

- 协作方式
- 拆分结果
- 文件边界建议
- 是否进入多 agent

输出去向：

- `harness-task-flow`
- `harness-runtime-recording`

### 5.3 `harness-runtime-recording`

输入至少包括：

- 当前总任务对象
- 当前中任务对象
- 当前可提交单元对象
- 当前执行入口
- 当前阶段状态
- 当前验证与提交状态

输出至少包括：

- 快照写入结果
- 事件写入结果

输出去向：

- `.harness-runtime/*`

### 5.4 `document-governance`

输入至少包括：

- 当前任务对象
- 文档需求判断结果
- 当前文档上下文

输出至少包括：

- 文档落点结论
- frontmatter 约束
- `README.md` 挂载要求
- `updated` 检查要求

输出去向：

- 文档文件
- `harness-runtime-recording`（若需要记录文档相关检查点）

## 6. runtime 回写责任

### 6.1 必须回写的状态

以下状态应由核心 skill 在适当检查点回写 runtime：

- 当前总任务
- 当前中任务
- 当前可提交单元
- 当前执行入口
- 当前验证状态
- 当前提交状态
- 当前总 MR 准备状态

### 6.2 回写责任建议

- `harness-task-flow`
  - 负责产生应回写的任务状态
- `ai-subtask-orchestration`
  - 负责产生应回写的编排状态
- `harness-runtime-recording`
  - 负责实际写入 runtime

也就是说：

- 业务判断由各 skill 产生
- runtime 写入由 `harness-runtime-recording` 统一承接

## 7. 关键事件记录责任

以下检查点至少应写事件：

- 任务卡形成
- 拆分方案确认
- 执行入口命中
- 验证开始
- 验证失败
- 提交完成
- 总验收开始
- 总 MR 准备完成

### 7.1 事件责任建议

- `harness-task-flow`
  - 任务流关键阶段事件
- `ai-subtask-orchestration`
  - 编排判断与锁定事件
- `document-governance`
  - 文档治理命中事件（按需）
- `harness-runtime-recording`
  - 统一写入事件文件

## 8. skill 交接规则

### 8.1 先对象，后动作

skill 之间的交接应优先基于：

- 当前任务对象
- 当前阶段状态
- 当前执行入口

而不是只基于自然语言上下文继续推进。

### 8.2 先判断，后回写

各 skill 应先形成判断结果，再由 runtime-recording 承接最小回写。

### 8.3 先边界，后执行

若当前边界未稳定，不应把状态推进到执行型 skill。

## 9. 对后续系统建设的意义

该 skill 协议模型将直接指导：

- `harness-task-flow` 后续改造
- `ai-subtask-orchestration` 后续改造
- `harness-runtime-recording` 后续改造
- runtime 模板写入责任划分

若 skill 协议模型不先稳定，后续各 skill 即使单独改强，也难以形成统一控制面闭环。

## 10. 当前阶段总结

Harness 当前阶段的 skill 协议模型可以压缩为一句：

各 skill 负责产出各自层面的对象判断与阶段结果，但统一由 runtime-recording 承接最小写入与事件记录，从而围绕总任务、中任务、可提交单元形成可恢复、可交接、可自动推进的系统级协作协议。
