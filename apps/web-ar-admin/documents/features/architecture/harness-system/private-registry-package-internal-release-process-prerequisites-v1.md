---
title: Harness private registry package 组织内发布流程前置设计 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-main-reassessment-prerequisites-v1, private-registry-package-registry-consumption-validation-v1, private-registry-package-publishconfig-strategy-v1, private-registry-package-types-strategy-v1
---

# Harness private registry package 组织内发布流程前置设计 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下所需的组织内发布流程，先收成一套前置设计，明确回答：

- future 组织内发布流程至少应分几阶段
- 每个阶段的进入条件、允许动作、禁止动作与退出条件是什么
- 当前 `publishConfig / types / registry usage` 在这套流程里处于哪一层
- 这套流程前置如何支撑 `main` 的正式重判

这里讨论的是：

- 组织内发布流程前置
- 进入真实发布实施前的阶段与门槛

它不等于：

- 当前立刻开始真实 `publish`
- 当前立刻去掉 `private`
- 当前立刻新增发布脚本

## 2. 当前流程设计前提

当前已经形成的真实前提包括：

- 当前 package 仍保持：
  - `private`
  - `in-repo trial`
- frozen public API 已冻结
- frozen `exports / files / dist` 已冻结
- `publishConfig.registry` 已真实落盘
- `types` 与 `.d.ts` 已真实进入产物链
- 根级 `types metadata` 已真实落盘
- 更高层安装态 registry usage 验证已成立

因此本轮要回答的不是：

- 当前 package 是否已经具备发布能力

而是：

- 在走向 future `private registry package` 的过程中，组织内发布流程至少应先被怎样设计

## 3. 设计原则

这套组织内发布流程前置，当前应遵守以下原则。

## 3.1 先设计阶段与门槛，不先落发布脚本

当前更缺的是：

- 流程阶段
- 进入条件
- 禁止动作

而不是：

- 立刻写 `publish` 脚本
- 立刻执行真实分发

## 3.2 先保持 frozen trial boundary 不变

流程前置设计必须继续服从当前已冻结的边界：

- frozen public API 不变
- current `exports / files / dist` 不扩张
- `private` 不变
- internal-only 路径不进入公开承诺面

这意味着流程设计只能表达：

- future 组织内发布如何受控推进

不能变成：

- 扩边界的理由

## 3.3 先区分 modern readiness 与 legacy compatibility

当前 package 已经证明：

- modern 安装态消费继续成立

因此后续流程不应继续把“现代消费是否成立”和“legacy 兼容是否需要补”混在一起。

更合理的做法是：

- 先承认 modern readiness 已具备
- 再把 legacy compatibility 当作单独阶段输入

## 4. 推荐的最小阶段划分

当前建议 future `private registry package` 的组织内发布流程前置至少分为四个阶段。

## 4.1 第一阶段：Metadata Readiness

这一阶段的目标是确认 package 已具备最小 registry-ready metadata 基线。

### 进入条件

- frozen trial boundary 已建立
- `publishConfig.registry` 已真实落盘
- 根级 `types metadata` 已真实落盘
- frozen public API 未发生漂移

### 允许动作

- 核对 `package.json` 中的 registry-ready metadata
- 核对 `exports / files / dist / types / publishConfig`
- 核对 README 与正式文档口径

### 禁止动作

- 去掉 `private`
- 新增发布脚本
- 新增 `main`
- 扩大 public API
- 引入 internal-only 路径

### 退出条件

- metadata 主线已形成稳定最小基线
- 当前 metadata 已能支撑下一阶段消费验证

## 4.2 第二阶段：Consumption Readiness

这一阶段的目标是确认 package 在更接近组织内安装态的语境下仍可稳定消费。

### 进入条件

- 第一阶段已成立
- `.d.ts` 已真实进入 `dist`
- `exports` 与 `.d.ts` 已有一一对应关系

### 允许动作

- 做 repo 内最小消费验证
- 做安装态 package 消费验证
- 验证 `publishConfig / exports / types / .d.ts` 的协同关系

### 禁止动作

- 真实连接 registry 做网络发布验证
- 新增 legacy 兼容字段
- 为了通过验证而扩大导出面

### 退出条件

- modern 安装态消费继续成立
- 没有出现新的现代消费阻塞

## 4.3 第三阶段：Process Readiness

