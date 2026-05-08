---
title: Harness 生命周期默认配置样例 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: config-model-v1, phase-hook-plugin-contract-v1
---

# Harness 生命周期默认配置样例 V1

## 1. 目标

本文档用于给出一份可直接参考的 Harness 生命周期默认配置样例，使前面已经定义的：

- `config-model-v1`
- `phase-hook-plugin-contract-v1`

不只停留在抽象层，而能进一步回答：

- 默认 phase 顺序是什么
- 默认 auto-advance 到哪里
- 默认启用哪些插件
- 默认 task strategy 如何分层
- 默认 runtime 写到什么粒度

本文档是样例文档，不等于当前仓库已经落地的真实配置文件实现。

## 2. 使用定位

这份样例的定位是：

- V1 内核默认配置草案
- 后续 `harness.config.json` 或 `.harness/config.json` 的参考基线
- package-ready 前的配置设计样板

它不直接替代：

- `AGENTS.md`
- `skills/*/SKILL.md`
- runtime 真实实例文件

## 3. 设计原则

### 3.1 先给稳定默认值，不给复杂配置平台

当前阶段目标不是做一个超大配置中心，而是先给：

- 生命周期默认顺序
- 默认自动推进策略
- 默认插件启用集合
- 默认 runtime 写入粒度

### 3.2 默认值必须贴合当前已验证能力

样例默认值必须基于当前已经证明的能力，而不是想象中的未来能力。

因此：

- `total-mr-ready` 仍是当前 closure 终点
- 更大规模多 agent 并发不应被写成完全闭环
- diagnostics 只写文件复制式 intake，不写复杂自动采集

### 3.3 默认值应支持项目覆盖

这份样例是内核默认配置的参考值，项目级配置可以覆盖，但不应破坏合同。

## 4. 样例结构

建议的最小结构如下：

```json
{
  "version": "1",
  "lifecycle": {},
  "plugins": {},
  "task_strategy": {},
  "runtime": {},
  "diagnostics": {}
}
```

## 5. 生命周期默认配置样例

```json
{
  "version": "1",
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
    "closure_terminal_phase": "total-mr-ready",
    "start_command_is_global_authorization": true,
    "submit_result_is_internal_node": true
  }
}
```

### 5.1 字段说明

- `enabled_phases`
  - 当前项目启用的 phase 列表
- `phase_order`
  - 生命周期默认顺序
- `default_auto_advance_target`
  - 默认自动推进终点
- `blocked_enabled`
  - 是否启用 blocked / resume 机制
- `closure_terminal_phase`
  - 当前体系下 closure 的阶段性终点
- `start_command_is_global_authorization`
  - `开始执行` 是否作为总授权点
- `submit_result_is_internal_node`
  - `提交结果` 是否作为内部展示节点

## 6. 插件默认配置样例

```json
{
  "plugins": {
    "enabled": [
      "harness-task-flow",
      "ai-subtask-orchestration",
      "harness-runtime-recording",
      "document-governance",
      "diagnostics-provider"
    ],
    "order": [
      "harness-task-flow",
      "ai-subtask-orchestration",
      "document-governance",
      "harness-runtime-recording",
      "diagnostics-provider"
    ],
    "required_plugins": ["harness-task-flow", "harness-runtime-recording"],
    "failure_overrides": {
      "harness-task-flow": "block",
      "harness-runtime-recording": "block",
      "document-governance": "warn",
      "ai-subtask-orchestration": "warn",
      "diagnostics-provider": "warn"
    }
  }
}
```

### 6.1 默认策略解释

- `harness-task-flow`
  - 属于主链路 owner，失败应阻断
- `harness-runtime-recording`
  - 属于控制面写入核心，失败应阻断
- `document-governance`
  - 当前阶段可降级为告警，不阻断主链路
- `ai-subtask-orchestration`
  - 非多 agent / 非批次场景可降级为告警
- `diagnostics-provider`
  - 当前阶段不应阻断主执行链路

## 7. Task Strategy 默认配置样例

```json
{
  "task_strategy": {
    "default_agent_mode": "single-agent",
    "default_batching_policy": "single-task-first",
    "versioning_domains": ["harness-core"],
    "high_risk_domains": ["project-architecture", "harness-core"],
    "domain_profiles": {
      "harness-core": {
        "doc_update_required_by_default": true,
        "versioning_check_required": true,
        "allow_auto_push_after_start": true
      },
      "project-architecture": {
        "doc_update_required_by_default": true,
        "prefer_analysis_work_item": true,
        "require_structure_confirmation_before_start": true
      },
      "project-feature": {
        "doc_update_required_by_default": false,
        "allow_auto_push_after_start": true
      },
      "project-bugfix": {
        "doc_update_required_by_default": false,
        "prefer_diagnostics": true,
        "blocked_runtime_preferred": true
      },
      "project-docs": {
        "doc_update_required_by_default": true,
        "allow_auto_push_after_start": true,
        "simple_task_auto_closure_preferred": true
      },
      "governance": {
        "doc_update_required_by_default": true,
        "versioning_check_required": false
      }
    }
  }
}
```

### 7.1 策略解释

