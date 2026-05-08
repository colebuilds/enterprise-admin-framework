---
title: Harness 独立项目承载评估 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-trial-vs-release-strategy-judgement-v1, release-strategy-target-tier-evaluation-v1, private-registry-package-main-reassessment-prerequisites-v1
---

# Harness 独立项目承载评估 V1

## 1. 目标

本文档用于正式评估：

- Harness 是否还适合继续由当前业务仓库承载
- 是否应从当前业务仓库迁出为独立工具项目
- 如果迁出，最合理的承载形态是什么
- 如果暂不迁出，继续留在当前仓库的代价是什么

这里讨论的是：

- 承载形态
- 工具项目边界
- 开发承载与使用承载的分层

它不等于：

- 当前立刻迁仓
- 当前立刻新建独立仓库
- 当前立刻调整 package 路径或 CI

## 2. 当前评估前提

当前 Harness 已经具备的真实状态包括：

- 有独立对象模型、状态模型与 phase 主线
- 有 plugin / host / diagnostics / runtime 边界
- 有真实 `packages/harness`
- 有真实 `build / dist / exports / types / publishConfig`
- 有 trial-scope release prep 收口
- 有 `private registry package` 路线
- 有 `main`、`types`、`publishConfig` 等元数据与消费验证演进线

这说明当前 Harness 已经不再只是：

- 当前业务仓库里的临时脚本集合

而更接近：

- 一个正在形成中的独立工具产品

## 3. 当前的核心问题

当前最明显的问题不是“功能是否还缺很多”，而是：

- 开发承载和使用承载没有真正分开

更具体地说，当前已经开始出现三类混写。

## 3.1 工具开发语境与业务项目语境混写

当前业务仓库既在承载：

- Harness 自身内核开发

又在承载：

- Harness 作为当前业务仓库内部消费对象的试运行

这会导致：

- 工具本体判断受当前业务项目语境污染
- package 决策反复被“当前仓库方便不方便”牵着走

## 3.2 工具文档与业务架构文档混写

当前 `documents/features/architecture/harness-system/*` 已经更像：

- 工具产品设计文档
- package 演进文档
- 发布策略文档

而不再只是：

- 当前业务仓库内部的局部架构说明

这说明文档承载层也开始不匹配。

## 3.3 工具发布路线与业务仓库工程边界混写

当前已经在持续处理：

- `publishConfig`
- `types`
- registry usage
- `main` 重判前置
- 组织内发布流程前置

这些问题本质上属于：

- 工具产品的发布语义

而不再只是：

- 当前业务仓库内部整理

## 4. 候选承载形态

当前至少应比较三种承载形态。

## 4.1 方案 A：继续留在当前业务仓库

定义：

- 继续由当前业务仓库完整承载 Harness 的开发、文档、package 与消费验证

### 收益

- 迁移成本最低
- 当前上下文最完整
- 不需要立即处理跨仓同步问题

### 成本

- 开发承载与使用承载继续混在一起
- 工具边界继续受业务仓库语境牵制
- 文档与发布策略会越来越像“仓库里的独立产品”，但实际承载位置不对

### 风险

- 后续每走一步 release / metadata / compatibility，都会继续放大仓库内混写
- 业务演进与工具演进会更难分账

### 结论

- 适合作为过渡态
- 不适合作为长期形态

## 4.2 方案 B：继续在当前 monorepo 内，但提升为更高层独立工具工程

定义：

- 仍不迁出当前仓库
- 但把 Harness 从“当前业务功能的一部分”提升为“仓库顶层工具工程”
- 开发资产、文档资产、运行资产、package 资产按工具工程方式集中管理

### 收益

- 比独立仓库迁移成本更低
- 能先把开发承载和业务承载做第一层分离
- 有利于后续观察 Harness 是否真的值得继续产品化

### 成本

- 仍然会受到当前 monorepo 总体语境限制
- 仍无法彻底切断和当前业务仓库的耦合

### 风险

- 容易变成“表面独立、实际仍混写”的中间形态
- 如果后续还要独立成仓，可能经历二次迁移

### 结论

- 适合作为中间过渡形态
- 但是否值得做，取决于团队是否希望先做低成本缓冲

