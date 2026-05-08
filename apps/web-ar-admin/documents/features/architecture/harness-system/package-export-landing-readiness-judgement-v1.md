---
title: Harness package export 落盘准备度判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-ready-kernel-convergence-checklist-v1, package-export-boundary-v1, package-structure-and-exports-map-v1, diagnostics-package-positioning-v1
---

# Harness package export 落盘准备度判断 V1

## 1. 目标

本文档用于回答当前 package 结构试拆后的最终判断问题：

- 当前 Harness 是否适合进入真实 `exports` / package 落盘阶段

这里的“进入真实落盘阶段”特指：

- 在仓库内真实写入 future package 的最小 `exports`
- 让 `packages/harness/package.json` 从纯 trial skeleton 进入最小可消费 package 形态

它不等于：

- 立即 npm 发布
- 立即对外稳定承诺所有 API
- 立即让 diagnostics / CLI 进入 public export

## 2. 当前结论

当前明确结论是：

- **可以进入真实 `exports` / package 落盘阶段**

但必须加一个范围限定：

- **只允许进入最小范围的 in-repo private landing**

更具体地说：

- 可以开始为 `packages/harness/package.json` 增加最小 `exports`
- 可以把当前已经试拆稳定的 `core / host` 入口正式落成 package 入口
- 但当前**还不能**把这一步等同为：
  - `package-ready`
  - `public release ready`
  - `diagnostics optional domain ready`

## 3. 为什么现在可以进入最小落盘阶段

## 3.1 public core 试拆已经成立

当前 `packages/harness/` 已真实承接：

- `runtime`
- `phase`
- `plugin`

并且已形成对应入口：

- `src/runtime.mjs`
- `src/phase.mjs`
- `src/plugin.mjs`
- `src/index.mjs`

这说明 future package 的 `public core` 已不是纯文档设计，而是已经有真实目录与真实模块承接。

## 3.2 internal shared 已收口

当前 `src/internal/shared/shared.mjs` 已经从脚本时代的混合工具集收成：

- 文件 / 路径基础
- JSON / YAML 基础读写
- guard / assert
- 时间戳

这意味着：

- package 内部公共依赖层已经足够稳定
- 当前再继续拖延 `exports` 落盘，不再是因为 shared 还没收住

## 3.3 host layer 已有真实承接

当前 `packages/harness/` 已真实承接：

- `src/host/codex/codex-adapter.mjs`
- `src/host.mjs`

这说明 future package 的：

- `./host`
- `./host/codex`

已经具备真实落点。

## 3.4 自动回归已能覆盖当前最小落盘面

当前自动回归已经覆盖：

- runtime state
- plugin assembly / manifest
- phase resolution
- diagnostics 主链
- package core smoke
- package host smoke

因此对于“最小 exports 落盘”这一步，已经不是裸奔状态。

## 4. 为什么这仍不等于 package-ready

## 4.1 diagnostics 仍明确保持 internal-only

当前 diagnostics 已有正式定位判断：

- 暂不外提
- 暂不进入 `public optional domain`

因此当前 package 落盘必须接受一个现实：

- 只能先落 `core + host`
- 不能把 diagnostics 一起推成对外导出面

## 4.2 CLI 仍不应进入 public export

当前 CLI 仍属于：

- 仓库内 runner
- 当前协作命令入口

它不应被误导出到 package public surface。

这意味着当前落盘的是：

- package module exports

不是：

- 包内 CLI 产品化

## 4.3 package 仍应保持 private / in-repo trial

当前虽然可以开始真实 `exports` 落盘，但仍建议保持：

- `"private": true`

因为以下几项仍未完成：

- 完整 phase contract 覆盖
- diagnostics domain contract 化
- 第二宿主对照实现
- 文档从 schema / contract 半自动反推

所以这一步更准确的名称应是：

- `private package landing`

而不是：

- `public package release`

## 5. 建议的最小落盘范围

当前若进入真实 `exports` / package 落盘阶段，建议只落以下范围。

## 5.1 建议落盘的 exports

建议先只落：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

这与前面的 `exports map V1` 一致，也与当前试拆结果一致。

## 5.2 当前明确不应落盘的 exports

当前仍不应落：

- `./diagnostics`
- `./cli`
- `./tests`
- `./internal/*`
- `./shared`

原因不是这些目录不存在，而是它们当前还不是稳定的 public API。

## 5.3 当前 package.json 应保持的边界

当前即使进入真实落盘，也建议继续保持：

- `"private": true`
- 不引入发布脚本
- 不引入真实 build 产物要求

优先目标应是：

- 让 future package 在仓库内形成真实 `exports` 边界
- 而不是立刻走向发布流程

## 6. 当前剩余阻塞点

虽然可以进入最小落盘，但仍有几项内容明确不能跳过：

## 6.1 diagnostics 仍未具备 export 条件

这不是“次要问题”，而是当前 package 边界里最明确的一条保留项。

## 6.2 phase 仍不是完整 state machine

当前 phase contract 已有最小 gate，但还没覆盖全部 phase。

因此 package 落盘可以做，但应继续保持：

- 最小内核落盘
- 而不是“phase 已完全稳定”的表达

## 6.3 host portability 仍只停在单实现

当前只有：

- `codex`

这足以支撑最小 host export，但不足以说明 host layer 已彻底稳定。

## 7. 最终判断

最终判断如下：

1. 当前**可以进入真实 `exports` / package 落盘阶段**
2. 但只适合做：
   - `private`
   - `in-repo`
   - `core + host` 的最小落盘
3. 当前**不应**把这一步表述为：
   - package-ready
   - diagnostics-ready
   - publish-ready

因此下一步最合理的执行任务应是：

- `开始 Harness package 真实落盘第一步：为 packages/harness/package.json 增加最小 exports`

而不是：

- 直接做 npm package 发布
- 直接导出 diagnostics
- 直接迁入 CLI
