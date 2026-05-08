---
title: Harness private registry package 元数据策略 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-target-requirements-v1, release-strategy-target-tier-evaluation-v1
---

# Harness private registry package 元数据策略 V1

## 1. 目标

本文档用于定义 Harness 若继续推进到：

- `private registry package`

这一目标层级时，`package.json` 的目标元数据策略应如何分层，明确回答：

- 哪些字段属于必备字段
- 哪些字段属于条件性字段
- 哪些字段当前仍应明确不引入
- 当前从 trial metadata 走到 registry-ready metadata 还差什么

这里讨论的是：

- 目标元数据策略
- 与当前 trial metadata 的差距

它不等于：

- 立即修改当前 [package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json)
- 立即切换 `"private": true`
- 立即开始组织内 registry 分发

## 2. 当前 trial metadata 基线

当前 `packages/harness/package.json` 已真实存在的 trial metadata 基线为：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `scripts.build`
- `exports`

这是当前 frozen trial scope 的正式元数据边界。

当前这组边界已经服务于：

- in-repo private package
- frozen public API
- trial-scope release prep

但它还不是：

- registry-ready metadata

## 3. private registry package 的必备字段

若目标层级是 `private registry package`，我建议至少把以下字段视为必备字段。

## 3.1 继承自 trial 的核心必备字段

以下字段在进入该层级时应继续保留，并提升为 registry-ready 的稳定字段：

- `name`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `exports`
- `scripts.build`

理由：

- 这些字段已经构成当前 package 的最小身份、产物面和入口面
- 不保留它们，registry-ready 就没有稳定载体

## 3.2 到达该层前必须正式决策的字段

以下字段在进入 `private registry package` 前，应至少形成明确结论：

- `publishConfig`
- `main`
- `types`

这里的“明确结论”包括两种可能：

- 正式引入
- 或正式决定继续不引入，并说明原因

也就是说，这些字段不是都必须马上落盘，但不能继续处于未决状态。

## 4. 条件性字段

以下字段我建议归入条件性字段，而不是 registry-ready 的默认必备字段。

## 4.1 source map 相关字段

包括但不限于：

- source map 产物策略
- source map 对应字段或发布策略说明

它是否需要引入，应取决于：

- 组织内消费场景是否需要调试产物
- 产物体积与调试收益是否匹配

## 4.2 额外入口相关字段

如果未来出现：

- 条件性子入口
- 特定消费场景入口

这类字段只能在 API 稳定性确认之后再决定是否进入元数据层，不应在 metadata 策略阶段提前扩张。

## 4.3 pack / publish 前辅助字段

若未来组织内发布流程需要：

- 额外脚本字段
- 打包前检查字段

也应放入条件性字段，而不是现在就预设为必备字段。

## 5. 当前仍应明确不引入的字段

在当前这轮 `private registry package` 元数据策略设计里，以下字段应明确归为：

- 暂不引入字段

## 5.1 与公开发布强绑定的字段或语义

当前仍不应提前引入：

- 会把当前 package 误读成 public package 的字段组合
- 会提前表达“已对外公开发布承诺”的字段语义

## 5.2 与当前 internal-only 边界冲突的字段扩张

当前仍不应通过 metadata 策略去推动：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

进入对外 package surface。

## 5.3 去私有化相关变更

当前 metadata 策略阶段仍明确不处理：

- 去掉 `"private": true`

因为这属于：

- 更后续的发布实施与最终复评动作

不是当前 metadata 策略设计动作。

## 6. 当前已具备哪些元数据基础

基于当前真实状态，已具备的元数据基础包括：

### 6.1 基础字段已经稳定存在

当前已经稳定存在并经过多轮边界收口的字段：

- `name`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `exports`
- `scripts.build`

### 6.2 字段间关系已经稳定

当前已经稳定成立的关系包括：

- `exports -> dist`
- `files -> dist / README / package.json`
- `scripts.build -> 最小 build`

这说明当前并不是“字段还没站稳”，而是“字段已经站稳，但还没升级到 registry-ready 语义”。

## 7. 当前仍缺哪些策略结论

从当前 trial metadata 走到 registry-ready metadata，当前仍缺的不是“更多字段”，而是以下策略结论。

## 7.1 `publishConfig` 是否需要以及怎么定义

当前仍未正式回答：

- 是否需要 `publishConfig`
- 若需要，应约束哪些 registry 行为

## 7.2 `main` 是否需要保留为兼容入口

当前仍未正式回答：

- 是否只依赖 `exports`
- 还是需要同时提供 `main`

## 7.3 `types` 是否需要进入 registry-ready 范围

当前仍未正式回答：

- 是否需要类型入口
- 若需要，类型产物如何提供

## 7.4 source map 是否需要进入条件性元数据

当前仍未正式回答：

- 组织内消费是否需要 source map
- 若需要，其产物策略和暴露方式是什么

## 7.5 版本策略如何从 `0.0.0-trial` 升级

当前仍未正式回答：

- registry-ready 是否继续使用 trial 版本语义
- 还是需要进入更稳定的预发布版本语义

## 8. 当前最合理的下一步

既然 metadata 策略现在已经可以拆清，那么下一步最合理的工作应继续按顺序推进为：

1. `publishConfig / main / types / sourcemap` 的逐项策略判断
2. registry-ready API 稳定性策略设计
3. registry-ready 自动回归扩容设计
4. 组织内发布流程设计

## 9. 最终结论

最终结论如下：

- `private registry package` 的目标元数据策略现在可以正式拆成：
  - 必备字段
  - 条件性字段
  - 暂不引入字段
- 当前已具备：
  - trial metadata 的稳定核心集合
  - 字段之间的最小关系稳定性
- 当前仍缺：
  - `publishConfig`
  - `main`
  - `types`
  - source map
  - 版本升级策略这些点的正式策略结论
- 因此下一步若继续，应进入：
  - `开始 Harness private registry package 条件性元数据逐项判断`
