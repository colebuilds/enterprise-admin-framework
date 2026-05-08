---
title: Harness future package 目标发布层级评估 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-trial-vs-release-strategy-judgement-v1, release-prep-final-closure-judgement-v1
---

# Harness future package 目标发布层级评估 V1

## 1. 目标

本文档用于定义 Harness future package 的候选发布层级，并在当前真实实现状态基础上，判断：

- 当前最现实的目标发布层级是什么
- 为什么不是更低层
- 为什么不是更高层
- 从当前状态推进到该层最少还差什么

这里讨论的是：

- 发布层级目标
- 发布策略方向
- 推进条件

它不等于：

- 立即进入真实发布
- 立即去掉 `private`
- 立即开始 publish 实施

## 2. 当前判断前提

当前已经成立的前提包括：

- 内核主线已真实落地
- `packages/harness/` 已形成真实 trial package
- frozen public API 已建立
- frozen trial 元数据边界已建立
- `trial-scope release prep` 已完整收口
- `pnpm harness:test` 已能稳定通过当前边界回归

同时当前仍然成立的限制包括：

- package 仍是 `private`
- package 仍是 `in-repo trial`
- 当前仍不是 `publish-ready`
- 当前仍未形成发布级元数据与发布脚本策略

## 3. 候选发布层级

当前 future package 的候选发布层级至少可分为三层。

## 3.1 层级 A：`private in-repo package`

定义：

- 只在当前仓库内消费
- 不进入外部 registry
- 主要目标是稳定内部边界、减少脚本时代耦合

收益：

- 风险最低
- 边界最可控
- 不需要立刻补完整发布元数据

成本：

- 外部复用收益有限
- 跨仓协作价值有限
- 长期停在该层会让 package 形态价值被压低

适用场景：

- 只想服务当前仓库
- 不确定是否值得对外复用

## 3.2 层级 B：`private registry package`

定义：

- 仍非公开发布
- 但允许进入私有 registry 或组织内分发
- 需要具备更稳定的 package 元数据、产物和消费方式

收益：

- 可以跨仓复用
- 仍能控制访问范围
- 能在不公开暴露的前提下验证 package 化价值

成本：

- 需要补更完整的元数据策略
- 需要补更强的消费验证与发布流程
- 需要对 API 稳定性承担更高承诺

适用场景：

- 已确认 Harness 未来会被多个仓库或多个项目消费
- 但当前不准备直接变成 public package

## 3.3 层级 C：`future public package`

定义：

- 面向外部公开消费
- 需要长期稳定 API 承诺
- 需要更高等级的元数据、文档、测试和发布流程

收益：

- 复用范围最大
- 对外价值最高
- 可作为正式产品化能力沉淀

成本：

- 需要最高级别的 API 稳定性
- 需要最严格的发布策略、兼容策略、类型与文档策略
- 当前 internal-only 边界会面临最大压力

适用场景：

- 已确认 Harness 具有明确的外部产品化目标
- 团队有意承担对外承诺成本

## 4. 当前最现实的目标层级

当前最现实的目标发布层级，我建议锁定为：

- **层级 B：`private registry package`**

这不是说当前已经到达该层，而是说：

- 这是当前最值得作为后续推进目标的层级

## 5. 为什么不是更低层

如果继续只停留在：

- `private in-repo package`

短期当然最安全，但当前已经出现两个问题：

1. 当前 trial package 与 trial-scope release prep 都已经收口完成
2. 继续停在该层，会让 package 形态长期停留在“只有内部整理价值”的阶段

换句话说：

- 继续无限期停在层级 A，收益已经开始递减

当前 Harness 已经具备：

- 真实 exports
- 真实 build
- 真实 dist
- 边界冻结
- 较完整回归

这已经超过了“只做仓库内整理”的最低门槛。

## 6. 为什么不是更高层

当前不建议直接把目标锁为：

- `future public package`

原因很直接：

## 6.1 当前还没有发布级元数据策略

当前仍未正式决定：

- `main`
- `types`
- source map
- `publishConfig`
- 发布脚本
- 版本策略

## 6.2 当前 frozen public API 仍只是 trial-scope 承诺

现在的 API 是：

- trial scope 下冻结

不是：

- 面向外部长期稳定承诺

## 6.3 当前仍保留较多 internal-only 边界

当前仍明确不导出：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

这本身没有问题，但说明当前 package 还处于：

- 有意保守的最小暴露阶段

因此直接把目标跳到 public，会过于超前。

## 7. 推进到层级 B 最少还差什么

如果把目标锁定为：

- `private registry package`

那么从当前状态推进过去，最少还需要补以下条件。

## 7.1 发布级元数据策略

至少需要正式回答：

- 是否补 `main`
- 是否补 `types`
- 是否提供 source map
- 是否补 `publishConfig`
- 版本策略如何定义

## 7.2 发布级 API 稳定性判断

至少需要正式回答：

- 当前 frozen public API 中哪些可升级为稳定 API
- 后续 breaking change 如何约束
- 是否需要 deprecation 策略

## 7.3 发布级自动回归扩容

至少需要补：

- 更强的 build 后消费验证
- 元数据与产物联动验证
- 若补 `types`，则补类型消费验证
- 若补 source map，则补产物一致性验证

## 7.4 发布脚本与发布流程最小实现

至少需要明确：

- 是否需要 `pack`
- 是否需要 `prepublishOnly`
- 是否需要组织内发布脚本
- 哪些动作仍需人工门控

## 8. 当前建议的推进方式

当前最合理的推进方式不是：

- 直接进入真实发布实施

而是：

1. 先正式确认 future package 的目标发布层级为 `private registry package`
2. 再进入该层级所需的元数据、API 稳定性、测试与流程设计
3. 最后再决定是否真的实施该层级的发布准备

## 9. 最终结论

最终结论如下：

- Harness future package 的候选层级至少包括：
  - `private in-repo package`
  - `private registry package`
  - `future public package`
- 当前最现实的目标发布层级建议锁定为：
  - **`private registry package`**
- 当前不建议继续长期停留在纯 `private in-repo package`
- 当前也不建议直接把目标跳到 `future public package`
- 下一步若继续，应进入：
  - `开始 Harness private registry package 目标设计：定义该层级所需的元数据、API 稳定性与发布前条件`
