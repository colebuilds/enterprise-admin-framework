---
title: Harness plugin registry / plugin manifest 模型 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-03
related_decisions: phase-hook-plugin-contract-v1, config-model-v1, project-config-location-and-naming-v1, core-architecture-v2
---

# Harness plugin registry / plugin manifest 模型 V1

## 1. 目标

本文档用于把 Harness 当前已经形成的 plugin 接入方向，继续细化为：

- `plugin manifest`
- `plugin registry`

两个对象层，使系统不只知道：

- plugin contract 怎么定义

还知道：

- 单个 plugin 应如何声明自己
- 项目如何维护启用中的 plugin 清单
- registry 和 project config、plugin contract 分别承担什么职责

本文档回答的问题是：

- 什么是 `plugin manifest`
- 什么是 `plugin registry`
- plugin manifest 与 plugin contract 的关系是什么
- project config 为什么不能代替 registry
- V1 中 plugin registry 应放在哪、写什么、怎么用

## 2. 设计原则

### 2.1 contract、manifest、registry 三层分离

V1 必须把下面三层分开：

- `plugin contract`
  - 定义 plugin 至少要满足哪些能力边界
- `plugin manifest`
  - 定义单个 plugin 自身声明
- `plugin registry`
  - 定义当前项目可发现、可装配、可排序的 plugin 清单

如果这三层混在一起，后续会出现：

- plugin 元信息散落
- project config 过重
- plugin 可发现性不稳定

### 2.2 project config 负责装配，不负责替代 registry

project config 回答的是：

- 当前项目启用了哪些 plugin
- 顺序如何
- 哪些是 required

但它不适合承接：

- plugin 的全部自我描述
- plugin 来源说明
- plugin 版本或状态说明

这些应由 manifest / registry 承接。

### 2.3 V1 先支持最小可发现模型

当前阶段不做：

- plugin marketplace
- 远程拉取
- 自动安装
- 多仓库中心化 registry

V1 只需要解决：

- 当前项目里有哪些 plugin
- 每个 plugin 是什么角色
- 是否启用
- 顺序如何

## 2.4 P0 收口补充

自 `2026-04-03` 起，plugin registry / manifest 不再只停留在文档模型层。

当前仓库内的最小真实落地约定为：

- 项目级 registry：
  - `/.harness/plugins.json`
- 核心 skill 可拥有各自的 `plugin.json`
- 无 skill 目录承接的 plugin，可先落到：
  - `/.harness/plugins/*.json`

当前阶段的目标不是完整 plugin marketplace，而是：

- 让 `inspect-assembly` 真实消费 registry / manifest
- 让 `inspect-plugin-manifest` 真实读取单个 plugin manifest
- 让 `inspect-plugin-runtime` 在最小范围内消费 manifest attach / failure policy

## 3. 三层对象关系

### 3.1 `plugin contract`

`plugin contract` 负责定义 plugin 至少声明什么能力边界，例如：

- `plugin_id`
- `plugin_role`
- `attached_phases`
- `attached_hooks`
- `reads`
- `writes`
- `failure_policy`

它是抽象合同，不代表某个具体 plugin 的实际清单。

### 3.2 `plugin manifest`

`plugin manifest` 负责定义单个 plugin 的自我声明。

它应回答：

- 我是谁
- 我是什么角色
- 我默认挂在哪些 phase / hook
- 我读什么
- 我写什么
- 我是否稳定

### 3.3 `plugin registry`

`plugin registry` 负责定义当前项目层面“有哪些 plugin 可被发现和装配”。

它应回答：

- 当前项目有哪些 plugin
- 它们的 manifest 在哪里
- 默认启用状态是什么
- 默认顺序是什么
- 是否为 required

## 4. plugin manifest 模型 V1

### 4.1 manifest 定位

`plugin manifest` 是单个 plugin 的元信息文件。

它不是：

- plugin 正文实现
- plugin config 文件
- runtime 快照

它只负责描述 plugin 自己。

### 4.2 manifest 建议字段

V1 建议 `plugin manifest` 至少包含：

```yaml
plugin_id:
plugin_name:
plugin_role:
status:
source:
attached_phases:
attached_hooks:
reads:
writes:
default_enabled:
default_order:
failure_policy:
```

### 4.3 字段说明

- `plugin_id`
  - plugin 唯一标识
- `plugin_name`
  - 可读名称
- `plugin_role`
  - plugin 角色，例如：
    - `phase-owner`
    - `phase-enhancer`
    - `runtime-writer`
    - `verifier`
    - `diagnostics-provider`
- `status`
  - 当前成熟度，例如：
    - `trial`
    - `draft`
    - `stable`
- `source`
  - plugin 来源路径或归属
- `attached_phases`
  - 默认挂载到哪些 phase
- `attached_hooks`
  - 默认挂到哪些 hook
- `reads`
  - 读取哪些对象
- `writes`
  - 写入哪些对象
- `default_enabled`
  - 默认是否启用
- `default_order`
  - 默认顺序
- `failure_policy`
  - 失败时是 `block / warn / ignore`

### 4.4 manifest 与 skill 的关系

当前阶段的现实情况是：

- 很多 plugin 仍以 `skills/*/SKILL.md` 形式存在

因此 V1 应允许：

- `SKILL.md` 仍是行为正文
- `plugin manifest` 只做结构化元信息层

