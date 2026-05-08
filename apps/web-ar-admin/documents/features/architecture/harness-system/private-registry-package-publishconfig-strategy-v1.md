---
title: Harness private registry package publishConfig 策略 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-conditional-metadata-judgement-v1, private-registry-package-metadata-strategy-v1, private-registry-package-target-requirements-v1
---

# Harness private registry package publishConfig 策略 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `publishConfig` 策略继续收成正式设计，明确回答：

- 为什么 `publishConfig` 在该层级是需要项
- 它应该约束哪些发布行为
- 它当前不应承担哪些语义
- 它与 current trial / future public 的边界差异是什么

这里讨论的是：

- 目标策略
- 未来实现约束

它不等于：

- 当前立刻修改 `packages/harness/package.json`
- 当前立刻去掉 `private`
- 当前立刻进入真实 publish 实施

## 2. 当前判断前提

当前真实前提包括：

- 当前 package 仍是 `private / in-repo trial`
- frozen public API 已建立
- frozen trial metadata 边界已建立
- 最小 `build / dist / files / exports` 已建立
- `trial-scope release prep` 已完整收口
- future 目标发布层级已建议锁定为 `private registry package`
- 条件性元数据判断已经明确：
  - `publishConfig`
    - `需要`

因此本轮要回答的不是：

- 现在要不要直接落 `publishConfig`

而是：

- 到达 `private registry package` 时，`publishConfig` 应该承担什么职责

## 3. 为什么 `publishConfig` 在该层级需要

`publishConfig` 在：

- `private in-repo trial`

阶段不是必须项，因为当前 package 仍停留在仓库内使用语境，尚未进入 registry 分发语义。

但一旦目标层级提升为：

- `private registry package`

它就不再只是“可有可无”的补充字段，而是需要承担最小分发边界约束的关键入口。

它存在的主要原因不是：

- 扩大 public surface
- 暗示 package 已可对外发布

而是：

- 明确 package 面向的分发域仍是组织内私有 registry
- 避免 package 在没有显式约束时被错误理解成 future public package
- 为后续组织内发布流程、发布脚本和 registry 路径策略提供稳定挂点

## 4. `publishConfig` 在 private registry package 层应承担的职责

在 `private registry package` 层，`publishConfig` 至少应承担以下职责。

## 4.1 约束目标发布域

`publishConfig` 应首先明确 package 的分发目标属于：

- 组织内私有 registry

而不是：

- 默认 public registry
- 未声明的外部分发目标

这层约束的重点是：

- 把 registry 目标从“环境外推”升级为“package 级元数据承诺”

## 4.2 约束发布行为的默认解释

当 package 进入 registry-ready 语义后，`publishConfig` 应负责减少以下歧义：

- 某次发布行为到底是否针对组织内 registry
- 当前 package 是否允许被当作公开包对待
- 当前发布语义是否仍然受 `private registry package` 边界约束

换句话说，它应承担：

- 发布语义收口

而不只是：

- 字段存在性

## 4.3 作为后续发布流程设计的稳定挂点

`publishConfig` 还应为后续这些工作提供稳定挂点：

- 组织内发布脚本设计
- `pack / publish` 前置门控设计
- 版本推进与 registry 分发策略

但它此时仍只是：

- 元数据策略锚点

不是：

- 发布流程本身

## 5. `publishConfig` 当前不应承担的语义

在当前目标层级下，`publishConfig` 不应被赋予以下含义。

## 5.1 不等于去掉 `private`

即使未来要设计 `publishConfig`，也不代表当前就应该：

- 去掉 `"private": true`

在当前阶段，更合理的理解是：

- 先把 registry-ready 语义设计清楚
- 再决定何时进入真正的 package 元数据落盘与发布前实现

## 5.2 不等于进入真实发布

`publishConfig` 的存在不等于：

- 现在就允许 `publish`
- 现在就允许 `pack`
- 现在就允许新增发布脚本

这些都仍属于：

- 后续发布流程设计与实施阶段

## 5.3 不等于 public package 语义

当前 `publishConfig` 讨论的是：

- `private registry package`

不是：

- future public package

因此它当前不应承担：

- 公开 registry 分发语义
- 面向外部用户的发布承诺
- 对外公开包元数据优化

## 6. 三层边界差异

## 6.1 current `private / in-repo trial`

当前层级下：

- `publishConfig` 可以缺席

原因是：

- package 仍不进入 registry 语义
- 当前主要目标仍是仓库内稳定消费与边界冻结

## 6.2 `private registry package`

目标层级下：

- `publishConfig` 应出现

原因是：

- 需要明确私有 registry 分发域
- 需要为组织内发布行为提供元数据级约束
- 需要把 package 从“仅仓库内 trial”提升到“可组织内分发”

## 6.3 future public package

若未来进入：

- `future public package`

则 `publishConfig` 可能需要承担更强语义，例如：

- 面向公开发布的分发配置
- 更严格的对外发布边界
- 与 public package 元数据整体联动

这部分当前不应直接下压到：

- `private registry package`

## 7. 与当前 frozen trial metadata 的关系

当前 frozen trial metadata 的核心集合仍是：

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

- `publishConfig` 已经完成“是否需要”的策略判断
- 但它仍属于从 trial metadata 升级到 registry-ready metadata 时的后续实现项

当前还不能误写成：

- `publishConfig` 已经落盘
- 当前 package 已达到 registry-ready

## 8. 从当前状态推进到该策略仍缺什么

若后续要真正进入 `publishConfig` 落盘阶段，当前至少还差：

- 组织内目标 registry 语义的进一步明确
- 与 `private` 关系的实施级门控规则
- 发布脚本与发布流程设计
- registry-ready metadata 整体实施顺序

也就是说，这一轮完成的是：

- `publishConfig` 策略定义

而不是：

- `publishConfig` 实施

## 9. 当前结论

当前应稳定采用以下口径：

- `publishConfig` 在 `private registry package` 层是需要项
- 它的主要职责是约束私有 registry 分发语义和后续发布行为解释
- 它当前不应承担 public package 语义
- 它当前不等于应立刻落盘到 `packages/harness/package.json`

## 10. 下一步建议

在这份策略文档之后，最自然的下一步是继续收另外两个高优先级条件项：

- `types` 策略设计
- `main` 兼容性判断

因为这两项会直接影响：

- `private registry package` 的消费体验
- registry-ready metadata 的完整度
