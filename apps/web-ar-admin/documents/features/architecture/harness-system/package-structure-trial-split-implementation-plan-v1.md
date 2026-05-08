---
title: Harness package 结构试拆实施计划 V1
type: plan
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-ready-kernel-convergence-checklist-v1, package-export-boundary-v1, package-structure-and-exports-map-v1
---

# Harness package 结构试拆实施计划 V1

## 1. 目标

本文档不是直接开始 package 化，而是回答一个更具体的问题：

- 如果下一步真的开始做 package 结构试拆，应该怎么拆

它只负责提供：

- 分阶段迁移顺序
- 每阶段的迁移对象
- 暂不迁移对象
- 风险与验证出口

它不负责真实拆目录，也不直接改当前仓库的 `package.json`。

## 2. 当前试拆前提

当前已经完成的前置收口包括：

- P0
  - runtime schema 冻结
  - 命名口径收紧
  - plugin registry / manifest / assembly 真实落地
- P1
  - `harness-runtime.mjs` 已拆成 CLI + 核心模块
  - phase contract / state boundary 已有最小实现
- P2
  - host adapter boundary 已抽出
- 自动回归 V1
  - 已覆盖 runtime / plugin / phase / diagnostics 主链
- package 设计前置
  - `package export boundary V1`
  - `package 结构与 exports map V1`

这说明：

- 当前已经具备“试拆”条件
- 但还没有进入“真实 package-ready”

## 3. 试拆原则

### 3.1 先迁 public core，后碰 internal-only

试拆第一轮只应该动：

- `public core`
- `host adapter layer`

不应一上来就碰：

- diagnostics
- CLI
- tests
- 当前 `shared`

### 3.2 先复制式落位，再决定真实迁移

试拆第一阶段更适合：

- 建 future package 目录骨架
- 复制或镜像核心模块到试拆位置
- 验证导出边界

而不是一开始就：

- 直接把现有实现整体搬走

这样可以减少对当前主链的扰动。

### 3.3 每一步都必须有回归出口

试拆不是目录美化，而是未来 package 化前的结构验证。

因此每一步都必须回答：

- 当前主链有没有被破坏
- 当前 package 骨架是否真的能承接 future exports

## 4. 推荐试拆阶段

## 4.1 阶段 1：建立 future package 骨架

目标：

- 在仓库内建立 future package 的最小目录壳
- 不移动现有实现

建议动作：

- 新建：
  - `packages/harness/src/core/runtime/`
  - `packages/harness/src/core/phase/`
  - `packages/harness/src/core/plugin/`
  - `packages/harness/src/host/codex/`
  - `packages/harness/src/internal/`
- 新建最小 package README 或设计说明
- 不改变现有 `scripts/harness-runtime/*`

本阶段不包含：

- 不迁 diagnostics
- 不迁 CLI
- 不迁 tests
- 不建立真实 build 流程

风险：

- 容易把“骨架存在”误当成“已 package-ready”

验证出口：

- 骨架目录是否与 `package-structure-and-exports-map-v1.md` 一致
- 当前主链是否零影响

## 4.2 阶段 2：迁入 runtime / phase / plugin 核心模块

目标：

- 先验证 `public core` 是否能独立成 future package 结构

优先迁移对象：

- `runtime-state`
- `phase-contracts`
- `phase-resolution`
- `plugin-assembly`

建议方式：

- 先复制式试拆或
- 建轻量转发层

不建议第一步就做：

- 大规模移动文件

本阶段不包含：

- 不迁 diagnostics
- 不迁 CLI
- 不迁 `shared` 全量内容

风险：

- `shared` 依赖会暴露真实耦合点
- core 模块之间可能还存在当前仓库路径假设

验证出口：

- 现有自动回归：
  - runtime state
  - plugin assembly
  - phase resolution仍全部通过
- 核心模块能在 future package 目录中形成清晰引用关系

## 4.3 阶段 3：收 shared，补 core 纯依赖层

目标：

- 把当前最容易污染 future exports 的 `shared` 收干净

建议动作：

- 拆出真正属于 core 的：
  - schema helpers
  - object normalization helpers
  - path-free utils
