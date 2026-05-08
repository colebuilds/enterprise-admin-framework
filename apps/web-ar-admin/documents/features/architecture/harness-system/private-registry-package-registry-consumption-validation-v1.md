---
title: Harness private registry package 更高层 registry 消费验证 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-main-reassessment-prerequisites-v1, private-registry-package-publishconfig-minimal-landing-plan-v1, private-registry-package-types-metadata-minimal-landing-plan-v1
---

# Harness private registry package 更高层 registry 消费验证 V1

## 1. 目标

本文档用于记录 Harness future package 在：

- `private registry package`

目标层级下，新增的一轮更高层 registry usage 验证，明确回答：

- 当前 package 在更接近安装后消费的语境下是否仍可稳定消费
- `publishConfig / exports / types / .d.ts` 是否在该语境下协同成立
- 是否出现新的兼容性阻塞
- 这是否足以推进 `main` 更接近正式重判窗口

这里讨论的是：

- 更高层消费验证
- 当前验证结论

它不等于：

- 当前已经 `registry-ready`
- 当前已经 `publish-ready`
- 当前已经应当落 `main`

## 2. 本轮验证方式

本轮没有进入真实 `publish / pack`，也没有模拟真实 registry 网络交互。

当前采用的是一条更接近 future registry 安装语境、但仍保持安全最小化的验证路径：

1. 按当前 package `files` 白名单复制安装态目录
2. 在临时 `node_modules/@ar/harness` 下形成最小已安装 package 结构
3. 基于该安装态目录分别进行：
   - JS 入口消费验证
   - TypeScript `NodeNext` 类型消费验证

这意味着本轮验证关注的是：

- 安装后 package 结构是否足以被消费
- 公开入口是否真的能通过 package 名称导入

而不是：

- 真实 registry 发布流程
- 真实认证与拉取流程

## 3. 本轮验证覆盖范围

本轮验证严格围绕当前 frozen public API：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

同时验证以下 metadata / 产物协同关系：

- `publishConfig.registry`
- 根级 `types`
- `exports`
- `dist/*.mjs`
- `dist/*.d.ts`

当前仍明确不进入验证面的路径包括：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

## 4. 本轮验证得到的正式结论

## 4.1 当前 package 在安装态语境下仍可稳定消费

在按 `files` 白名单复制后的最小已安装目录中，当前 package 仍可稳定完成：

- JS 根入口消费
- JS frozen 子路径消费
- TypeScript `NodeNext` 根入口消费
- TypeScript `NodeNext` frozen 子路径消费

这说明当前 package 不只是：

- repo 内部直连可用

而是已经具备：

- 更接近 future registry 安装后的最小可消费性

## 4.2 `publishConfig / exports / types / .d.ts` 当前协同成立

本轮验证确认，以下组合当前没有互相打架：

- `publishConfig.registry`
- `exports` 的 `types + import` 双通道结构
- 根级 `types`
- frozen 子路径对应的 `.d.ts`

更具体地说：

- `publishConfig.registry` 未破坏当前 trial 边界
- 根级 `types` 能指向真实存在的 `dist/index.d.ts`
- frozen 子路径也能在安装态语境下被类型消费
- `exports -> dist` 仍是当前 package 的唯一公开入口映射

## 4.3 本轮没有发现新的现代消费兼容性阻塞

在当前已验证的现代消费基线里，本轮没有出现新的阻塞，例如：

- 安装态下 JS 根入口失效
- 安装态下子路径导入失效
- 根级 `types` 与真实类型产物不一致
- frozen 子路径类型入口无法被 `NodeNext` 消费

因此到当前为止，新出现的结论不是：

- `main` 已经被证明需要

而是：

- 当前 modern package 结构继续成立

## 5. 本轮验证对 `main` 重判的影响

本轮验证最重要的价值，不是直接回答 `main` 要不要，而是进一步缩小了未决范围。

在本轮之后，可以更明确地说：

- 当前 package 在现代安装态消费语境下没有暴露新的兼容性阻塞
- `main` 问题进一步收缩为：
  - 是否存在未来组织内 legacy consumer
  - 是否存在未来组织内旧工具链仍依赖 `main`

也就是说，本轮之后：

- `main` 更接近正式重判窗口

但仍然还没有足够证据直接重判，因为缺的已经不再是 package 自身 metadata 和类型链路，而是：

- 目标消费环境事实
- 组织内发布流程设计事实

## 6. 当前仍未解决的部分

本轮验证并没有解决以下问题：

## 6.1 未解决真实 registry 网络与认证语境

当前仍没有验证：

- registry 认证
- 真实安装源配置
- 真实下载与安装链路

这部分不属于本轮范围。

## 6.2 未解决组织内目标消费环境定义

当前仍没有正式定义：

- 未来由哪些仓库消费
- 它们的 Node / bundler / loader 基线
- 是否存在 legacy consumer

这仍是 `main` 重判前的关键缺口。

## 6.3 未解决组织内发布流程实施前设计

当前也还没有：

- 组织内发布流程草案
- 安装约束草案
- legacy 兼容策略草案

因此，本轮验证虽然拉高了信心，但还不足以单独触发 `main` 正式重判。

## 7. 当前正式结论

当前应把本轮验证结论命名为：

- `安装态 registry usage 最小验证已成立`
- `modern package consumption 继续成立`
- `main 更接近重判窗口，但仍未进入正式重判`

因此，本轮后的最合理下一步不是：

- 直接落 `main`

而是：

- 补组织内目标消费环境前置
- 或补组织内发布流程前置设计

## 8. 下一步建议

当前更自然的下一步有两类：

1. `开始 Harness private registry package 组织内发布流程前置设计`
2. `开始 Harness private registry package main 正式重判`

如果没有新的消费环境事实，建议优先先做：

- 组织内发布流程前置设计

再决定是否正式重开 `main` 判断。
