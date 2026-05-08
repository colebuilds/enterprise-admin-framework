---
title: Harness package 结构与 exports map V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-export-boundary-v1, package-ready-kernel-convergence-checklist-v1, core-architecture-v2
---

# Harness package 结构与 exports map V1

## 1. 目标

本文档用于把 `package export boundary V1` 继续推进到：

- future package 目录怎么组织
- 最小 `exports` map 长什么样
- 哪些入口可以导出
- 哪些入口必须明确不导出

它仍然不负责真实拆包实现，也不修改当前仓库根 `package.json`。

## 2. 当前真实实现基础

当前 Harness 内核的真实代码结构为：

- `scripts/harness-runtime/core/`
  - `runtime-state.mjs`
  - `plugin-assembly.mjs`
  - `phase-contracts.mjs`
  - `phase-resolution.mjs`
  - `shared.mjs`
- `scripts/harness-runtime/host/`
  - `codex-adapter.mjs`
- `scripts/harness-runtime/diagnostics/`
  - `index.mjs`
- `scripts/harness-runtime/tests/`
  - 最小自动回归
- `scripts/harness-runtime.mjs`
  - 当前仓库内 CLI 入口

因此，future package 结构设计必须以这套真实模块分层为基线，而不是重新凭空设计一套理想目录。

## 3. future package 的最小目录建议

## 3.1 推荐目录骨架

若进入 future package 结构试拆，建议最小目录先收成：

```text
packages/harness/
  src/
    core/
      runtime/
      phase/
      plugin/
    host/
      codex/
    internal/
      diagnostics/
      shared/
    index.mjs
    runtime.mjs
    phase.mjs
    plugin.mjs
    host.mjs
  package.json
```

## 3.2 为什么不直接照搬当前 scripts 目录

当前 `scripts/harness-runtime/*` 是内核试运行结构，不是最终 package 结构。

future package 需要：

- 以导出职责组织目录
- 而不是以当前脚本来源组织目录

因此更合理的是：

- `core/runtime`
- `core/phase`
- `core/plugin`
- `host/codex`
- `internal/diagnostics`

而不是继续保留：

- `core/*.mjs + diagnostics/index.mjs + scripts/harness-runtime.mjs`

## 3.3 diagnostics 为什么先放 internal

当前 diagnostics 虽然已经很成熟，但它仍然带有：

- issue 目录约定
- remediation draft 升级链
- 当前主流程承接语义

因此更合理的 V1 是：

- 先在 package 结构中预留 `internal/diagnostics/`
- 暂不进入正式 public export

这样既保留后续拆出的空间，也不提前固化 API。

## 4. 分层落位建议

## 4.1 Public Core

建议 future package 的 `public core` 至少落在：

- `src/core/runtime/`
- `src/core/phase/`
- `src/core/plugin/`

分别承接：

- runtime state object 与 load/save helpers
- phase contract object 与 resolution helpers
- plugin manifest/registry/assembly helpers

## 4.2 Host Adapter Layer

建议落在：

- `src/host/codex/`

当前只需要一个实现：

- `codex`

但应同时配一层统一入口：

- `src/host.mjs`

用于导出：

- host boundary objects
- codex adapter contract
- 当前唯一 host 实现

## 4.3 Internal-only

建议落在：

- `src/internal/diagnostics/`
- `src/internal/shared/`

这层不进 future public `exports` map。

保留它的目的不是长期隐藏，而是：

- 先隔离当前不稳定边界
- 等 contract 真稳定后再决定是否外提

## 4.4 CLI

CLI 不建议进入 package `src` 的 public export 路径。

更合理的 future 形式是：

- `bin/harness-runtime.mjs` 或
- `scripts/harness-runtime.mjs`

作为 package 外围 runner 或 example runner。

原因是：

- CLI 是使用入口，不是内核 API
- CLI 命令面比对象面更容易变

## 5. 最小 exports map 建议

## 5.1 V1 exports map 目标

V1 的目标不是导出所有功能，而是先稳定最值得复用的入口。

建议最小保留：

- 包根入口
- runtime 入口
- phase 入口
- plugin 入口
- host 入口

## 5.2 建议的 exports map 形态

```json
{
  "name": "@ar/harness",
  "type": "module",
  "exports": {
    ".": "./dist/index.mjs",
    "./runtime": "./dist/runtime.mjs",
    "./phase": "./dist/phase.mjs",
    "./plugin": "./dist/plugin.mjs",
    "./host": "./dist/host.mjs",
    "./host/codex": "./dist/host/codex/index.mjs"
  }
}
```

这里表达的是 future boundary，不是当前仓库已实现状态。

## 5.3 各入口职责建议

### `.` 根入口

只适合导出最小核心组合能力，例如：

- runtime state objects
- phase contract objects
- plugin assembly 核心对象

不适合把所有子域一次性平铺出来。

### `./runtime`

用于集中导出：

- `TaskRuntimeState`
- `BatchRuntimeState`
- `TrialFeedbackState`
- `ManualValidationState`
- `EventRecord`
- runtime load/save helpers

### `./phase`

用于集中导出：

- phase contract objects
- phase resolution helpers
- phase boundary helpers

### `./plugin`

用于集中导出：

- registry loaders
- manifest loaders
- assembly helpers
- resolution input helpers

### `./host`

用于集中导出：

- `HostCapabilities`
- `HostCommandSurface`
- `HostContextInput`
- `HostRuntimeOutput`
- host adapter contract

### `./host/codex`

用于导出当前唯一正式宿主实现：

- Codex adapter

## 6. 明确不导出的路径

V1 应明确不导出以下路径：

- `./diagnostics`
- `./cli`
- `./tests`
- `./internal/*`
- `./shared`

原因分别是：

### diagnostics

当前 still internal，尚未稳定成 optional public domain。

### cli

CLI 是 runner，不是 future package public API。

### tests

测试用于质量保证，不属于导出面。

### internal/\*

这层本来就是明确隔离出的非 public implementation detail。

### shared

当前 `shared` 混合了可复用工具和脚本级便捷实现，不适合直接暴露。

## 7. shared 的处理建议

当前最容易误导 package 化的一层就是 `shared.mjs`。

建议后续按两步处理：

1. 先拆出真正可复用的：
   - schema helpers
   - object normalization helpers
2. 其余仍留在：
   - `internal/shared`

只有拆完之后，才考虑是否增加：

- `./utils` 或
- `./schema`

这类 future export entry。

在 V1 阶段，不建议直接把 `shared` 放进 exports map。

## 8. 当前阶段的结论

当前已经具备设计 future package 结构的基础，但还不该直接实施真实拆包。

原因是：

- diagnostics export boundary 仍未稳定
- `shared` 还需二次拆分
- 当前 package 入口还只有设计，没有真正 build/dist 结构

所以当前最合理的顺序是：

1. 先定义 package 结构与 exports map
2. 再做最小 package 结构试拆
3. 再决定 diagnostics 是否进入 optional domain export
4. 最后才考虑真实 npm package 化

## 9. 一句话结论

Harness future package 的 V1 结构应先收成：

- `core`
- `host`
- `internal`

最小 `exports` map 应先只导出：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

而：

- `diagnostics`
- `cli`
- `tests`
- `shared`

当前都不应直接进入 public export。
