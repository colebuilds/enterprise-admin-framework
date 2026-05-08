---
title: Harness private registry package 条件性元数据判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-metadata-strategy-v1, private-registry-package-target-requirements-v1
---

# Harness private registry package 条件性元数据判断 V1

## 1. 目标

本文档用于把 `private registry package` 元数据策略里当前仍属于条件性字段的部分逐项判断清楚，明确回答：

- `publishConfig` 是否需要
- `main` 是否需要
- `types` 是否需要
- source map 是否需要

并为每一项给出：

- 需要
- 暂不需要
- 延后判断

的正式结论与判断依据。

## 2. 判断前提

当前真实前提包括：

- 当前 package 仍是 `private / in-repo trial`
- frozen public API 已建立
- frozen trial metadata 已建立
- 最小 build / dist 已建立
- `trial-scope release prep` 已结束
- future 目标发布层级已建议锁定为 `private registry package`

因此本轮的判断目标不是：

- 当前立刻改 `package.json`

而是：

- 明确到达 `private registry package` 时，这些条件性字段应如何决策

## 3. `publishConfig` 是否需要

结论：

- **需要**

### 3.1 判断依据

对于：

- `private in-repo trial`

来说，`publishConfig` 不是必要项，因为当前根本不进入 registry 语义。

但对于：

- `private registry package`

来说，`publishConfig` 的价值很高，因为它直接对应：

- 发布目标 registry 的约束
- 组织内发布行为的边界
- 避免 package 被错误按 public 语义处理

因此它不应继续停留在未决状态。

### 3.2 与 future public package 的区别

在 `future public package` 语境下，`publishConfig` 可能还会承担更强的对外发布语义。

而在 `private registry package` 语境里，它主要应承担：

- 组织内私有分发约束

所以它是：

- registry 层需要
- 但不是 public package 专属

## 4. `main` 是否需要

结论：

- **延后判断**

### 4.1 判断依据

当前 package 已经依赖：

- `exports`

并且当前 `exports -> dist` 映射已稳定。

在现代消费语境里，只使用 `exports` 是成立的；但一旦进入：

- `private registry package`

就要开始考虑：

- 组织内消费环境是否存在仍依赖 `main` 的工具或消费方

这不是纯架构问题，而是：

- 目标消费环境兼容性问题

因此当前不应武断写成“必须需要”，也不应武断写成“永远不需要”。

### 4.2 当前为何不直接判成“暂不需要”

因为一旦未来确实存在：

- 组织内旧工具链
- 非 `exports` 优先的消费场景

那么 `main` 会从可选兼容项，变成实际需要项。

所以它更适合作为：

- 延后到“目标消费环境明确后”的判断项

## 5. `types` 是否需要

结论：

- **需要**

### 5.1 判断依据

如果未来目标是：

- `private registry package`

那就意味着 package 将被组织内跨仓或跨项目消费。

在这种前提下，如果仍不提供：

- 类型入口

会显著削弱：

- 可消费性
- 可维护性
- API 可理解性

特别是当前 Harness 已经不是单一脚本，而是：

- 有对象模型
- 有 phase / plugin / host 边界
- 有 package exports

这类 package 若进入组织内消费，类型支持应视为高优先级要求。

### 5.2 与 current trial 的区别

在当前：

- `private / in-repo trial`

阶段，`types` 可以继续缺席，因为主要消费者仍是当前仓库自身和当前实现者。

但一旦提升到：

- `private registry package`

它就不再只是“锦上添花”，而应被视为目标层级中的必要项。

## 6. source map 是否需要

结论：

- **暂不需要**

### 6.1 判断依据

对于：

- `private registry package`

source map 的价值主要体现在：

- 调试产物
- 提升组织内消费方的问题定位能力

但当前还没有证据表明：

- 组织内消费场景已经强依赖构建后调试

与 `types` 不同，source map 不属于“缺了就明显削弱 package 可消费性”的核心项。

因此当前更合理的判断是：

- 暂不作为 registry-ready 的第一批必要条件

### 6.2 与 future public package 的区别

到了 `future public package`，是否提供 source map 可能会重新变成重要决策项。

但在当前目标层级里，它更适合作为：

- 可选增强项

而不是首轮必须项。

## 7. 四项汇总结论

当前四项条件性元数据的判断结果如下：

- `publishConfig`
  - `需要`
- `main`
  - `延后判断`
- `types`
  - `需要`
- source map
  - `暂不需要`

## 8. 与当前 trial 状态的关系

这些结论只用于：

- `private registry package` 目标层级设计

不应被误读成：

- 当前 `packages/harness/package.json` 现在就应该立刻补齐这些字段

当前 package 仍应继续保持：

- `private`
- `in-repo trial`
- frozen trial metadata 边界不变

## 9. 当前最合理的下一步

既然四项条件性字段已经逐项判清，那么下一步最合理的工作应继续按顺序推进为：

1. `publishConfig` 策略设计
2. `types` 策略设计
3. `main` 兼容性判断设计
4. registry-ready API 稳定性策略设计

## 10. 最终结论

最终结论如下：

- `publishConfig`
  - 需要
- `main`
  - 延后判断
- `types`
  - 需要
- source map
  - 暂不需要

这些结论已经足以支撑下一步进入更细一层的：

- `publishConfig / types / main` 逐项策略设计