- 保留脚本级便捷逻辑在：
  - `internal/shared`

本阶段不包含：

- 不迁 diagnostics 主链
- 不迁 CLI

风险：

- `shared` 若拆不清，会反向拖慢整个 package 试拆

验证出口：

- core 层不再直接依赖混合型 shared
- `exports` 候选路径不需要暴露 `shared`

## 4.4 阶段 4：迁入 host adapter 层

目标：

- 验证 `host adapter layer` 能否作为单独层存在

优先迁移对象：

- `host/codex-adapter`

建议动作：

- 在 future package 骨架下建立：
  - `src/host/codex/`
- 对齐：
  - `HostCapabilities`
  - `HostCommandSurface`
  - `HostContextInput`
  - `HostRuntimeOutput`

本阶段不包含：

- 不支持第二宿主
- 不重写全部 CLI

风险：

- 若 adapter 仍绑定当前 CLI 语义，试拆价值会很弱

验证出口：

- Codex adapter 能通过 package 骨架层消费 core 模块
- 当前主链命令仍正常

## 4.5 阶段 5：决定 diagnostics 是否外提

目标：

- 判断 diagnostics 是继续 internal-only 还是升级为 future optional domain

当前建议：

- 这一阶段只做判断，不做强行外提

原因：

- diagnostics 仍带有最强的当前仓库流程语义
- 它是最容易把 package 边界重新拉脏的一层

本阶段不包含：

- 不强制导出 `./diagnostics`

风险：

- 过早外提会把 issue / draft / task-card-entry / formal-task 链条固化成 public API

验证出口：

- 能明确写出 diagnostics 是否具备 optional domain export 条件
- 若还不具备，应明确继续 internal-only 的原因

## 4.6 阶段 6：最后才考虑 CLI 与真实 exports 落盘

目标：

- 在 core、host、shared、diagnostics 边界都基本稳定后，再考虑：
  - 真实 package 入口
  - 真实 `exports`
  - 真实 bin runner

当前明确不应提前做：

- 提前改根 `package.json`
- 提前暴露 CLI 为 public API

风险：

- 若这一步提前，前面所有边界都还没稳定，就会被 API 兼容压力锁死

验证出口：

- package 目录结构已稳定
- `exports` 候选面已稳定
- 自动回归仍稳定

## 5. 当前明确先不要动的部分

当前试拆阶段，明确不建议第一轮先动：

- `diagnostics/index.mjs`
- `scripts/harness-runtime.mjs`
- `scripts/harness-runtime/tests/*`
- `core/shared.mjs` 的全量外提

原因分别是：

### diagnostics

边界还没稳定成 future optional domain。

### CLI

它是 runner，不是 public API。

### tests

测试要跟着结构走，但不应成为第一轮迁移对象。

### shared

它仍是当前最混合、最容易把边界搞脏的一层。

## 6. 最小验证矩阵

每一阶段试拆后，至少要回归：

1. `pnpm harness:test`
2. `node scripts/harness-runtime.mjs inspect-config`
3. `node scripts/harness-runtime.mjs inspect-assembly`
4. `node scripts/harness-runtime.mjs inspect-plugin-runtime --phase execution`
5. `node scripts/harness-runtime.mjs inspect-task-query --view current-status`
6. diagnostics 主链到 `boundary-start`

目的不是测 package 功能，而是确保：

- 当前主链没有因为结构试拆而被破坏

## 7. 推荐执行顺序

若进入真实试拆，建议严格按以下顺序：

1. 建 package 骨架
2. 迁 core
3. 收 shared
4. 迁 host adapter
5. 判断 diagnostics
6. 最后再碰 CLI 和真实 exports

这个顺序的核心原因是：

- 先把最稳定、最值得导出的部分立住
- 把最容易污染边界的部分放到最后

## 8. 一句话结论

Harness package 结构试拆的第一步，不是迁 diagnostics，也不是迁 CLI，而是：

- 先建 future package 骨架
- 先迁 `runtime / phase / plugin` 三块 core

只有当：

- core 稳了
- shared 收了
- host adapter 稳了

之后，才适合判断 diagnostics 是否外提，以及是否进入真实 package exports 落盘。
