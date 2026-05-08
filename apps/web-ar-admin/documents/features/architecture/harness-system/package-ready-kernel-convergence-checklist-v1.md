---
title: Harness V2 package-ready 前的内核收敛清单 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: core-architecture-v2, runtime-and-config-schema-v1, plugin-registry-and-manifest-model-v1, phase-state-transition-model-v1
---

# Harness V2 package-ready 前的内核收敛清单 V1

## 1. 目标

本文档用于回答一个非常具体的问题：

- 当前 Harness V2 距离 `package-ready` 还差什么

它不是新的架构蓝图，也不是再次重复 P0 / P1 / P2 设计。

它只负责：

- 基于当前真实实现状态盘点
- 判断哪些内核能力已可视为稳定基线
- 判断哪些仍属于 `internal-only / incubation`
- 给出 package-ready 前必须补齐的收敛项

## 2. 当前阶段判断

当前 Harness V2 的整体状态应判断为：

- `internal kernel / in-repo incubation`

而不是：

- `package-ready`

原因不是方向不对，而是还有几项 package 化前必须补的基础能力未完成，尤其是：

- 自动回归
- phase contract 覆盖面
- 文档与 contract 的半自动一致性能力
- package 导出边界

## 3. 状态标签说明

本文统一使用以下标签：

- `已收口`
  - 当前已有真实实现，且已形成稳定基线
- `基本可用`
  - 当前已有真实实现，但还不适合直接视为 package-ready 基线
- `仍需收口`
  - 当前只有局部实现、局部文档或仍存在明显缺口
- `package-ready 前必须完成`
  - 若不先完成，不应推进 package 化

## 4. 当前内核收敛状态

### 4.1 runtime schema

状态：

- `已收口`

当前判断依据：

- 已形成正式 state object：
  - `TaskRuntimeState`
  - `BatchRuntimeState`
  - `TrialFeedbackState`
  - `ManualValidationState`
  - `EventRecord`
- `scripts/harness-runtime` 内部已转为“对象优先、文件序列化承接”
- runtime 内部命名已开始冻结到：
  - `task`
  - `work_item`
  - `execution_unit`

仍保留的现实边界：

- 旧实例兼容读取仍然存在
- 顶层兼容字段仍然保留

结论：

- 当前已足够作为后续 package 化前的稳定状态基线

### 4.2 phase contract / state boundary

状态：

- `基本可用`

当前判断依据：

- phase contract 已进入实现层
- `task_card`
- `boundary` 已开始经过 contract gate
- runtime phase 已不再只剩：
  - `current_stage`

当前仍缺：

- `planning / execution / verification / submission / closure` 尚未全部进入同等级的 contract gate
- 当前仍不是完整 phase-driven state machine

结论：

- 已从“纯命令驱动”进入“最小 boundary 驱动”
- 但距离 package-ready 仍差一轮 phase contract 覆盖收口

### 4.3 plugin registry / manifest / assembly

状态：

- `已收口`

当前判断依据：

- `/.harness/plugins.json` 已真实落地
- 核心 plugin manifest 已真实落地
- `inspect-assembly` 已基于真实 registry / manifest 输出
- `failure policy` 已进入：
  - assembly 结果层
  - runtime 最小过滤层

现实边界：

- 当前仍是最小 registry / manifest 模型
- 不是完整 plugin loader

结论：

- 当前已足够作为 package 化前的最小插件装配基线

### 4.4 host adapter boundary

状态：

- `基本可用`

当前判断依据：

- 已新增：
  - `HostCapabilities`
  - `HostCommandSurface`
  - `HostContextInput`
  - `HostRuntimeOutput`
- 已抽出：
  - `Codex host adapter`
- CLI 入口已先经过 host adapter，再进入核心模块

当前仍缺：

- package 导出层的正式 adapter contract
- 第二宿主的对照实现

结论：

- 当前 boundary 已成立
- 但仍属于 internal-only 的第一实现，不应误判为已具备完整 host portability

### 4.5 diagnostics 子系统

状态：

- `基本可用`

当前判断依据：

- 已形成完整最小链路：
  - `collect-diagnostics`
  - `analyze-diagnostics`
  - `upgrade-diagnostics-task`
  - `promote-diagnostics-draft`
  - `mount-diagnostics-task-card-entry`
  - `upgrade-task-card-entry-to-formal-task`
  - `start-formal-task-card`
  - `start-task-boundary`
