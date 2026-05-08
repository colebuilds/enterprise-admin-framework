---
title: Harness package export boundary V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: core-architecture-v2, runtime-and-config-schema-v1, plugin-registry-and-manifest-model-v1, package-ready-kernel-convergence-checklist-v1
---

# Harness package export boundary V1

## 1. 目标

本文档用于回答 future package 化时最关键的一个问题：

- Harness 到底应该导出什么

它不负责真实拆包实现，也不负责 npm 发布流程。  
它只负责先把未来 package 的边界定清楚，避免后续把当前仓库里的内部实现细节误固化成 public API。

## 2. 当前真实模块结构

当前 `scripts/harness-runtime/` 已形成以下真实结构：

- `core/`
  - `runtime-state.mjs`
  - `plugin-assembly.mjs`
  - `phase-contracts.mjs`
  - `phase-resolution.mjs`
  - `shared.mjs`
- `host/`
  - `codex-adapter.mjs`
- `diagnostics/`
  - `index.mjs`
- `tests/`
  - 最小自动回归测试
- `scripts/harness-runtime.mjs`
  - CLI 入口

这说明 Harness 当前已经不是单文件脚本，而是具备 package 化前所需的最小模块边界。

## 3. export boundary 的基本原则

### 3.1 先收导出边界，再做拆包

当前最重要的不是立刻改目录或发布包，而是先明确：

- 什么是 future package 的 `public core`
- 什么是 `host adapter`
- 什么是 `internal-only`

否则一旦提前导出太多实现细节，后面会被 public API 稳定性反向绑死。

### 3.2 CLI 不是 public core

当前 `scripts/harness-runtime.mjs` 的职责是：

- 参数解析
- 命令分发
- 输出

它是当前仓库内的使用入口，不应直接等于 future package 的 public API。

原因是：

- CLI 口令会变
- 宿主环境会变
- package 对外更需要稳定的对象和函数边界，而不是当前命令表

### 3.3 diagnostics 不等于全部对外导出

当前 diagnostics 是最成熟的子链之一，但它仍带有较强的当前仓库演进语义：

- issue 目录约定
- draft / task-card-entry / formal-task 升级链
- 当前主流程口令的承接方式

因此 diagnostics 当前更适合作为：

- `public optional domain` 或
- `internal domain with future export candidate`

而不应在 V1 边界里一开始就全部对外固化。

## 4. 三层导出模型

### 4.1 Public Core

这层属于 future package 最应该稳定导出的部分。

建议包含：

- runtime state object 模型与读写
- phase contract object
- phase resolution 最小能力
- plugin assembly 最小能力
- 最小 shared utilities 中与 schema / object 处理直接相关的部分

这层回答的是：

- Harness 内核如何表达状态
- Harness 内核如何表达 phase
- Harness 内核如何表达 plugin 装配

### 4.2 Host Adapter Layer

这层属于：

- 内核和宿主之间的适配层

当前唯一正式实现是：

- `Codex host adapter`

这层应允许 future package 导出：

- `HostCapabilities`
- `HostCommandSurface`
- `HostContextInput`
- `HostRuntimeOutput`
- adapter 接口约定

但不要求当前就导出多个 host 实现。

### 4.3 Internal-only

这层属于：

- 当前仓库实现细节
- 当前试运行便利层
- 当前尚未准备好成为稳定 API 的部分

典型包括：

- 当前 CLI 入口
- 当前 tests 目录
- 当前 diagnostics 目录中的部分流程细节
- 当前 `shared.mjs` 中只服务于现有脚本的实现细节

## 5. 模块归属建议

### 5.1 runtime-state.mjs

建议归属：

- `public core`

原因：

- 它已经承接正式 state object
- 是 future package 最稳定的核心资产之一

### 5.2 phase-contracts.mjs

建议归属：

- `public core`

原因：

- 它定义的是 phase contract object 本身
- 这类对象未来必须成为内核正式导出的一部分

### 5.3 phase-resolution.mjs

建议归属：

- `public core`

原因：

- 它是 phase-driven 内核的最小运行时判断层
- 即使后续演进成更完整状态机，这层也应保留为核心导出面

### 5.4 plugin-assembly.mjs

建议归属：

- `public core`

原因：

- config / registry / manifest / assembly 已经形成稳定边界
- 这是 future package 化最值得复用的核心能力之一

### 5.5 host/codex-adapter.mjs

建议归属：

- `host adapter layer`

原因：

- 它不属于通用 core
- 但它也不应继续被视为纯内部脚本细节
- 它代表了 future host adapter 的正式第一实现

### 5.6 diagnostics/index.mjs

建议归属：

- `internal-only` 暂定

原因：

- diagnostics 当前虽然成熟，但还带有较强的当前仓库流程语义
- package-ready 前，更合理的是先保持 internal-only
- 等 diagnostics 与主 phase chain 的边界再稳定一轮后，再决定是否导出为：
  - `optional domain`

### 5.7 shared.mjs

建议归属：

- `拆分后部分进入 public core`
- 当前整体仍应视为 `internal-only`

原因：

- 它混合了：
  - 通用 schema / io 辅助
  - 当前脚本便捷工具
- 未来 package-ready 前应再拆一轮

### 5.8 scripts/harness-runtime.mjs

建议归属：

- `internal-only`

原因：

- 它是仓库内 CLI 入口
- 它不应直接成为 future package 的 public API
- 最多只能在 package 外围作为：
  - example CLI
  - adapter-specific runner

### 5.9 tests/\*

建议归属：

- `internal-only`

原因：

- 测试是 package 质量基线的一部分
- 但不属于对外导出面

## 6. 当前最小 future package 导出建议

若只定义最小 future package 导出面，建议当前先收成：

### 6.1 Public Core Exports

- runtime state objects
- runtime load / save helpers
- phase contracts
- phase resolution helpers
- plugin assembly helpers

### 6.2 Host Exports

- host boundary objects
- adapter interface contract
- `codex` adapter 作为当前唯一参考实现

### 6.3 暂不导出

- CLI 入口
- diagnostics 完整升级链
- tests
- 当前 shared 里的全部工具函数

## 7. 当前为什么还不能直接做 package

当前虽然边界已经比以前清楚很多，但仍不建议直接 package 化，原因主要是：

- diagnostics export 边界还没稳定
- `shared.mjs` 还没进一步拆出纯 core 工具层
- public exports 还没真正落实成导出清单
- package 目录结构与入口文件还没形成

也就是说：

- export boundary 已经可以定义
- 但 package 目录和导出实现还不该立刻开始

## 8. 下一步建议

建议继续按以下顺序推进：

1. 先把 `shared.mjs` 再拆一轮
2. 再定义 `public core exports` 的正式清单
3. 再决定 diagnostics 是否进入 optional domain export
4. 最后再进入 package 结构设计与真实拆包

## 9. 一句话结论

当前 Harness 的 future package export boundary 可以先收成三层：

- `public core`
- `host adapter layer`
- `internal-only`

其中当前最适合先进入 `public core` 的是：

- runtime
- phase
- plugin assembly

当前最适合保持 `internal-only` 的是：

- CLI
- tests
- diagnostics 完整链

这说明：

- 当前已经具备进入 package 结构设计阶段的边界基础
- 但还不应直接进入真实 package 拆包实现
