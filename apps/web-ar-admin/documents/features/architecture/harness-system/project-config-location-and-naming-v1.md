---
title: Harness project config 文件落点与命名约定 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: config-model-v1, lifecycle-default-config-example-v1, runtime-and-config-schema-v1, core-architecture-v2
---

# Harness project config 文件落点与命名约定 V1

## 1. 目标

本文档用于定义 Harness 在项目级配置上的最小文件落点与命名约定，明确：

- 项目级 config 文件应该放在哪里
- 默认文件名应是什么
- 根目录与 `.harness/` 目录如何分工
- 多个候选配置文件同时存在时如何判定优先级
- 哪些对象属于项目级配置，哪些不属于

本文档回答的问题是：

- V1 当前推荐的 project config 文件落点是什么
- `harness.config.json` 与 `.harness/config.json` 哪个应优先
- 什么时候应使用根目录配置，什么时候应使用 `.harness/` 目录
- 任务运行时覆盖为什么不应写回项目级配置

## 2. 设计原则

### 2.1 先给稳定落点，不做复杂配置系统

V1 目标不是做多层配置中心，而是给出：

- 足够稳定的默认位置
- 足够清楚的命名规则
- 足够简单的优先级

让后续：

- kernel defaults
- project config
- task runtime overrides

能稳定分层。

### 2.2 根目录配置优先简洁，`.harness/` 目录优先系统化

V1 应同时支持两种可读路径：

- 根目录单文件
- `.harness/` 目录内文件

但必须明确默认推荐值，而不是两套同等地位长期并存。

### 2.3 配置文件只承接项目级稳定策略

项目级配置文件只应用于承接：

- 生命周期默认策略
- 插件装配策略
- task domain 策略
- runtime 粒度策略
- diagnostics 开关和目录策略

它不应用于承接：

- 当前任务临时状态
- 当前 blocked 状态
- 当前执行入口
- 当前 issue 目录实例

这些都属于 runtime 或 diagnostics 运行态。

## 3. 配置层分工回顾

在 V1 中，配置层已明确分为三层：

- `kernel defaults`
- `project harness config`
- `task runtime overrides`

本文件只定义：

- `project harness config`

的文件落点与命名约定。

## 4. V1 推荐落点

### 4.1 首选落点

V1 推荐的首选项目级配置文件为：

- `/.harness/config.json`

理由是：

- 与 `/.harness-runtime/`
- `/.harness-diagnostics/`

形成更清晰的系统目录分层

也能避免项目根目录继续堆积大量系统文件。

### 4.2 兼容落点

为降低 V1 接入成本，允许兼容：

- `/harness.config.json`

该文件的定位是：

- 过渡期或轻量项目的单文件配置入口

但它不应作为长期主推荐形态。

### 4.3 不推荐落点

V1 不推荐以下做法：

- 把 Harness 配置混进 `package.json`
- 把 Harness 配置分散在多个普通文档文件里
- 把任务运行时状态写进项目级配置文件

原因是这些方式会造成：

- 配置边界不清
- 运行态和默认值混写
- 后续 package 化时迁移困难

## 5. 命名约定

### 5.1 推荐命名

V1 推荐命名如下：

- 主配置文件：
  - `/.harness/config.json`
- 兼容单文件：
  - `/harness.config.json`

### 5.2 为什么暂不拆更多文件

当前阶段不建议立刻拆成：

- `plugins.json`
- `runtime.json`
- `diagnostics.json`

因为 V1 更重要的是：

- 先把项目级默认策略收进一个稳定配置对象

而不是一开始做多文件配置目录。

### 5.3 为什么当前使用 `json`

V1 推荐先用 `json`，原因是：

- 结构清楚
- 和 schema 文档更好对应
- 适合后续自动校验
- 不会和 runtime 的 `yaml` 快照语义混淆

## 6. 根目录与 `.harness/` 的职责分工

### 6.1 根目录

根目录下只保留少量系统入口对象，V1 中包括：

- `harness.config.json`（兼容入口）
- `/.harness-version.json`
- `/.harness-runtime/`
- `/.harness-diagnostics/`

其中：

- `harness.config.json`
  - 仅作为兼容入口

### 6.2 `.harness/`

`.harness/` 在 V1 中应作为 Harness 项目级配置与后续系统元数据的推荐目录。

当前阶段至少推荐承接：

- `config.json`

后续如有需要，可继续扩展：

- `plugin-registry.json`
- `defaults.json`
- `profiles/`

但这些不属于 V1 强制范围。

## 7. 配置发现顺序

V1 推荐的项目级配置发现顺序如下：

1. `/.harness/config.json`
2. `/harness.config.json`
3. 若两者都不存在，则回退到 kernel defaults

### 7.1 同时存在时的处理

若以下两个文件同时存在：

- `/.harness/config.json`
- `/harness.config.json`

则应以：

- `/.harness/config.json`

为准。

根目录 `harness.config.json` 此时应视为：

- 兼容层
- 或待迁移旧入口

不应与 `/.harness/config.json` 并列生效。

## 8. 文件内容边界

### 8.1 允许承接的内容

项目级配置文件允许承接：

- `lifecycle`
- `plugins`
- `task_strategy`
- `runtime`
- `diagnostics`

这与现有 config schema V1 保持一致。

### 8.2 不应承接的内容

项目级配置文件不应承接：

- 当前激活任务
- 当前 phase 快照
- 当前 blocked 状态
- 当前 issue 目录实例
- 当前 agent 运行态
- 当前批次推进结果

这些对象属于：

- runtime
- diagnostics 运行态
- task runtime overrides

## 9. 与 task runtime overrides 的关系

V1 必须明确：

- 项目级配置 = 稳定默认值
- task runtime overrides = 当前任务临时覆盖

例如：

- 当前任务强制 `single-agent`
- 当前任务禁止自动 push
- 当前任务 blocked 后不可自动恢复

这些都不应回写到：

- `/.harness/config.json`
- `/harness.config.json`

而应进入 runtime 或任务运行时对象。

## 10. 与 package 化阶段的关系

Harness 当前仍处于：

- `in-repo incubation`

因此 V1 的配置落点目标是：

- 稳定
- 可发现
- 可迁移

而不是提前做成完整 npm package 配置平台。

当前推荐 `/.harness/config.json` 的一个重要原因，就是后续 package 化时更容易迁移为：

- package 初始化时生成的默认项目配置
- 或 package CLI 自动读取的项目配置入口

## 11. V1 明确不包含

本次约定明确不包含：

- 多项目配置注册中心
- GUI 配置器
- 远程配置下发
- 配置热更新
- 多文件 profile 组合系统

这些都应留到后续阶段，而不是压进 V1。

## 12. 总结

Harness project config 文件落点与命名约定 V1 可以压缩成一句：

项目级 Harness 配置在 V1 中应优先使用 `/.harness/config.json`，允许兼容 `/harness.config.json`，并按“`.harness/` 优先、根目录兼容、runtime 不混写”的原则组织。

这样才能让：

- config model
- default config example
- config schema

真正拥有稳定的项目级文件落点。
