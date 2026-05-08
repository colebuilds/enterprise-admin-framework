---
title: Harness 当前能力矩阵与剩余缺口清单
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness 当前能力矩阵与剩余缺口清单

## 1. 目标

本文档用于统一收口当前 Harness 的阶段性能力状态，明确：

- 哪些能力已具备
- 哪些能力已基本具备
- 哪些能力仅部分具备
- 哪些仍待验证或仍有缺口
- 下一阶段最值得继续补的能力

本文档不是新规则定义文档，而是基于当前已落地规则、已实现动作和已完成验证的阶段性能力总览。

## 2. 结论摘要

当前 Harness 的阶段性结论可先收敛为：

- 简单任务：
  - `已基本具备默认自动完成能力`
- 最小复杂任务：
  - `已基本具备默认自动推进能力`
- 最小完整多批次复杂任务：
  - `已基本具备完整自动推进能力`
- 多 agent 并发复杂任务：
  - `已基本具备默认自动推进能力`

但当前仍不应把 Harness 表述为：

- 完整无人值守自动研发平台
- 完整多 agent 调度平台
- 已覆盖任意规模复杂任务的完全闭环系统

## 3. 能力矩阵

### 3.1 已具备

#### 规则与制度层

- `开始执行` 已被定义为总授权点
- `提交结果` 已被定义为自动推进链路中的内部展示节点
- 复杂任务在 `开始执行` 前必须完成拆分与批次结构确认
- 简单任务已具备自动闭环判定规则
- Harness 版本号与迭代日志已有正式治理规则

#### 真实载体与最小动作层

- 已有真实 Harness 版本号载体：
  - `/.harness-version.json`
- 已有真实 Harness 迭代日志载体：
  - `documents/evolution/engineering/Harness-迭代日志.md`
- 已有最小真实版本动作入口：
  - `pnpm harness:version`
- 已有最小真实 runtime 写入入口：
  - `pnpm harness:runtime`

#### runtime 基础能力

- V1 runtime 控制面文档已形成
- V1 runtime 模板已形成
- `.harness-runtime/templates/*` 已对齐 V1
- `.harness-runtime` 实例样例已对齐 V1

### 3.2 已基本具备

#### 简单任务自动闭环

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-简单任务自动闭环验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-简单任务自动闭环验证记录.md)
- 当前已证明：
  - `开始执行` 后可自动完成执行、验证、文档落盘、提交范围展示与 `git add / commit / push`

#### 复杂任务确认后自动推进

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-复杂任务确认后自动推进验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-复杂任务确认后自动推进验证记录.md)
- 当前已证明：
  - 复杂任务不会跳过拆分确认
  - 确认后默认自动推进链路可以继续成立

#### 最小完整多批次复杂任务自动推进

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-多批次复杂任务完整自动推进验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-多批次复杂任务完整自动推进验证记录.md)
- 当前已证明：
  - 当前中任务完成后自动切到下一中任务
  - 最后一个中任务完成后自动进入总收口
  - 总收口后自动进入 `total-acceptance / total-mr-ready`

#### 更大规模多批次复杂任务自动推进

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-更大规模多批次复杂任务自动推进验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-更大规模多批次复杂任务自动推进验证记录.md)
- 当前已证明：
  - 五个中任务长度的更长 `task_order` 下仍能连续自动切换
  - 更长链路下最后一个中任务完成后仍能自动进入总收口
  - 总收口后仍能自动进入 `total-acceptance / total-mr-ready`

#### 多 agent 并发复杂任务自动推进

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-多agent并发复杂任务自动推进复验记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-多agent并发复杂任务自动推进复验记录.md)
- 当前已证明：
  - 主控 / 执行型子代理 / 查询型子代理边界稳定
  - `开始执行` 前的协作方式锁定规则稳定
  - 并发状态已可落到 runtime
  - 默认自动推进链路较早期结论更稳定

#### 多 agent 并发与多批次叠加自动推进

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-多agent并发与多批次叠加自动推进验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-多agent并发与多批次叠加自动推进验证记录.md)
- 当前已证明：
  - 并发状态同步进入 runtime 后，批次仍能继续自动推进
  - 当前 / 下一任务切换不会因多 agent 状态而中断
  - 叠加场景下最后一个中任务完成后仍能自动进入总收口
  - 总收口后仍能自动进入 `total-acceptance / total-mr-ready`

### 3.3 部分具备

#### 更大规模多 agent 并发复杂任务自动推进

- 当前判断：
  - `部分具备`
- 依据：
  - [Harness-更大规模多agent并发复杂任务自动推进验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-更大规模多agent并发复杂任务自动推进验证记录.md)
- 当前已证明：
  - 主控与 3 个执行型子代理的并发状态可真实进入 runtime
  - 每个执行型子代理的 `write_scope` 可清晰表达
  - 更大规模并发状态不会破坏现有批次快照结构
- 当前仍缺：
  - 更长并发执行链路下的完整自动推进证明
  - 更大规模并发与收口、提交链路的稳定性证明

