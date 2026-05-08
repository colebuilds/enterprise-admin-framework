---
title: Harness task runtime overrides 模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: config-model-v1, runtime-and-config-schema-v1, project-config-location-and-naming-v1, core-architecture-v2
---

# Harness task runtime overrides 模型 V1

## 1. 目标

本文档用于把 Harness 配置模型中的第三层：

- `task runtime overrides`

继续细化成独立模型，明确：

- 任务级临时覆盖到底是什么
- 它和项目级配置有什么区别
- 它放在哪里
- 生命周期内如何生效
- 什么时候失效
- 哪些字段适合进入 overrides，哪些不适合

本文档回答的问题是：

- 为什么 Harness 必须有 task runtime overrides
- task runtime overrides 和 project config、runtime 快照如何分工
- 任务级覆盖如何在当前任务生命周期内生效
- 覆盖结束后为什么不能污染项目默认值

## 2. 为什么必须有这层

如果 Harness 只有：

- kernel defaults
- project harness config

则会出现一个问题：

- 任务级临时策略只能硬改项目默认值

这会导致：

- 单次任务的实验性策略污染整个项目
- 高风险任务的临时限制无法稳定表达
- 当前任务对 `agent_mode / auto-push / blocked recovery / diagnostics` 的临时要求没有稳定落点

因此，V1 必须把“任务级临时覆盖”单独建模。

## 3. 设计原则

### 3.1 任务级覆盖只对当前任务生效

`task runtime overrides` 只应影响：

- 当前激活任务
- 当前任务关联的 Work Item / Execution Unit

它不应默认影响：

- 同项目其他任务
- 项目级默认策略
- 内核默认值

### 3.2 覆盖写入 runtime，不写回项目配置

任务级覆盖是运行态对象，不是项目稳定配置。

因此它应进入：

- runtime 快照
- 或 runtime 相关对象

而不应写回：

- `/.harness/config.json`
- `/harness.config.json`

### 3.3 先覆盖策略，不覆盖对象定义

V1 的任务级覆盖应优先用于：

- 行为策略
- 风险开关
- 自动推进边界

而不是用于重写：

- phase contract
- plugin contract
- schema 结构

## 4. 在三层配置结构中的位置

在 V1 中，三层配置应理解为：

1. `kernel defaults`
   - 定义内核基线
2. `project harness config`
   - 定义项目默认装配
3. `task runtime overrides`
   - 定义当前任务临时偏移

三层关系是：

- defaults 提供基线
- project config 提供项目默认策略
- runtime overrides 在单个任务生命周期内对项目默认策略做局部偏移

## 5. 覆盖对象定位

### 5.1 它不等于 runtime 全快照

`task runtime overrides` 不是完整 `current-task.yaml`。

它只是一段覆盖对象。

### 5.2 它建议作为 runtime 中的一个字段组存在

V1 推荐把它承接在 `current-task.yaml` 中，例如：

```yaml
runtime_overrides:
  agent_mode:
  auto_advance_target:
  auto_push_enabled:
  blocked_recovery_policy:
  diagnostics_input_mode:
```

也就是说：

- 它是 runtime 的一部分
- 但它不是 runtime 的全部

## 6. 推荐承接位置

### 6.1 首选位置

V1 推荐把任务级覆盖承接在：

- `/.harness-runtime/current-task.yaml`

原因是：

- 它天然和当前激活任务绑定
- 它和 phase、execution、orchestration、closure 一样属于“当前任务控制面”

### 6.2 不推荐位置

V1 不推荐把任务级覆盖承接在：

- `/.harness/config.json`
- `/harness.config.json`
- `current-batch.yaml`

原因分别是：

- 项目级配置不应混入任务运行态
- batch 快照不适合承接当前任务的细粒度临时偏移

## 7. 适合进入 overrides 的字段

V1 推荐 task runtime overrides 只覆盖少量高价值字段。

### 7.1 `agent_mode`

用于表达：

- 当前任务强制 `single-agent`
- 当前任务强制 `multi-agent`

适合在：

- 风险特殊
- 文件边界特殊
- 当前任务明确不适合多 agent