- 已具备 issue runtime、draft、task-card-entry、formal-task、boundary-start

当前仍缺：

- diagnostics 与主执行链的更深 phase-driven 融合
- diagnostics 作为独立 domain/plugin 的进一步目录独立化

结论：

- 当前 diagnostics 已是最成熟的内核子链之一
- 但在 package-ready 前仍应再做一次 boundary 清理与自动回归保护

### 4.6 config / project config / overrides

状态：

- `已收口`

当前判断依据：

- kernel defaults、project config、task runtime overrides 三层模型已落地
- `inspect-config`、`inspect-assembly` 已能稳定消费
- `/.harness/config.json`
- `/.harness/plugins.json` 已形成真实项目级入口

现实边界：

- 当前仍是最小配置系统
- 不是完整 schema validator 平台

结论：

- 当前足够作为 package 化前的稳定配置基线

### 4.7 文档 / contract 对齐状态

状态：

- `基本可用`

当前判断依据：

- P0 / P1 / P2 主要收口点都已同步到架构文档或 runtime 说明
- 主对象术语已统一到：
  - `Requirement`
  - `Task`
  - `Work Item`
  - `Execution Unit`

当前仍缺：

- 文档尚未做到从 schema / contract 半自动反推
- 仍存在“实现先变、文档随后补齐”的协作节奏

结论：

- 当前足够支撑 internal kernel 演进
- 但 package-ready 前，文档与 contract 的一致性机制仍需再收口

### 4.8 自动回归

状态：

- `package-ready 前必须完成`

当前判断依据：

- 当前验证主要依赖：
  - `inspect-*`
  - `/tmp` 隔离烟测
  - 手工链路回归
- 这些方式足够支撑试运行阶段
- 但不足以支撑 package 化后的稳定演进

最小必须补的自动回归包括：

- checkpoint 写入测试
- blocked / resolve-blocked 测试
- phase resolution 测试
- plugin assembly 测试
- diagnostics 升级链测试
- version / changelog 一致性测试

结论：

- 当前最大的 package-ready 阻塞项就是自动回归缺失

## 5. package-ready 前必须完成项

按优先级排序，package-ready 前至少应完成：

1. 自动回归测试基线
2. phase contract 覆盖扩大到主标准 phase
3. package 导出边界与最小 public API 收口
4. 文档 / contract 对齐机制再收口一轮

其中：

### 5.1 自动回归测试基线

优先级：

- `P0`

原因：

- 没有这层，后续任何收口都可能被无声破坏

### 5.2 phase contract 覆盖扩大

优先级：

- `P1`

原因：

- 当前只在 `task_card / boundary` 上形成了真实 contract gate
- package-ready 前至少应让主生命周期的关键 phase 进入同一套边界判断体系

### 5.3 package 导出边界

优先级：

- `P1`

原因：

- 当前虽然已抽出 host boundary，但内核还没有真正进入 package export 视角
- package-ready 前必须知道：
  - 哪些模块属于 public core
  - 哪些仍是 internal implementation

### 5.4 文档 / contract 对齐机制

优先级：

- `P2`

原因：

- 当前靠人工同步还能工作
- 但 package 化后，不适合继续长期靠人工追对齐

## 6. 当前不应作为 package-ready 的原因

当前不应直接进入 package-ready，主要不是因为功能缺，而是因为：

- 内核已形成，但自动回归还没有形成
- phase-driven 内核还没有覆盖到主标准 phase
- package 导出边界还没正式定义
- contract 和文档的一致性机制还不够强

换句话说：

- 当前已不是“架构方向不清”
- 当前也不是“功能原型不通”
- 当前真正欠缺的是：
  - `稳定性基线`
  - `对外导出边界`

## 7. 建议执行顺序

建议后续顺序如下：

1. 先补自动回归测试基线
2. 再扩大 phase contract 覆盖
3. 再定义 package export boundary
4. 最后再进入 package-ready 评估

## 8. 一句话结论

当前 Harness V2 已具备：

- 可运行的状态内核
- 可运行的插件装配基线
- 可运行的 phase boundary 雏形
- 可运行的 diagnostics 主链
- 可运行的 host adapter boundary

但仍应判断为：

- `internal kernel，未到 package-ready`

在进入 package-ready 之前，必须先补：

- `最小自动回归测试基线`

其次再补：

- `主 phase contract 覆盖`
- `package export boundary`