#### 版本治理动作闭环

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-版本动作与日志动作真实收口验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-版本动作与日志动作真实收口验证记录.md)
- 当前已证明：
  - 版本级变化判断可进入真实任务流
  - `pnpm harness:version ... --dry-run` 可稳定命中
  - `/.harness-version.json` 可被真实更新
  - `documents/evolution/engineering/Harness-迭代日志.md` 可被同步追加
- 当前仍缺：
  - 真实日志内容补全的质量门槛仍需继续收紧
  - `total-mr-ready` 之后与版本治理动作的进一步联动仍待继续验证

#### 更强 blocked / 阻塞场景自动推进

- 当前判断：
  - `已基本具备`
- 依据：
  - [Harness-更强blocked场景自动推进验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-更强blocked场景自动推进验证记录.md)
- 当前已证明：
  - blocked 在批次层可被建模
  - blocked 在编排层可被判定
  - 当前 / 下一任务与 blocked 任务可被统一查看
  - blocked 进入已具备独立 runtime 动作
  - blocked 恢复已具备独立 runtime 动作
  - `events.log` 已可记录 `task_blocked / task_unblocked`
- 当前仍缺：
  - blocked 恢复后更长链路下的持续自动推进证明
  - blocked 与更大规模并发、多批次叠加场景下的恢复稳定性证明

### 3.4 待验证 / 仍有缺口

#### total-mr-ready 阶段终点语义

- 当前判断：
  - `已具备`
- 依据：
  - [Harness-total-mr-ready-后续动作验证记录.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/evolution/engineering/Harness-total-mr-ready-后续动作验证记录.md)
- 当前已证明：
  - 当前 runtime 真实动作入口只推进到 `ready-total-mr`
  - 当前示例载体的最高阶段也是 `total-mr-ready`
  - `total-mr-ready` 在当前体系内应视为阶段性终点，而不是遗漏了一步自动推进

#### 最终发布 / 总 MR 平台后动作

- 当前状态：
  - `待继续定义`
- 仍需确认：
  - 是否需要为 `total-mr-ready` 之后新增新的正式阶段对象
  - 是否需要接入真实 MR 平台动作
  - 是否需要补完整发布前 / 发布后链路

## 4. 关键依据

当前能力矩阵的判断依据主要来自三类对象：

- 规则依据
  - `AGENTS.md`
  - `documents/standards/ai-collaboration/*`
  - `skills/*/SKILL.md`
- 动作依据
  - `scripts/harness-runtime.mjs`
  - `scripts/harness-version.cjs`
  - `/.harness-version.json`
  - `.harness-runtime/*`
- 验证依据
  - `documents/evolution/engineering/` 下各类验证记录

若后续验证结论变化，应优先更新验证记录，再回写本矩阵。

## 5. 剩余缺口分层

### 5.1 规则层

当前规则层已基本成形，剩余缺口不在“有没有规则”，而在：

- 更大规模场景是否还需要进一步细化停止条件
- 版本治理和发布前动作是否还需要更明确的质量门槛

### 5.2 runtime 层

当前 runtime 已具备：

- 单任务写入
- 批次推进
- 总收口推进
- 多 agent 并发状态同步

剩余缺口集中在：

- 更大规模并发与更长批次链路的稳定性
- 是否需要为更复杂的并发状态补更清晰但仍轻量的表达方式

### 5.3 编排层

当前编排层已具备：

- 复杂任务拆分前置
- 批次结构确认
- 多 agent 协作方式锁定

剩余缺口集中在：

- 更大规模并发与多批次叠加场景的持续验证
- 更复杂收口条件下的稳定性验证

### 5.4 收口层

当前收口层已具备：

- `提交结果` 自动触发
- 自动提交到 `push`
- 批次收口
- 总收口推进

剩余缺口集中在：

- 更大规模并发与更长链路下的收口稳定性
- 未来若要超出 `total-mr-ready`，需要新增新的正式阶段对象
- blocked 恢复后更长链路下的持续自动推进稳定性

## 6. 下一阶段优先级建议

### 优先级 1

- 继续验证更长并发执行链路下的自动收口与提交稳定性
- 验证更大规模并发与批次 / 总收口叠加时是否仍能稳定自动推进

### 优先级 2

- 继续验证 blocked 恢复后更长链路下的持续自动推进稳定性
- 定义 `total-mr-ready` 之后是否需要新增正式阶段对象
- 若需要，再补真实 MR 平台动作或发布前动作验证

### 优先级 3

- 在保持轻量的前提下，继续增强 runtime 对复杂并发状态的表达
- 视验证结果再决定是否需要更正式的能力矩阵总入口或 INDEX

## 7. 当前阶段总结

当前 Harness 已经不再只是“规则堆叠系统”，而是已经进入：

- 规则可表达
- 动作可执行
- 验证可落盘
- 结论可分层

的阶段。

当前最合适的表述是：

- `Harness 已基本具备从简单任务到最小复杂任务、到最小完整多批次复杂任务、再到多 agent 并发复杂任务的阶段性自动推进能力`

但仍应保留边界：

- `更大规模、更高并发、更长链路场景仍需继续验证，不应夸大为完全闭环平台`
