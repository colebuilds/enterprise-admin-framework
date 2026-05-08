---
title: Harness private registry package types 策略 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-conditional-metadata-judgement-v1, private-registry-package-metadata-strategy-v1, private-registry-package-target-requirements-v1
---

# Harness private registry package types 策略 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `types` 策略继续收成正式设计，明确回答：

- 为什么 `types` 在该层级是需要项
- 它至少应覆盖哪些导出入口
- 它当前不应承担哪些语义
- 它与 current trial / future public 的边界差异是什么

这里讨论的是：

- 目标策略
- 未来实现约束

它不等于：

- 当前立刻生成 `.d.ts`
- 当前立刻修改 `packages/harness/package.json`
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
  - `types`
    - `需要`

因此本轮要回答的不是：

- 现在要不要直接落类型产物

而是：

- 到达 `private registry package` 时，`types` 应该承担什么职责

## 3. 为什么 `types` 在该层级需要

一旦目标层级从：

- `private / in-repo trial`

提升到：

- `private registry package`

package 的典型消费者就不再只剩当前仓库和当前实现者，而会扩展到：

- 组织内跨仓消费
- 组织内跨项目集成
- 组织内二次封装或适配层

在这种前提下，如果仍不提供类型入口，会明显削弱：

- 可消费性
- API 可理解性
- 演进时的变更可控性

当前 Harness 已经不是单一脚本，而是具有：

- runtime 边界
- phase 边界
- plugin 边界
- host 边界
- frozen exports

这类 package 如果进入组织内分发语境，类型支持不应再被视为“增强项”，而应被视为：

- registry-ready 的必要项

## 4. `types` 在 private registry package 层应承担的职责

在 `private registry package` 层，`types` 至少应承担以下职责。

## 4.1 提供稳定的入口级类型消费面

`types` 首先应服务于当前 frozen public API，而不是另外发明一套独立类型面。

这意味着它应围绕：

- 已允许的导出入口

提供最小可消费的类型描述。

## 4.2 提升 API 理解成本的可控性

类型的价值不只是“编辑器补全”，更重要的是：

- 让组织内使用者知道每个入口大致暴露什么对象
- 让 runtime / phase / plugin / host 的边界更容易被理解
- 在 package 继续演进时，为稳定性讨论提供更具体的接口基线

## 4.3 为后续 API 稳定性升级提供载体

当前 frozen public API 仍属于：

- trial-scope 承诺

而一旦进入：

- `private registry package`

类型入口会成为把 trial-scope 冻结边界升级为组织内稳定 API 的重要载体。

也就是说，`types` 在该层级不仅承担：

- 消费便利性

还承担：

- 稳定性表达载体

## 5. `types` 至少应覆盖哪些入口

`types` 的最小覆盖范围应与当前 frozen public API 严格对齐，不应扩大。

当前至少应覆盖以下入口：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

这意味着后续真正进入类型实现阶段时，至少应能为这组入口提供：

- 对应的类型入口或类型声明映射

当前仍明确不应进入类型承诺面的路径包括：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

也就是说，`types` 的覆盖范围应服从：

- frozen public API

而不是反过来推动新的导出扩张。

## 6. `types` 当前不应承担的语义

在当前目标层级下，`types` 不应被赋予以下含义。

## 6.1 不等于完整 public package 类型承诺

当前讨论的是：

- `private registry package`

不是：

- future public package

因此当前的 `types` 策略不应直接默认：

- 对外公开长期兼容承诺
- 面向外部生态的类型设计
- public package 等级的类型稳定面

## 6.2 不等于 internal-only 边界开放

提供 `types` 也不意味着可以顺手把：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

带进类型入口。

类型支持只能服务于：

- 已冻结的 public API

不能作为扩大 package surface 的借口。

## 6.3 不等于当前已经落盘

本轮完成的是：

- `types` 策略定义

不是：

- `.d.ts` 已生成
- `types` 字段已落盘
- 当前 package 已达到 registry-ready

## 7. 三层边界差异

## 7.1 current `private / in-repo trial`

当前层级下：

- `types` 可以缺席

原因是：

- 当前主要消费者仍是当前仓库自身
- frozen boundary 的主要目标是控制 trial scope，而不是组织内跨仓分发体验

## 7.2 `private registry package`

目标层级下：

- `types` 应出现

原因是：

- 需要支持组织内跨仓和跨项目消费
- 需要把 frozen API 升级为更稳定的组织内消费接口
- 需要降低 package 使用门槛与误用成本

## 7.3 future public package

若未来进入：

- `future public package`

则 `types` 可能需要承担更强语义，例如：

- 更严格的兼容承诺
- 更完整的对外类型体验
- 与公开文档、版本策略和 deprecation 机制更强绑定

这些要求当前不应直接下压到：

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

- `types` 已完成“是否需要”的策略判断
- `types` 也已完成“至少覆盖哪些入口”的策略定义
- 但它仍属于从 trial metadata 升级到 registry-ready metadata 时的后续实现项

当前还不能误写成：

- `types` 已落盘
- 当前 package 已具备类型产物

## 9. 从当前状态推进到该策略仍缺什么

若后续要真正进入 `types` 落盘阶段，当前至少还差：

- runtime / phase / plugin / host 各入口的最小类型边界设计
- 类型产物生成方式判断
- `types` 字段与 `exports` 的映射策略
- 类型消费验证基线

也就是说，这一轮完成的是：

- `types` 策略定义

而不是：

- `types` 实施

## 10. 当前结论

当前应稳定采用以下口径：

- `types` 在 `private registry package` 层是需要项
- 它至少应覆盖当前 frozen public API 的全部入口
- 它当前不应承担 public package 等级的完整类型承诺
- 它当前不等于应立刻落盘到 `packages/harness/package.json`

## 11. 下一步建议

在这份策略文档之后，最自然的下一步是继续收：

- `main` 兼容性判断

或者继续推进：

- `types` 最小实现方案设计

因为这两项会直接决定 `private registry package` 目标层级下：

- registry-ready metadata 的具体落盘顺序
- 组织内消费体验的最小完成态