这一阶段的目标是把 future 组织内发布流程的实际门槛与角色边界先定义清楚。

### 进入条件

- 前两阶段已经成立
- `publishConfig / types / registry usage` 已不再只是纸面设计

### 允许动作

- 设计组织内发布流程草案
- 明确哪些角色可以进入下一步
- 明确是否需要 legacy consumer 兼容判断
- 明确未来发布前核对项

### 禁止动作

- 真实 `publish / pack`
- 真实去私有化
- 把流程草案写成已实施能力

### 退出条件

- 组织内发布流程前置已成文
- `main` 重判所需的流程语境已具备

## 4.4 第四阶段：Pre-release Judgement

这一阶段不是发布实施，而是 future 组织内发布前的正式判断层。

### 进入条件

- 前三阶段已经成立
- 目标消费环境已被明确
- 组织内流程与消费验证已有事实支撑

### 允许动作

- 重新判断 `main`
- 判断是否需要 legacy compatibility 补项
- 判断是否已足够进入更真实的组织内发布实施准备

### 禁止动作

- 把判断直接等同于真实发布
- 没有新事实就武断补 `main`
- 把 current trial package 写成 `publish-ready`

### 退出条件

- 对 `main`、legacy compatibility、后续组织内实施入口形成正式结论

## 5. 当前真实状态映射

把当前状态映射到上面四阶段，更准确的结论如下。

## 5.1 第一阶段已基本成立

当前已经具备：

- `publishConfig.registry`
- 根级 `types`
- frozen metadata 边界
- frozen `exports / files / dist`

所以：

- `Metadata Readiness`
  - 当前已基本成立

## 5.2 第二阶段已基本成立

当前已经具备：

- repo 内最小 TypeScript 消费验证
- 安装态 package JS/TS 消费验证
- modern package consumption 未出现新阻塞

所以：

- `Consumption Readiness`
  - 当前也已基本成立

## 5.3 第三阶段正是当前最缺的一层

当前还没有形成的，是：

- 组织内发布流程草案
- 流程内角色边界
- 流程内允许/禁止动作集合
- 与 legacy compatibility 的连接方式

所以：

- `Process Readiness`
  - 是当前最核心的缺口

## 5.4 第四阶段当前仍未进入

虽然当前已经更接近 `main` 重判窗口，但还没有进入：

- `Pre-release Judgement`

原因是：

- 组织内目标消费环境仍未正式定义
- 组织内发布流程前置设计直到本轮才开始收清

## 6. 每阶段允许动作与禁止动作的总览

为避免后续漂移，当前可压缩为一句：

- 第一阶段允许核对 metadata，不允许扩边界
- 第二阶段允许做现代消费验证，不允许假装真实发布
- 第三阶段允许设计流程，不允许提前实施流程
- 第四阶段允许重判兼容项，不允许把重判等同于发包

## 7. 这套流程如何支撑 `main` 重判

当前 `main` 最难判断的，不再是：

- `exports` 是否存在
- `types` 是否存在

而是：

- future 组织内消费环境是否需要 legacy compatibility

这套流程前置的作用就在于把 `main` 的判断放到正确语境中：

## 7.1 先证明 modern path 已成立

第一、第二阶段已经说明：

- 当前 modern metadata 与 modern consumption 继续成立

因此未来若要补 `main`，就不是为了修现代链路，而只能是为了解决：

- 目标消费环境中的 legacy path

## 7.2 再通过流程前置判断是否真的存在 legacy 需求

只有当第三阶段把以下内容说清：

- 谁会消费
- 用什么消费
- 是否存在旧工具链

第四阶段的 `main` 重判才不会失真。

## 8. 当前正式结论

当前对组织内发布流程前置的正式结论应为：

- `Metadata Readiness`
  - 已基本成立
- `Consumption Readiness`
  - 已基本成立
- `Process Readiness`
  - 当前正在补
- `Pre-release Judgement`
  - 仍未进入

因此，当前最合理的后续方向不是：

- 直接落 `main`

而是：

- 继续把目标消费环境定义补齐
- 然后再进入 `main` 正式重判

## 9. 下一步建议

当前这轮流程前置设计完成后，最自然的下一步是：

1. `开始 Harness private registry package 目标消费环境定义`
2. `开始 Harness private registry package main 正式重判`

如果没有目标消费环境的新事实，建议优先先做：

- `目标消费环境定义`