- `harness-core`
  - 默认命中文档和版本治理判断
- `project-architecture`
  - 默认要求结构确认更严格
- `project-feature`
  - 默认走一般自动推进
- `project-bugfix`
  - 默认偏诊断和 blocked
- `project-docs`
  - 默认偏快速自动闭环

## 8. Runtime 默认配置样例

```json
{
  "runtime": {
    "enabled_files": [
      "current-task.yaml",
      "current-batch.yaml",
      "trial-feedback.yaml",
      "manual-validation.yaml",
      "events.log"
    ],
    "event_level": "checkpoint",
    "multi_agent_sync_enabled": true,
    "blocked_runtime_enabled": true,
    "batch_advance_enabled": true,
    "batch_closure_enabled": true,
    "total_acceptance_enabled": true,
    "total_mr_ready_enabled": true
  }
}
```

### 8.1 默认策略解释

- `event_level = checkpoint`
  - 当前仍坚持“快照为主，事件为辅”
- `multi_agent_sync_enabled = true`
  - 当前已具备可见的并发状态同步
- `blocked_runtime_enabled = true`
  - 当前 blocked 进入 / 恢复已有真实动作
- `batch_advance_enabled = true`
  - 当前中任务可切下一任务
- `batch_closure_enabled = true`
  - 当前最后一个中任务可自动进入总收口
- `total_acceptance_enabled / total_mr_ready_enabled = true`
  - 当前总收口后的两步推进已具备真实动作

## 9. Diagnostics 默认配置样例

```json
{
  "diagnostics": {
    "enabled": true,
    "mode": "file-intake",
    "issue_root": ".harness-diagnostics/issues",
    "default_input_files": [
      ".harness-runtime/current-task.yaml",
      ".harness-runtime/current-batch.yaml",
      ".harness-runtime/manual-validation.yaml",
      ".harness-runtime/events.log"
    ],
    "auto_collect_external_logs": false,
    "auto_remediation": false
  }
}
```

### 9.1 默认策略解释

- `mode = file-intake`
  - 当前只支持文件拷贝式诊断输入
- `auto_collect_external_logs = false`
  - 当前不做外部平台自动抓取
- `auto_remediation = false`
  - 当前不做自动修复执行

## 10. 完整样例

```json
{
  "version": "1",
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
    "closure_terminal_phase": "total-mr-ready",
    "start_command_is_global_authorization": true,
    "submit_result_is_internal_node": true
  },
  "plugins": {
    "enabled": [
      "harness-task-flow",
      "ai-subtask-orchestration",
      "harness-runtime-recording",
      "document-governance",
      "diagnostics-provider"
    ],
    "order": [
      "harness-task-flow",
      "ai-subtask-orchestration",
      "document-governance",
      "harness-runtime-recording",
      "diagnostics-provider"
    ],
    "required_plugins": ["harness-task-flow", "harness-runtime-recording"],
    "failure_overrides": {
      "harness-task-flow": "block",
      "harness-runtime-recording": "block",
      "document-governance": "warn",
      "ai-subtask-orchestration": "warn",
      "diagnostics-provider": "warn"
    }
  },
  "task_strategy": {
    "default_agent_mode": "single-agent",
    "default_batching_policy": "single-task-first",
    "versioning_domains": ["harness-core"],
    "high_risk_domains": ["project-architecture", "harness-core"]
  },
  "runtime": {
    "enabled_files": [
      "current-task.yaml",
      "current-batch.yaml",
      "trial-feedback.yaml",
      "manual-validation.yaml",
      "events.log"
    ],
    "event_level": "checkpoint",
    "multi_agent_sync_enabled": true,
    "blocked_runtime_enabled": true,
    "batch_advance_enabled": true,
    "batch_closure_enabled": true,
    "total_acceptance_enabled": true,
    "total_mr_ready_enabled": true
  },
  "diagnostics": {
    "enabled": true,
    "mode": "file-intake",
    "issue_root": ".harness-diagnostics/issues",
    "default_input_files": [
      ".harness-runtime/current-task.yaml",
      ".harness-runtime/current-batch.yaml",
      ".harness-runtime/manual-validation.yaml",
      ".harness-runtime/events.log"
    ],
    "auto_collect_external_logs": false,
    "auto_remediation": false
  }
}
```

## 11. 当前阶段不建议写入的字段

以下字段当前阶段不建议提前放进默认配置：

- 完整 method registry
- 外部平台 API 集成
- 发布流水线细粒度配置
- package export 细粒度矩阵
- 多租户或多项目配置继承树

原因是当前更需要先稳：

- phase
- hook
- plugin contract
- runtime 行为

## 12. 与未来真实配置文件的关系

当后续进入 package-ready 阶段时，这份样例可直接演进为：

- `harness.config.json`
- 或 `.harness/config.json`

但在当前阶段，它首先是：

- 设计基线
- 项目覆盖参考
- package 化前的协议样例

## 13. 当前阶段总结

Harness 生命周期默认配置样例 V1 可以压缩成一句：

它把当前已经验证通过的生命周期、插件、任务策略、runtime 和 diagnostics 默认行为，收成一份可被后续项目配置和 package 入口复用的最小默认配置基线。
