---
title: Harness build dist 发布前准备判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-ready-kernel-convergence-checklist-v1, package-export-landing-readiness-judgement-v1, package-structure-and-exports-map-v1, diagnostics-package-positioning-v1
---

# Harness build dist 发布前准备判断 V1

## 1. 目标

本文档用于回答当前 package 结构试拆与最小 `exports` 落盘完成后，Harness 是否已经适合继续进入：

- `build`
- `dist`
- 发布前准备

这里的“发布前准备”指的是 package 从：

- `private / in-repo trial`

继续推进到：

- 可构建
- 可产出 `dist`
- 可进一步讨论发布流程

它不负责真实建立 build 流程，也不负责真实发布。

## 2. 当前结论

当前明确结论是：

- **暂不适合进入 build / dist / 发布前准备阶段**

更准确地说：

- 当前已经适合：
  - `private package landing`
  - `真实 exports 落盘`
- 但还不适合：
  - `build pipeline`
  - `dist artifact`
  - `release prep`

因此当前更合理的阶段判断仍然是：

- `private / in-repo trial package`

而不是：

- `build-ready package`
- `dist-ready package`
- `release-ready package`

## 3. 为什么现在还不适合进入下一阶段

## 3.1 phase contract 覆盖还不完整

当前 phase contract 虽然已经从文档推进到实现层，并且：

- `task_card`
- `boundary`

已经进入最小 contract gate，但仍缺少：

- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

这些 phase 的同等级 gate 与更完整的 state boundary。

这意味着：

- 当前 core 已足够做结构试拆与最小导出
- 但还不足以支撑下一步“构建产物级稳定承诺”

## 3.2 host layer 仍只有单实现

当前 host layer 虽然已被成功迁入 package，并形成：

- `./host`
- `./host/codex`

但它本质上仍然只有：

- `codex`

这足以支撑当前 `private` 范围内的结构落盘，却还不足以说明：

- host boundary 已经过发布级验证
- adapter contract 已经足够稳定到进入 build / dist 准备

## 3.3 diagnostics 明确仍为 internal-only

当前 diagnostics 已经有正式判断：

- 暂不外提
- 暂不进入 `public optional domain`

这说明 package 仍然保留一个非常重要的内部域尚未稳定。

这并不阻止最小 `exports` 落盘，但会阻止进一步进入发布前准备，因为：

- 发布前准备意味着要更认真评估“当前 package 的域边界是否基本稳定”
- diagnostics 目前仍明确属于“尚未稳定的内部特例链”

## 3.4 当前没有 build 目标，也没有 dist 约束

当前 `packages/harness/package.json` 已有：

- `type: module`
- 最小 `exports`

但当前还没有：

- build 工具链
- `dist/` 产物策略
- 源码直出还是构建产出的决定
- 类型产出策略
- source map / sideEffects / files 白名单等更细边界

也就是说，当前缺的不是“一个命令”，而是一整层：

- build boundary judgement

在这层判断未明确前，直接进入 build / dist，只会把现在的 trial 结构过早固化。

## 3.5 当前回归足够支撑 trial，不足以支撑发布前准备

现在自动回归已经能保护：

- runtime
- phase
- plugin
- diagnostics 主链
- package core smoke
- package host smoke
- package exports 最小边界

这足够支撑：

- in-repo 结构收口
- private exports 落盘

但还不足以支撑：

- build 输出稳定性
- dist 边界稳定性
- 发布前 package 消费兼容性

例如当前还没有：

- package 入口对外消费测试
- build 后入口一致性测试
- 发布路径 smoke

## 4. 当前阶段最准确的判断

当前 Harness package 的最准确判断是：

1. `exports-ready`
2. `private-landing-ready`
3. **not build-ready**
4. **not dist-ready**
5. **not release-ready**

所以现在的 package 成熟度更像：

- 已经从“纯结构试拆”进入“最小真实入口落盘”

但还没有进入：

- “构建产物与发布边界阶段”

## 5. 进入 build / dist 前至少还应补什么

若后续真的要进入下一阶段，至少还应先补以下前置条件。

## 5.1 补一版 build boundary 设计

至少要先明确：

- 源码直出还是 `dist` 导出
- build 工具用什么
- 是否需要类型产物
- `files` 白名单怎么收

没有这一步，build 只是机械产物，不是有边界的 package 实施。

## 5.2 补 phase contract 覆盖收口

至少要把剩余标准 phase 的 contract gate 再补一轮，避免：

- core 还在继续演进
- build 产物边界却已经先被固化

## 5.3 补 package 级消费 smoke

至少要增加：

- 从 `packages/harness/package.json exports` 入口直接消费的 smoke
- host / runtime / phase / plugin 各入口稳定性 smoke

当前测试是内核回归足够，但还不是 package 使用层回归。

## 5.4 明确 diagnostics 与 CLI 的长期边界

当前 diagnostics 和 CLI 都明确不外提，这个方向没问题。  
但若要进一步进入 build / dist，需要先明确：

- 未来是否会有 `bin/`
- diagnostics 是否长期 internal-only

否则 build 结构还会继续摇摆。

## 6. 当前推荐下一步

当前最合理的下一步不是直接开 build，而是先补一条更小的判断任务：

- `设计 Harness build boundary 与 dist 输出策略 V1`

这条任务应该先回答：

- 要不要 build
- build 产物长什么样
- 为什么现在需要或不需要 `dist`

在这之前，不建议直接开始：

- `tsup / rollup / vite library mode`
- `dist/` 落盘
- 发布脚本

## 7. 最终结论

最终结论如下：

- 当前 **不应进入 build / dist / 发布前准备阶段**
- 当前最合适的状态仍是：
  - `private`
  - `in-repo trial`
  - `真实 exports 已落盘`
- 当前真正适合继续推进的方向是：
  - 先设计 build boundary
  - 再决定是否进入 build / dist 实施
