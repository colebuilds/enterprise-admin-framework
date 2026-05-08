---
title: Harness 边界冻结后 release prep 准备度复评 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-readiness-judgement-after-build-v1, diagnostics-release-prep-blocker-reassessment-v1, host-release-prep-blocker-reassessment-v1, release-boundary-final-confirmation-v1, release-boundary-freeze-implementation-v1
---

# Harness 边界冻结后 release prep 准备度复评 V1

## 1. 目标

本文档用于回答在完成以下动作之后的最终判断问题：

- diagnostics 阻塞复评
- host 阻塞复评
- release boundary 最终确认
- release boundary 冻结实施

当前 Harness 是否已经适合进入：

- `release prep`

这里的 `release prep` 指的是：

- 在不放宽当前 public surface 的前提下
- 开始收口发布前元数据、路径白名单和发布前实施约束

它仍不等于：

- 真实发布
- 对外公开发布承诺
- 切换为 `publish-ready`

## 2. 当前复评结论

当前明确结论是：

- **已经适合进入最小范围的 `release prep`**

但必须加上两个限制：

1. 只允许进入 **trial scope 下的最小 release prep**
2. 不得扩大当前 public API 和当前 package 元数据边界

更准确地说，当前状态应判断为：

1. `release-boundary-frozen (trial scope)`
2. `release-prep-enterable (trial scope)`
3. `not publish-ready`

这意味着当前可以开始：

- 发布前边界收口实施
- 发布前元数据最终确认
- 发布前脚本与流程边界判断

但还不能开始：

- 对外发布
- 去掉 `private`
- 扩大导出面

## 3. 为什么现在已经适合进入最小 release prep

## 3.1 当前 public API 已真实落盘并正式冻结

当前 package 的 public surface 已同时满足：

- `exports` 已真实落盘
- `dist` 已真实存在
- `README` 已明确使用说明
- release boundary 已正式冻结
- 自动回归已覆盖 exports / public usage / build output / boundary freeze

当前正式冻结的 public API 仅为：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

这意味着 release prep 现在不再需要先回答“导出面是什么”，而可以直接在已冻结边界上继续推进。

## 3.2 当前 trial 元数据边界已真实冻结

当前 package 元数据已冻结为：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `scripts.build`
- `exports`

这意味着 release prep 现在不再需要先回答“最小 trial 元数据边界是什么”，而可以直接在这组边界上继续做发布前约束判断。

## 3.3 diagnostics 与 host 已降为次级阻塞

当前最新复评已明确：

- diagnostics 不再是 `release prep` 主阻塞
- host 不再是 `release prep` 主阻塞

这意味着 release prep 的阻塞链已经不再停留在：

- internal domain 是否过于混乱
- host 单实现是否完全挡路

而已经推进到：

- 冻结边界之上的发布前实施准备

## 3.4 当前自动回归已足以支撑最小 release prep 入口

当前 `pnpm harness:test` 已覆盖：

- runtime / plugin / phase 主链
- diagnostics 主链与独立矩阵
- package exports
- package build output
- package public usage
- release boundary freeze

这意味着当前进入 release prep，并不是建立在未验证的 trial 边界之上。

## 4. 为什么这仍不等于 publish-ready

虽然现在适合进入最小 `release prep`，但这一步仍然不等于进入发布完成态。

## 4.1 当前 package 仍必须保持 private

当前仍应继续保持：

- `"private": true`

这说明当前 release prep 只能理解为：

- 发布前边界与元数据准备

而不是：

- 允许发布

## 4.2 当前 public surface 仍不能扩大

当前仍明确不能新增：

- `./diagnostics`
- `./cli`
- `./tests`
- `./internal/*`
- `./shared`

因此 release prep 的工作重点应是：

- 收紧

而不是：

- 扩张

## 4.3 当前仍未进入发布脚本与版本发布策略实施

虽然可以开始 release prep，但当前还没有完成：

- 发布脚本实施
- 去私有化
- 正式版本发布策略落地

这说明当前最合理的理解仍然是：

- 可进入 release-prep 阶段
- 但尚未接近 publish-ready

## 5. 当前建议的最小进入范围

若现在进入 `release prep`，建议只允许进入以下最小范围：

## 5.1 发布前元数据最终确认

只围绕当前已冻结字段继续确认：

- `private`
- `version`
- `files`
- `exports`
- `scripts.build`

以及是否需要继续显式约束：

- 暂不补 `main`
- 暂不补 `types`
- 暂不补 source map 相关字段

## 5.2 发布前路径白名单确认

继续明确：

- 哪些路径是当前对外产物路径
- 哪些路径必须继续排除

但不修改导出面。

## 5.3 发布前脚本与流程边界判断

可以开始判断：

- 是否需要 release-prep 辅助脚本
- 是否需要发布前一致性检查

但还不应直接落真实发布脚本。

## 6. 当前不应越过的边界

即使进入 release prep，当前仍不应越过以下边界：

- 不切换 `private`
- 不改为 publish-ready 叙述
- 不扩大 exports
- 不把 diagnostics 拉入导出层
- 不把 CLI 拉入 package surface
- 不把 internal-only 路径卷入产物层

## 7. 最终结论

最终结论如下：

- 当前**已经适合进入最小范围的 `release prep`**
- 当前进入范围应严格限定为：
  - 当前 frozen public API 不变
  - 当前 frozen trial 元数据边界不变
  - 只继续做发布前约束、路径白名单与元数据最终确认
- 当前**仍不是 `publish-ready`**
- 因此下一步最合理的是：
  - `开始 Harness release prep 第一阶段：收口发布前元数据与路径白名单`
