---
title: Harness release boundary 最终确认 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-export-landing-readiness-judgement-v1, release-prep-readiness-judgement-after-build-v1, diagnostics-release-prep-blocker-reassessment-v1, host-release-prep-blocker-reassessment-v1
---

# Harness release boundary 最终确认 V1

## 1. 目标

本文档用于回答当前 release-prep 链上的一个关键问题：

- 现在是否已经适合收口 Harness 的 public API 边界
- 现在是否已经适合收口发布前元数据边界

这里的“收口”指的是：

- 对当前最小 public surface 做最终边界确认
- 对发布前应冻结的 package 元数据范围做最终判断

它不等于：

- 立即进入 `release prep` 实施
- 立即开放发布
- 立即扩大 current public surface

## 2. 当前最终结论

当前明确结论是：

- **已经适合开始收口 Harness 的 release boundary**

但必须加一个非常明确的限定：

- **只适合收口当前最小 trial scope 的 public API 与发布前元数据边界**

这不等于：

- 已经适合进入完整 `release prep`
- 已经适合进入 `publish-ready` 判断
- 已经适合扩大 public surface

更准确地说，当前已经具备：

1. `release-boundary-confirmable`
2. `public-surface-freezable (trial scope)`
3. `metadata-boundary-freezable (trial scope)`

但仍不具备：

1. `release-prep ready`
2. `publish-ready`

## 3. 为什么现在适合开始收口 release boundary

## 3.1 当前 public surface 已经真实落盘且稳定可读

当前 package 已真实落盘并持续通过验证的 public 入口是：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

这些入口已经同时具备：

- `package.json exports`
- `dist/*` 实际产物
- `README` 使用说明
- package public usage smoke

这意味着当前 public surface 已经不再只是设计文档中的建议，而是：

- 真实存在
- 可消费
- 有自动回归兜底

## 3.2 非导出域边界已经足够清晰

当前明确不进入 public surface 的范围已经稳定为：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

其中：

- diagnostics 已复评为不再是 release-prep 主阻塞，但仍明确保持 `internal-only`
- host 已复评为不再是 release-prep 主阻塞，但其单实现问题也没有污染当前 public 面

这意味着当前 release boundary 已经具备“导出什么 / 不导出什么”的清晰分界。

## 3.3 build / dist 已经证明当前边界可以被产物层承接

当前最小真实 build 已成立，`dist` 只承接：

- `dist/index.mjs`
- `dist/runtime.mjs`
- `dist/phase.mjs`
- `dist/plugin.mjs`
- `dist/host.mjs`
- `dist/host/codex/codex-adapter.mjs`

并且已有自动化验证证明：

- `dist` 没有镜像整个 `src/`
- `internal-only` 路径没有被卷入公开产物层

这意味着当前 boundary 已经不只是源码层概念，而是：

- 源码层
- exports 层
- dist 产物层

三层对齐。

## 3.4 release-prep 阻塞链已不再卡在 diagnostics 或 host

最近两轮复评已经确认：

- diagnostics 不再是 `release prep` 主阻塞
- host 不再是 `release prep` 主阻塞

这说明当前整体阻塞链已经自然收敛到：

- release boundary 本身

因此现在不再继续做这一层确认，反而会让后续阶段继续缺少明确的边界锚点。

## 4. 当前最小收口范围是什么

当前只建议收口以下最小范围。

## 4.1 建议冻结的 public API 范围

当前建议冻结的 public API 范围仅为：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

这次冻结的含义是：

- 把它们视为当前 trial scope 下的正式 public surface
- 后续不应再随意调整入口集合

但这仍不等于：

- 对外长期稳定兼容承诺

更准确地说，它是：

- trial scope 下的最小正式边界

## 4.2 建议冻结的发布前元数据边界

当前建议先收死的 package 元数据边界包括：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `scripts.build`
- `exports`

其中当前推荐继续保持：

- `"private": true`
- `"version": "0.0.0-trial"`

这组冻结的含义是：

- 当前 package 的发布前元数据边界已明确
- 后续若进入 `release prep`，应在这组边界上继续演进，而不是重新发散

## 4.3 当前明确不应纳入收口范围的部分

当前仍明确不应纳入 release boundary 收口范围的包括：

- `diagnostics` 导出
- `cli` 导出
- `tests` 导出
- `internal/*`
- `shared`
- 发布脚本
- `main`
- `types`
- source map 相关字段
- 从 `private` 切换为可发布状态

这些内容现在若被一并拉进来，会把“边界收口”扩大成“发布前实施”，时机还不对。

## 5. 为什么这仍不等于可以进入 release prep

虽然现在适合收口 release boundary，但这一步仍不等于已经适合进入 `release prep`。

## 5.1 边界确认不等于发布承诺

当前能确认的是：

- 现在的最小 public surface 是什么
- 现在的 trial 元数据边界是什么

还不能确认的是：

- 外部稳定兼容承诺
- 发布脚本与发布流程
- 发布版本策略

## 5.2 当前冻结的是 trial scope，不是 release scope

当前冻结的是：

- `private`
- `in-repo trial`
- `最小 exports`
- `最小 dist`

不是：

- 最终 release scope

因此这一步更准确的名字仍然是：

- release boundary final confirmation

而不是：

- release-prep implementation start

## 6. 当前结论对应的下一步

在本轮确认之后，下一步最合理的方向应是：

- 进入一轮真正的 release boundary 收口实施

也就是：

- 把当前 public API 边界和发布前元数据边界写成更明确的冻结约束
- 而不是继续先做新的导出或新的 build 扩张

更具体地说，下一步应优先是：

- `收口 Harness release boundary 实施：冻结 public API 与 trial 元数据边界`

而不是：

- 直接进入 `release prep`
- 直接开始发布脚本
- 直接扩大 exports

## 7. 最终结论

最终结论如下：

- 当前**已经适合开始收口 Harness 的 release boundary**
- 当前适合冻结的范围是：
  - 最小 public API：
    - `.`
    - `./runtime`
    - `./phase`
    - `./plugin`
    - `./host`
    - `./host/codex`
  - trial scope 下的最小 package 元数据边界：
    - `name / private / version / type / description / sideEffects / files / scripts.build / exports`
- 当前**仍不适合直接进入 `release prep` 实施**
- 因此下一步最合理的是：
  - `收口 Harness release boundary 实施：冻结 public API 与 trial 元数据边界`
