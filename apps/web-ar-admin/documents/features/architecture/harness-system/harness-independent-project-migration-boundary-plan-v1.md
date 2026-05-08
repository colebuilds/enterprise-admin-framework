---
title: Harness 独立项目迁出边界方案 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: harness-independent-project-hosting-evaluation-v1, private-registry-package-registry-consumption-validation-v1, private-registry-package-internal-release-process-prerequisites-v1
---

# Harness 独立项目迁出边界方案 V1

## 1. 目标

本文档用于把 Harness 从当前业务仓库迁出为独立项目时的边界继续收成正式方案，明确回答：

- 最小应迁出哪些资产
- 当前业务仓库哪些资产应继续作为：
  - `consumer`
  - `integration` 保留
- 哪些资产当前暂不处理
- 迁出后独立项目与当前业务仓库的职责如何分层

这里讨论的是：

- 迁出边界
- 留存边界
- 双方职责分层

它不等于：

- 当前立刻迁移文件
- 当前立刻新建独立仓库
- 当前立刻调整目录结构或 CI

## 2. 当前方案前提

当前已经形成的正式结论包括：

- Harness 已不再适合长期只由当前业务仓库承载
- 应启动独立项目承载路线
- 长期目标建议锁定为：
  - `独立仓库 / 独立项目`

同时，当前 Harness 已经具备的真实资产包括：

- `packages/harness`
- `scripts/harness-runtime/*`
- `.harness-runtime/*`
- `documents/features/architecture/harness-system/*`
- package / types / registry usage 相关测试
- 独立的 release strategy / private registry / main 重判前置文档线

因此本轮要回答的不是：

- 要不要迁

而是：

- 如果迁，最小应该迁什么
- 当前业务仓库又应该留什么

## 3. 资产分层原则

本轮边界设计当前应遵守以下原则。

## 3.1 开发主仓资产与消费方资产必须分开

凡是直接服务于 Harness 本体开发、版本演进、发布语义、运行时模型与测试模型的资产，应优先视为：

- 开发主仓资产

凡是主要服务于当前业务仓库“如何接入、如何调用、如何验证集成”的资产，应优先视为：

- `consumer / integration` 资产

## 3.2 先迁工具本体闭环，再保留业务仓消费闭环

迁出的最小目标不是“把所有相关文件都搬走”，而是先让独立项目能自洽地承载：

- 开发
- 测试
- 文档
- 版本与发布策略

与此同时，当前业务仓库仍需要保留：

- 消费闭环
- 集成闭环

## 3.3 暂不处理资产要显式列出

如果某些资产当前既不适合立刻迁，也不适合简单留在业务仓库中，就必须显式标记为：

- 暂不处理

否则后续迁移边界会不断返工。

## 4. 最小迁出边界

当前建议的最小迁出边界如下。

## 4.1 package 与源码主线

这部分应整体迁出，作为独立项目的核心源码资产：

- `packages/harness/*`

其中包括：

- `src/*`
- `dist/*`
- `scripts/build.mjs`
- `package.json`
- 包内 `README.md`

原因：

- 这已经是 Harness 的真实工具产品载体
- 它不再只是当前业务仓库内部脚本集合

## 4.2 runtime / diagnostics / host 的实现主线

以下实现主线应优先视为 Harness 工具本体的一部分：

- `scripts/harness-runtime/core/*`
- `scripts/harness-runtime/diagnostics/*`
- `scripts/harness-runtime/host/*`

原因：

- 它们承接的是 Harness 自身对象模型、生命周期、diagnostics 与 host 边界
- 属于工具内核，不应继续长期绑定在当前业务仓库语境里

## 4.3 Harness 专属测试主线

以下测试资产应优先迁出：

- `scripts/harness-runtime/tests/*`

尤其是：

- package 边界测试
- types / registry usage 测试
- runtime / phase / diagnostics 主线测试

原因：

- 这些测试当前主要证明 Harness 工具本体是否成立
- 而不是业务功能是否成立

## 4.4 Harness 主文档群

以下文档应视为独立项目主文档群，进入迁出主线：

- `documents/features/architecture/harness-system/*`

原因：

- 当前这组文档已经主要在描述 Harness 自身产品路线
- 不再只是当前业务仓库某个局部改造说明

## 4.5 Harness 版本与运行资产

以下资产应优先进入独立项目边界：

