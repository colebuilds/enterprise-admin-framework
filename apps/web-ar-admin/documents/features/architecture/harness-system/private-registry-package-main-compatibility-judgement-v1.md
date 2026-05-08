---
title: Harness private registry package main 兼容性判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-conditional-metadata-judgement-v1, private-registry-package-metadata-strategy-v1, private-registry-package-target-requirements-v1
---

# Harness private registry package main 兼容性判断 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `main` 兼容性问题继续收成正式判断，明确回答：

- `main` 是否需要
- 如果当前仍不能定死，为什么
- 如果继续延后，应延后到什么条件下再判断
- 它与 current trial / future public 的边界差异是什么

这里讨论的是：

- 兼容性判断
- 未来实现前提

它不等于：

- 当前立刻在 `package.json` 补 `main`
- 当前立刻进入真实 publish 实施

## 2. 当前判断前提

当前真实前提包括：

- 当前 package 仍是 `private / in-repo trial`
- 当前 package 已采用：
  - `exports -> dist` 的主导结构
- frozen public API 已建立
- frozen trial metadata 边界已建立
- 最小 `build / dist / files / exports` 已建立
- future 目标发布层级已建议锁定为 `private registry package`
- 条件性元数据判断已经明确：
  - `main`
    - `延后判断`

因此本轮要回答的不是：

- 当前 trial package 是否必须马上补 `main`

而是：

- 当目标转向 `private registry package` 时，`main` 是否已经能被判断，还是仍应继续延后

## 3. 当前为什么不能直接简单依赖 `exports`

从当前实现看，只依赖：

- `exports`

在现代消费语境里是成立的，因为：

- 当前 package 的导出面已经冻结
- `exports -> dist` 映射已经稳定
- 当前 build / dist / usage / release-boundary 测试已经围绕 `exports` 建立

所以对于 current trial state 来说：

- 不补 `main`

并不是问题。

但一旦目标层级提升为：

- `private registry package`

判断维度就发生变化了。

此时要回答的已不是：

- 当前代码结构是否能只靠 `exports`

而是：

- 目标组织内消费环境是否全部稳定支持 `exports`
- 是否仍存在依赖 `main` 的旧工具链、旧打包链或旧加载路径

也就是说，`exports` 在架构上已经足够，不代表它在：

- 组织内消费兼容性

层面已经自动足够。

## 4. 当前为什么不能武断判成“需要”

虽然进入 `private registry package` 后兼容性问题会冒出来，但当前也不能把 `main` 直接判成：

- 必须需要

原因在于，当前并没有证据表明未来目标消费环境一定存在：

- 不支持 `exports` 的消费方
- 强依赖 `main` 的组织内旧工具链

如果在没有这类证据前就提前补 `main`，会带来两个问题：

- 把当前 metadata 复杂度提前抬高
- 让 `private registry package` 过早继承 legacy 兼容负担

因此，当前也不能因为“可能有旧环境”就直接写成：

- 必须保留 `main`

## 5. 当前正式结论

当前对 `main` 的正式结论仍应保持为：

- **继续延后判断**

原因不是因为问题不重要，而是因为它依赖的关键事实当前还不存在：

- 未来组织内目标消费环境还没有被正式定义清楚

在这之前，任何把 `main` 直接判成：

- 需要
- 或不需要

的结论，都容易失真。

## 6. 延后的触发条件

`main` 的判断不应无限期拖延，而应延后到以下条件出现时再做。

## 6.1 目标消费环境明确

至少需要明确：

- 组织内主要消费方是谁
- 消费方使用的 Node / bundler / loader 基线是什么
- 是否存在仍优先依赖 `main` 的工具链

只要这组信息没有明确，`main` 的判断就没有稳定依据。

## 6.2 types 与 publishConfig 策略已经进入实施顺序讨论

因为 `main` 不是孤立字段，它会影响：

- metadata 最终结构
- registry-ready 入口语义
- 与 `exports` 的并存方式

所以更合理的时机是：

- `publishConfig`
- `types`

至少已完成策略定义，并且开始进入：

- metadata 实施顺序设计

## 6.3 组织内发布流程设计开始接近实施

只有当问题从：

- 目标层级设计

开始推进到：

- 组织内发布流程与消费验证设计

`main` 的判断才有真实落点。

否则它会一直停留在：

- 架构猜测

## 7. 三层边界差异

## 7.1 current `private / in-repo trial`

当前层级下：

- `main` 不需要

更准确地说，是：

- 当前 trial package 完全可以只依赖 `exports`

因为当前目标不是 registry 分发，而是：

- 仓库内稳定消费与 frozen boundary

## 7.2 `private registry package`

目标层级下：

- `main` 不是默认必需项
- 也不是默认可删项

它是：

- 兼容性驱动的判断项

如果未来目标消费环境全部稳定支持 `exports`，那么最终结论可能是：

- 不需要 `main`

如果未来明确存在旧工具链或兼容约束，那么最终结论可能变成：

- 需要 `main`

所以在这个层级里，它最合理的当前状态仍是：

- 延后判断

## 7.3 future public package

若未来进入：

- `future public package`

则 `main` 的判断通常会更敏感，因为它会牵涉：

- 更广泛生态兼容性
- 外部用户的加载方式
- public package 的 metadata 完整度

这类要求当前不应直接下压到：

- `private registry package`

## 8. 与当前 frozen trial metadata 的关系

当前 frozen trial metadata 核心集合仍是：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `exports`
- `scripts.build`

因此本轮文档的结论应理解为：

- `main` 已完成“为什么不能现在定死”的兼容性判断
- 它仍属于从 trial metadata 升级到 registry-ready metadata 时的后续判断项

当前还不能误写成：

- `main` 已需要落盘
- 或 `main` 已被正式否决

## 9. 当前结论

当前应稳定采用以下口径：

- current trial package 可以继续只依赖 `exports`
- 进入 `private registry package` 后，`main` 是否需要仍取决于未来组织内消费环境
- 因此 `main` 当前最合理的正式状态仍是：
  - `延后判断`
- 延后不是拖延，而是等待兼容性判断所需事实前提成熟

## 10. 下一步建议

在这份判断文档之后，最自然的下一步是：

- 开始 `private registry package` 的类型最小实现方案设计

或者：

- 开始 `private registry package` 的元数据实施顺序设计

因为这两项会把：

- `publishConfig`
- `types`
- `main`

从分散判断继续推进到：

- registry-ready metadata 的正式落地顺序