的情况下使用。

### 7.2 `auto_advance_target`

用于表达：

- 当前任务自动推进只到 `submission`
- 或仍允许到 `push`

它用于覆盖项目默认的：

- `default_auto_advance_target`

### 7.3 `auto_push_enabled`

用于表达：

- 当前任务是否允许自动推进到 `git push`

即使项目默认允许自动 push，某个任务仍可能临时关闭。

### 7.4 `blocked_recovery_policy`

用于表达：

- blocked 后只能人工恢复
- blocked 恢复后是否允许继续自动推进

### 7.5 `diagnostics_input_mode`

用于表达：

- 当前任务是否启用 diagnostics 输入
- 当前任务 diagnostics 是否只接受 `file-intake`

### 7.6 `protected_mode`

用于表达：

- 当前任务进入更严格保护模式

例如：

- 命中架构核心文件
- 命中高风险路径

## 8. 当前不适合进入 overrides 的字段

V1 不建议把以下内容放进 task runtime overrides：

- `enabled_phases`
- `phase_order`
- plugin 合同定义
- schema 版本定义
- diagnostics 根目录
- plugin registry 清单

这些都属于：

- 内核合同
- 项目级配置
- 系统级稳定对象

不属于单任务临时偏移范围。

## 9. 生命周期内生效规则

### 9.1 生效时机

V1 中 task runtime overrides 建议在以下时机形成：

- planning 完成后
- `开始执行` 前

也就是说：

- 任务级覆盖应作为执行前控制面的一部分被确认

### 9.2 生效范围

它一旦生效，应影响：

- 当前任务后续执行
- 当前任务的验证
- 当前任务的提交与收口策略

### 9.3 失效时机

当前任务进入真正收口完成态后，task runtime overrides 应视为失效。

它不应：

- 被下一个任务默认继承
- 被下一批次默认继承
- 被项目默认值吸收

## 10. 与 runtime schema 的关系

V1 推荐在 `current-task` 的 schema 中增加或保留一个字段组：

```yaml
runtime_overrides:
  agent_mode:
  auto_advance_target:
  auto_push_enabled:
  blocked_recovery_policy:
  diagnostics_input_mode:
  protected_mode:
```

这组字段的特点是：

- 可以为空
- 一旦存在，只代表当前任务偏移

它不是 schema 顶层强必填字段，但属于建议保留的扩展锚点。

## 11. 与 project config 的关系

两者关系应为：

- project config
  - 提供默认策略
- task runtime overrides
  - 提供当前任务偏移

例如：

- 项目默认：
  - `default_agent_mode = single-agent`
- 当前任务 override：
  - `agent_mode = multi-agent`

此时仅当前任务进入 `multi-agent`，项目默认值保持不变。

## 12. 与控制口令和阶段的关系

task runtime overrides 本身不是口令，也不是 phase。

它更像：

- execution 之前的任务控制面补丁

因此：

- 它不替代 `开始执行`
- 也不替代 planning
- 它是在 planning 之后、execution 之前形成的任务级执行偏移对象

## 13. 与 blocked / diagnostics 的关系

这层覆盖尤其适合承接：

- blocked 恢复策略
- diagnostics 输入模式

原因是这两类内容经常具有：

- 任务级特异性
- 风险级特异性

但又不适合升级为项目默认值。

## 14. V1 明确不包含

本次模型明确不包含：

- 任务级 overrides 独立文件
- overrides 持久化历史系统
- overrides 自动迁移机制
- 多任务继承链
- overrides 与外部配置中心同步

V1 只先定义：

- 当前任务临时覆盖对象
- 它的推荐承接位置
- 它和 project config / runtime 的边界

## 15. 总结

Harness task runtime overrides 模型 V1 可以压缩成一句：

它是写入 `current-task` 的一段任务级临时控制对象，用于在不污染项目默认配置的前提下，对当前任务的 agent_mode、自动推进、blocked 恢复和 diagnostics 策略做局部偏移。

没有这层模型，Harness 的很多任务级特殊策略只能继续靠对话记忆或手工改项目默认值维持，无法形成稳定控制面。