- `/.harness-version.json`
- `/.harness-runtime/*`

原因：

- 这两类资产已经在承接 Harness 自身的版本、模板与运行时模型
- 更适合跟随工具本体演进

## 5. `consumer` 留存边界

迁出后，当前业务仓库仍应保留一组明确的 `consumer` 资产。

## 5.1 接入说明

当前业务仓库需要继续保留：

- 面向当前业务仓库使用方的接入说明
- 如何在当前仓库中消费 Harness 的说明

这类资产属于：

- 消费方文档

而不是工具主文档。

## 5.2 业务侧使用约束

如果当前业务仓库对 Harness 有特定使用约束，例如：

- 只能用哪些入口
- 只能在什么场景启用
- 当前业务仓库如何落地 runtime

这类内容也应继续留在当前业务仓库，作为：

- `consumer` 侧规则

## 5.3 最小消费样例

若当前业务仓库需要保留最小调用样例、最小使用姿势、最小配置样例，这些也更适合留在当前仓库。

原因：

- 它们说明的是“当前业务仓怎么用”
- 不是“工具本体怎么设计”

## 6. `integration` 留存边界

迁出后，当前业务仓库还应保留一组明确的 `integration` 资产。

## 6.1 集成 smoke

以下更适合作为 `integration` 留存：

- 当前业务仓库内与 Harness 集成有关的 smoke
- 证明当前业务仓接入没有被独立项目升级打坏的验证

它们的职责是：

- 验证业务仓与独立 Harness 项目的集成关系

而不是验证 Harness 内核本身。

## 6.2 试运行与兼容验证

如果当前业务仓库仍承担：

- 试运行沙箱
- 兼容验证沙箱
- 当前真实业务上下文下的集成验证

那么这些内容也应继续留在当前业务仓库，作为：

- `integration sandbox`

## 6.3 业务仓特有装配层

凡是明显依赖当前业务仓库结构、配置、流程、路径的装配层，都不应迁入独立项目。

这类内容应保留在当前仓库，因为它属于：

- 当前 consumer 的集成责任

## 7. 暂不处理资产

当前建议以下资产先进入“暂不处理”状态，而不是急于定迁或定留。

## 7.1 与业务工程治理混写但尚未完成拆分的说明文档

例如当前工作区里一些仍在演进中的：

- `documents/guides/engineering/*`
- 其他与工程治理、AI 协作混写的说明

这类内容当前不应被直接归入 Harness 独立项目边界，除非后续明确它们已转化为 Harness 专属文档。

## 7.2 尚未从业务语境中完全抽离的局部脚手架或接入试验物

如果某些内容当前还强依赖当前业务仓库路径、脚本、临时试验目录，也不应在本轮方案里草率归类。

## 8. 迁出后双方职责分层

迁出后，两边职责应明确分层如下。

## 8.1 独立项目负责什么

独立 Harness 项目应负责：

- 工具本体开发
- package / build / dist / types / metadata
- runtime / phase / plugin / diagnostics / host 内核
- 工具主文档
- 工具版本与发布策略
- 工具本体回归测试

## 8.2 当前业务仓库负责什么

当前业务仓库应负责：

- 作为 Harness 的消费方
- 作为集成验证方
- 保留接入说明、消费约束、集成 smoke
- 验证独立 Harness 升级后对当前业务仓的影响

## 8.3 两边关系如何描述

未来更合理的关系是：

- 独立 Harness 项目：
  - `开发主仓`
- 当前业务仓库：
  - `consumer`
  - `integration sandbox`

而不应再继续维持：

- 当前业务仓库既是开发主仓又是主要消费方

## 9. 当前正式结论

当前对迁出方案的正式结论应为：

- 最小迁出边界已经可以清晰定义
- 当前业务仓库的 `consumer / integration` 留存边界也已可以清晰定义
- 当前最合理的下一步已不再是继续做抽象承载讨论
- 而是进入更细的：
  - 迁移顺序设计
  - consumer / integration 过渡方案设计

## 10. 下一步建议

当前最自然的下一步是：

1. `开始 Harness 独立项目迁移顺序设计：先迁什么、后迁什么`
2. `开始 Harness consumer / integration 过渡方案设计`

如果只允许先做一件事，我建议优先做：

- `开始 Harness 独立项目迁移顺序设计：先迁什么、后迁什么`