## 4.3 方案 C：独立仓库 / 独立项目承载

定义：

- Harness 拥有独立开发主仓
- 当前业务仓库转为：
  - consumer
  - integration sandbox
  - 试运行集成仓

### 收益

- 开发承载与使用承载彻底分开
- 发布策略、文档、测试、版本与 CI 语境全部回到工具本体
- 最利于未来走向：
  - `private registry package`
  - 甚至 future public package

### 成本

- 迁移成本最高
- 需要重新设计文档、测试、版本、集成与同步方式
- 当前业务仓库需要从“开发主仓”转为“消费与集成方”

### 风险

- 若迁移时机过早，会带来组织和工程扰动
- 若最小迁出边界不清，会迁出过多或过少

### 结论

- 最适合作为长期形态
- 但应通过正式方案设计推进，而不是直接动手迁移

## 5. 当前最现实的建议

当前最现实的建议不是：

- 无限期留在方案 A

也不是：

- 不做设计直接进入方案 C 实施

当前最合理的正式建议是：

- **应启动独立项目承载路线**
- **长期目标建议锁定为方案 C：独立仓库 / 独立项目**
- **当前下一步先进入迁出方案设计，而不是立刻迁移**

## 6. 为什么不是更保守方案

如果继续长期停在方案 A，收益已经开始递减。

原因很直接：

- Harness 当前已经有独立 package
- 已经有独立 release strategy
- 已经有独立 metadata / types / registry usage 路线
- 已经在处理工具发布问题，而不是业务功能问题

继续留在业务仓库里，最大的代价不是“看起来有点乱”，而是：

- 后续每一个高层判断都会持续被错误承载位置干扰

## 7. 为什么不是立即进入最激进迁移

虽然长期目标更适合方案 C，但现在还不建议直接开始真实迁移。

原因是当前还缺两类东西：

## 7.1 最小迁出边界尚未被正式定义

当前还没有正式收清：

- 哪些目录必须迁出
- 哪些目录应继续留在当前业务仓库作为 consumer 侧资产
- 哪些 runtime / docs / tests 属于开发主仓，哪些属于集成验证资产

## 7.2 consumer / integration 模式尚未被正式定义

如果迁出，当前业务仓库就不再是开发主仓，而更像：

- 集成消费方
- 试运行沙箱
- 兼容验证仓

但当前这套角色转换还没有正式被设计。

## 8. 建议的最小迁出边界

如果进入独立项目承载路线，当前建议的最小迁出边界至少包括：

## 8.1 package 与源码主线

- `packages/harness`
- 与其直接绑定的 build / dist / types / metadata 主线

## 8.2 Harness 工具主文档

- `documents/features/architecture/harness-system/*`
- 与 Harness 自身 release strategy / package strategy 强绑定的正式文档

## 8.3 Harness 专属测试主线

- 与 package、types、exports、registry strategy 强绑定的测试

## 8.4 Harness 运行资产与版本资产

- `.harness-version.json`
- Harness 自身需要长期独立维护的 runtime / strategy / version 资产

## 9. 当前业务仓库迁出后应保留什么

如果未来迁出，当前业务仓库不应“清空 Harness 相关一切”，而应保留：

- consumer 侧接入说明
- integration smoke
- 业务仓库内的使用层验证
- 对独立 Harness 项目的引用与集成方式

也就是说，迁出后当前仓库更适合承担：

- 使用方
- 集成方

而不是：

- 开发主仓

## 10. 当前正式结论

当前应把这轮评估结论收成：

- Harness 已经不再适合长期只由当前业务仓库承载
- 应启动独立项目承载路线
- 长期目标建议为：
  - `独立仓库 / 独立项目`
- 当前下一步不应直接迁移
- 而应先进入：
  - `独立项目迁出方案设计`

## 11. 下一步建议

当前最自然的下一步是：

1. `开始 Harness 独立项目迁出方案设计：定义最小迁出边界与 consumer/integration 留存边界`
2. `开始 Harness 目标消费环境定义`

如果只允许先做一件事，我建议优先做：

- `独立项目迁出方案设计`