也就是说：

- `SKILL.md`
  - 描述如何做
- `manifest`
  - 描述它是什么、接到哪里

## 5. plugin registry 模型 V1

### 5.1 registry 定位

`plugin registry` 是项目级的可发现 plugin 清单。

它不替代：

- plugin manifest
- project config

它负责把当前项目的 plugin 目录和默认装配清单稳定收口。

### 5.2 registry 建议字段

V1 建议 registry 至少包含：

```yaml
schema_version:
plugins:
```

### 5.2A 当前仓库的最小真实落地

当前仓库已经按 V1 最小方式落地：

- `/.harness/plugins.json`
- `skills/harness-task-flow/plugin.json`
- `skills/ai-subtask-orchestration/plugin.json`
- `skills/document-governance/plugin.json`
- `skills/harness-runtime-recording/plugin.json`
- `/.harness/plugins/diagnostics-provider.plugin.json`

这意味着当前 plugin layer 已从“空 registry + 内核默认值”推进到“仓库内真实 registry / manifest 可消费”的阶段。

其中每个 plugin entry 最少应包含：

```yaml
plugin_id:
manifest_path:
enabled:
order:
required:
```

### 5.3 entry 字段说明

- `plugin_id`
  - 对应 manifest 中的唯一标识
- `manifest_path`
  - manifest 文件路径
- `enabled`
  - 当前项目默认是否启用
- `order`
  - 当前项目默认顺序
- `required`
  - 当前项目是否强制要求该 plugin 存在

### 5.4 registry 与 project config 的关系

两者分工建议如下：

- `plugin registry`
  - 解决“有哪些 plugin 可被发现”
- `project config.plugins`
  - 解决“当前项目实际怎么装配”

也就是说：

- registry 更偏清单层
- config 更偏实例化层

如果项目很小，V1 允许两者暂时保持较近，但概念上必须分开。

## 6. 文件落点建议

### 6.1 plugin manifest 落点

V1 推荐每个 plugin 的 manifest 和其实现放在一起。

例如：

- `skills/harness-task-flow/plugin.manifest.json`
- `skills/ai-subtask-orchestration/plugin.manifest.json`
- `skills/harness-runtime-recording/plugin.manifest.json`

这样有两个好处：

- 元信息和 plugin 行为正文相邻
- 后续迁移为 package 或 registry 时路径清楚

### 6.2 plugin registry 落点

结合当前项目配置目录约定，V1 推荐项目级 registry 放在：

- `/.harness/plugins.json`

而不是：

- 根目录继续堆更多 `*.json`

### 6.3 与 project config 的关系

V1 中推荐：

- `/.harness/config.json`
  - 项目默认策略
- `/.harness/plugins.json`
  - 项目可发现 plugin 清单

如果只想保留最小实现，也允许暂时只有：

- `/.harness/config.json`

但架构上仍应把 registry 单独建模。

## 7. 当前核心 plugin 的 manifest 映射建议

基于当前体系，至少可映射以下 plugin：

- `harness-task-flow`
- `ai-subtask-orchestration`
- `harness-runtime-recording`
- `document-governance`
- `diagnostics-provider`

建议角色例如：

- `harness-task-flow`
  - `phase-owner`
- `ai-subtask-orchestration`
  - `phase-enhancer`
- `harness-runtime-recording`
  - `runtime-writer`
- `document-governance`
  - `phase-enhancer`
- `diagnostics-provider`
  - `diagnostics-provider`

## 8. 优先级与发现顺序

V1 推荐的优先顺序为：

1. 读取 `/.harness/plugins.json`
2. 读取 registry 中声明的 `manifest_path`
3. 再结合 `/.harness/config.json` 决定最终启用、顺序和失败策略

如果没有 `/.harness/plugins.json`，则允许退化为：

- 直接由 `config.plugins` 驱动最小装配

但这只是兼容退化模式，不是长期推荐模式。

## 9. 与任务运行时的边界

plugin registry 和 manifest 不应承接运行时状态。

它们不应记录：

- 当前 plugin 是否正在执行
- 当前 plugin 是否刚刚失败
- 当前任务执行到哪个 phase

这些都属于：

- runtime
- events

而不是 registry / manifest。

## 10. 与 package 化阶段的关系

Harness 当前仍处于：

- `in-repo incubation`

因此 V1 的 plugin registry / manifest 模型目标是：

- 先稳定 plugin 自描述
- 先稳定项目可发现 plugin 清单
- 先稳定 project config 与 plugin registry 的分工

而不是直接进入：

- npm plugin marketplace
- 远程安装和发布生态

但这套模型应为后续 package 化保留路径。

## 11. 当前阶段明确不包含

本次模型明确不包含：

- 远程 plugin marketplace
- 自动安装 / 卸载机制
- plugin version resolver
- 多项目共享 registry 服务
- plugin sandbox 权限系统

这些都留到后续阶段。

## 12. 总结

Harness plugin registry / plugin manifest 模型 V1 可以压缩成一句：

plugin contract 定义能力边界，plugin manifest 定义单个 plugin 的自我声明，plugin registry 定义当前项目的可发现 plugin 清单，project config 再基于它们做实际装配。

只有把这三层分开，Harness 才能真正从“内置 skill 体系”稳定升级为“可插拔 plugin 体系”。
