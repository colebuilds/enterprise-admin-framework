---
title: Harness private registry package main 重判前置条件 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-main-compatibility-judgement-v1, private-registry-package-metadata-implementation-sequencing-v1, private-registry-package-publishconfig-strategy-v1, private-registry-package-types-strategy-v1
---

# Harness private registry package main 重判前置条件 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `main` 问题，从：

- 延后判断

继续推进到：

- 重判前置明确

明确回答：

- `main` 重新判断前至少需要哪些前置
- 当前已经具备哪些
- 当前仍缺哪些
- 什么时候才适合从“延后判断”进入“正式重判”

这里讨论的是：

- 重判前置
- 重判触发条件

它不等于：

- 当前立刻在 `package.json` 新增 `main`
- 当前立刻判定 `main` 必需或不必需
- 当前立刻进入真实 publish 实施

## 2. 当前前置判断背景

此前已经形成的稳定结论包括：

- `main` 在 `private registry package` 层当前仍是：
  - `延后判断`
- `publishConfig` 已完成真实最小落盘：
  - `publishConfig.registry`
- `types` 已完成真实最小实现：
  - frozen public API 的 `.d.ts` 已进入 `dist`
- 根级 `types metadata` 已真实落盘：
  - `"types": "./dist/index.d.ts"`
- frozen public API 的类型消费验证已建立：
  - `.`
  - `./runtime`
  - `./phase`
  - `./plugin`
  - `./host`
  - `./host/codex`

因此本轮要回答的不是：

- 当前技术上能不能继续只靠 `exports`

而是：

- 当前是否已经具备重新判断 `main` 的前置事实

## 3. `main` 重判前至少需要的前置

当前看，`main` 的重判前置至少应包括以下四组。

## 3.1 registry-ready metadata 主线已进入真实落盘阶段

`main` 不应早于以下事项进入重判：

- `publishConfig` 已真实落盘
- `types` 已有真实产物
- `types metadata` 已真实落盘

原因是：

- 在这些 registry-ready metadata 锚点尚未进入真实状态前，`main` 的判断会停留在抽象讨论
- 只有当 package 已开始承接真实分发 metadata，`main` 才会从纯理论问题转成真实兼容性问题

## 3.2 frozen public API 的类型消费面已可真实验证

`main` 的问题不是单独一个字段问题，它和未来消费环境能否稳定消费当前 package 直接相关。

因此在重判前，至少需要看到：

- 当前 `exports`
- 当前 `dist`
- 当前 `.d.ts`
- 当前 `types`

已经能在最小真实消费验证下协同成立。

如果连当前 modern 入口都还没被验证清楚，那么 `main` 的判断会失去基线。

## 3.3 目标消费环境必须明确

这是当前仍缺的最关键前置。

`main` 是否需要，最终不是由架构偏好决定，而是由未来组织内真实消费环境决定。

至少需要明确：

- 主要消费方是谁
- 组织内主要 Node 基线是什么
- 组织内主要 bundler / loader / runtime 是什么
- 是否存在仍优先依赖 `main` 的旧工具链、旧脚手架或旧装配路径

如果这些事实没有被定义，`main` 的判断仍然没有稳定落点。

## 3.4 组织内发布流程设计需进入可实施前状态

`main` 不应只在 metadata 视角里重判，还需要放回将来的组织内分发流程语境里看。

至少需要明确：

- package 未来以什么形式被组织内消费
- 是否会出现 `npm/pnpm/yarn` 之外的包装流程
- 是否存在需要照顾 legacy consumer 的发布兼容面

如果发布流程设计仍停留在高层方向判断，`main` 重判就仍然过早。

## 4. 当前已具备的前置

当前已经具备的前置主要有以下几项。

## 4.1 metadata 主线已经不再只是文档设计

当前已经形成真实落盘或真实产物的部分：

- `publishConfig.registry`
- `types`
- `dist/*.d.ts`

这意味着：

- `main` 已经不再需要等所有 metadata 还停留在纸面设计时再讨论

## 4.2 现代入口语义已经有真实消费基线

当前 package 已经同时具备：

- `exports` 双通道：
  - `types`
  - `import`
- 根级 `types metadata`
- frozen public API 的真实 TypeScript `NodeNext` 消费验证

这意味着：

- 当前 modern 消费语义已经有稳定基线
- 未来若讨论 `main`，就不是在没有现代基线的情况下空谈兼容

## 4.3 frozen trial boundary 仍保持稳定

当前仍稳定保持：

- `private`
- frozen public API 不扩张
- frozen `files / dist / exports` 不漂移
- internal-only 边界未被带入公开承诺面

这保证了后续若进入 `main` 重判，不会和边界失控混在一起。

## 5. 当前仍缺的前置

当前仍缺的，不在 metadata 技术实现层，而在消费环境与流程层。

## 5.1 组织内目标消费环境未正式定义

这是当前最大缺口。

目前我们仍不知道：

- future private registry package 主要会被哪些仓库消费
- 那些仓库的 Node / bundler / loader 基线是什么
- 是否存在仍依赖 `main` 的消费路径

在没有这组信息前，`main` 仍不能稳定重判。

## 5.2 组织内发布流程设计尚未进入可实施细化

当前已经有：

- `publishConfig`
- `types`

但仍没有：

- 组织内 registry 分发流程设计
- 消费侧安装与加载路径约束
- legacy consumer 是否需要兼容的正式结论

没有这层信息，`main` 仍缺少真实语境。

## 5.3 更高层 registry 消费验证尚未建立

当前已有的是：

- repo 内最小 TypeScript 消费验证

但还没有：

- 更接近组织内真实 registry usage 的消费验证
- 更贴近真实安装语境的入口兼容验证

这意味着目前仍不足以回答：

- 未来组织内真实消费是否需要 `main`

## 6. 当前是否已接近重判窗口

当前更准确的结论是：

- **已经接近 `main` 重判窗口**
- 但**尚未进入正式重判窗口**

原因是：

- metadata 主线与类型主线已经具备真实基础
- 但消费环境与流程层事实仍缺失

也就是说，当前状态已经不是：

- 完全不能谈 `main`

而是：

- 技术前置基本够了
- 但环境前置还不够

## 7. 正式重判的触发条件

只有命中以下条件，才适合把 `main` 从“延后判断”升级为“正式重判”。

## 7.1 目标消费环境被正式定义

至少需要一份明确判断：

- 目标消费者类型
- Node 基线
- bundler / loader 基线
- 是否存在 legacy consumer

## 7.2 registry 消费验证进入更真实语境

至少需要一轮更贴近未来组织内消费方式的验证，证明：

- 仅靠 `exports + types` 是否已经足够
- 是否出现需要 `main` 的真实阻塞

## 7.3 组织内发布流程设计进入实施前细化

至少需要看到：

- 组织内 registry 分发流程草案
- 消费约束草案
- metadata 联动边界已进入实施前核对

只有到这一步，`main` 的判断才不是孤立字段讨论。

## 8. 当前正式结论

当前对 `main` 重判前置的正式结论应为：

- **metadata 与类型前置已基本具备**
- **消费环境与发布流程前置仍缺**
- **当前已接近重判窗口，但还不应直接进入正式重判**

因此下一步最合理的方向不是：

- 直接落 `main`

而是：

- 先补更高层 registry 消费环境前置
- 或先做组织内发布流程设计前置

## 9. 下一步建议

当前更自然的下一步有两类：

1. `开始 Harness private registry package 更高层 registry 消费验证`
2. `开始 Harness private registry package 组织内发布流程前置设计`

只有这两类前置进一步落地后，`main` 才适合进入：

- 正式重判
