---
title: Harness project config 与 plugin registry 装配示例 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: config-model-v1, project-config-location-and-naming-v1, plugin-registry-and-manifest-model-v1, plugin-attach-and-resolution-rules-v1, phase-owner-enhancer-recommended-mapping-v1
---

# Harness project config 与 plugin registry 装配示例 V1

## 1. 目标

本文档用于把 Harness 当前已经形成的：

- `project config`
- `plugin registry`
- `plugin manifest`
- `phase owner / enhancer 推荐映射`
- `attach / resolution 规则`

组合成一份可直接参考的装配示例，回答：

- 项目级 config 应该如何引用 plugin registry
- plugin registry 如何和 project config 分工
- 默认 owner / enhancer 映射如何进入项目装配
- 哪些位置允许项目覆盖

## 2. 设计原则

### 2.1 示例服务于装配，不替代 schema

本文档的目标不是重新定义 schema，而是提供一份：

- 可读
- 可实现
- 可作为后续 `/.harness/config.json` 与 `/.harness/plugins.json` 基线

的组合样例。

### 2.2 仍保持三层分工

V1 必须保持以下分层不变：

- `plugin manifest`
  - 单个 plugin 自我声明
- `plugin registry`
  - 当前项目有哪些 plugin 可被发现
- `project config`
  - 当前项目实际采用什么装配策略

### 2.3 示例只覆盖当前已验证能力

当前阶段装配示例只应覆盖当前已成形的能力，例如：

- `harness-task-flow`
- `ai-subtask-orchestration`
- `harness-runtime-recording`
- `document-governance`
- `diagnostics-provider`

不引入尚未成形的假想 plugin。

## 3. V1 推荐装配对象

V1 推荐至少包含两个项目级文件：

- `/.harness/config.json`
- `/.harness/plugins.json`

其中：

- `config.json`
  - 负责当前项目策略
- `plugins.json`
  - 负责当前项目 plugin registry

## 4. `plugins.json` 示例

V1 推荐的项目级 plugin registry 可参考：

```json
{
  "schema_version": "v1",
  "plugins": [
    {
      "plugin_id": "harness-task-flow",
      "manifest_path": "skills/harness-task-flow/plugin.json",
      "enabled": true,
      "order": 10,
      "required": true
    },
    {
      "plugin_id": "ai-subtask-orchestration",
      "manifest_path": "skills/ai-subtask-orchestration/plugin.json",
      "enabled": true,
      "order": 20,
      "required": false
    },
    {
      "plugin_id": "harness-runtime-recording",
      "manifest_path": "skills/harness-runtime-recording/plugin.json",
      "enabled": true,
      "order": 30,
      "required": true
    },
    {
      "plugin_id": "document-governance",
      "manifest_path": "skills/document-governance/plugin.json",
      "enabled": true,
      "order": 40,
      "required": false
    },
    {
      "plugin_id": "diagnostics-provider",
      "manifest_path": "skills/diagnostics-provider/plugin.json",
      "enabled": true,
      "order": 50,
      "required": false
    }
  ]
}
```

## 5. `config.json` 示例

V1 推荐的项目级 config 可参考：

```json
{
  "schema_version": "v1",
  "lifecycle": {
    "enabled_phases": [
      "requirement-analysis",
      "boundary",
      "planning",
      "execution",
      "verification",
      "submission",
      "closure"
    ],
    "phase_order": [
      "requirement-analysis",
      "boundary",
      "planning",
      "execution",
      "verification",
      "submission",
      "closure"
    ],
    "default_auto_advance_target": "push",
    "blocked_enabled": true,
    "closure_terminal_phase": "total-mr-ready"
  },
  "plugins": {
    "registry_path": "/.harness/plugins.json",
    "required_plugins": ["harness-task-flow", "harness-runtime-recording"],
    "phase_mapping_profile": "default-v1"
  },
  "task_strategy": {
    "default_agent_mode": "single-agent",
    "default_batching_policy": "auto-detect",
    "high_risk_domains": ["harness-core", "project-architecture"],
    "versioning_domains": ["harness-core"]
  },
  "runtime": {
    "enabled_files": [
      "current-task",
      "current-batch",
      "manual-validation",
      "trial-feedback",
      "events"
    ],
    "event_level": "standard",
    "multi_agent_sync_enabled": true,
    "blocked_runtime_enabled": true
  },
  "diagnostics": {
    "enabled": true,
    "mode": "file-intake",
    "issue_root": "/.harness-diagnostics/issues"
  }
}
```

## 6. phase owner / enhancer 映射如何进入装配

`phase-owner-enhancer-recommended-mapping-v1.md` 提供的是默认推荐方向。

V1 推荐 project config 通过：

- `plugins.phase_mapping_profile`

引用该默认映射。

也就是说：

- `default-v1`
  - 表示采用当前推荐映射

当前阶段不要求把每个 phase 的 owner / enhancer 全部平铺进 `config.json`。

## 7. 推荐默认映射的装配理解

当：

- `phase_mapping_profile = default-v1`

时，默认装配可理解为：

- `harness-task-flow`
  - 作为全 phase 默认 owner
- `ai-subtask-orchestration`
  - 在 `requirement-analysis / planning / execution / closure` 作为 enhancer
- `harness-runtime-recording`
  - 作为统一 runtime-writer
- `document-governance`
  - 在文档相关 phase 作为 enhancer
- `diagnostics-provider`
  - 在 diagnostics 高相关 phase 作为 enhancer

## 8. 项目允许覆盖的位置

V1 推荐允许项目覆盖以下内容：

### 8.1 plugin 启用状态

例如：

- 关闭 `diagnostics-provider`
- 暂时禁用 `document-governance`

### 8.2 plugin 顺序

例如：

- 提升 diagnostics plugin 的 order
- 调整 enhancer 的解析顺序

### 8.3 phase mapping profile

例如：

- 从 `default-v1` 切到某个自定义 profile

### 8.4 task 策略

例如：

- 某项目默认 multi-agent candidate
- 某项目默认 docs-only 不自动 push

## 9. 不建议在 project config 中直接写的内容

V1 不建议把以下内容直接塞进 `config.json`：

- 每个 plugin 全量 manifest 字段
- 当前任务临时 override
- 当前 issue runtime
- 当前 blocked 状态
- 当前当前 / 下一任务快照

这些对象应分别归属于：

- manifest
- task runtime overrides
- diagnostics runtime
- runtime snapshots

## 10. 与 attach / resolution 的关系

装配示例的最终执行逻辑仍应服从：

- `plugin-attach-and-resolution-rules-v1`

也就是说：

- registry 决定项目有哪些 plugin 可发现
- config 决定项目默认怎么装配
- task runtime overrides 决定当前任务怎么临时改写
- attach / resolution 决定运行时最终谁生效

## 11. 当前阶段明确不包含

V1 明确不包含：

- 远程 plugin marketplace 装配
- 多 registry 合并
- 自动安装 plugin
- profile 继承系统
- 图形化装配器

## 12. 总结

Harness project config 与 plugin registry 装配示例 V1 的核心结论是：

- 项目级推荐使用：
  - `/.harness/config.json`
  - `/.harness/plugins.json`
- `plugins.json` 负责项目可发现 plugin 清单
- `config.json` 负责项目实际装配策略
- phase owner / enhancer 推荐映射通过 profile 方式进入装配
- 最终运行态仍由：
  - config
  - registry
  - runtime overrides
  - attach / resolution共同决定
