---
title: Harness private registry package registry-ready metadata 实施顺序 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-metadata-strategy-v1, private-registry-package-conditional-metadata-judgement-v1, private-registry-package-publishconfig-strategy-v1, private-registry-package-types-strategy-v1, private-registry-package-main-compatibility-judgement-v1
---

# Harness private registry package registry-ready metadata 实施顺序 V1

## 1. 目标

本文档用于把 Harness 从当前：

- frozen trial metadata

继续推进到：

- `private registry package` 所需的 `registry-ready metadata`

时，最合理的实施顺序正式收清，明确回答：

- 哪些项应先做
- 哪些项应后做
- 哪些项当前仍应暂缓
- 每一步进入前需要满足什么条件
- 每一步完成后应如何验证

这里讨论的是：

- 实施顺序设计
- 决策与实现的前后关系

它不等于：

- 当前立刻修改 `packages/harness/package.json`
- 当前立刻去掉 `private`
- 当前立刻进入真实 publish 实施

## 2. 当前顺序设计前提

当前已经形成的稳定前提包括：

- frozen public API 已建立
- frozen trial metadata 边界已建立
- 最小 `build / dist / exports / files` 已建立
- `trial-scope release prep` 已完整收口
- future 目标发布层级已建议锁定为：
  - `private registry package`

当前关键字段的状态也已经拆清：

- `publishConfig`
  - `需要`
- `types`
  - `需要`
- `main`
  - `延后判断`
- source map
  - `暂不需要`

因此本轮的重点不再是：

- 再判断单个字段

而是：

- 把这些结论收成一条可执行的 metadata 推进顺序

## 3. 顺序设计原则

从 frozen trial metadata 走到 registry-ready metadata，当前应遵守以下顺序原则。

## 3.1 先完成确定性高的策略项，再进入实现

已经被正式判断为：

- `需要`

的字段，应优先进入实现顺序设计。

仍处于：

- `延后判断`

或：

- `暂不需要`

的字段，不应在首轮实现里硬塞进去。

## 3.2 先做“不会扩大 public surface”的 metadata 项

首轮推进应优先选择：

- 不扩大 exports
- 不改变 frozen public API
- 不打开 internal-only 边界

的项。

这意味着 metadata 升级必须继续服从当前已冻结的：

- public API
- path whitelist
- release boundary

## 3.3 先做可验证的项，再做兼容性补项

对 registry-ready metadata 来说，优先级应是：

1. 先做可以通过当前结构直接验证的项
2. 再做需要额外消费环境事实才能判断的兼容性项

这也是为什么：

- `main`

不应被塞进首轮实施。

## 4. 推荐实施顺序

## 4.1 第一步：收 `publishConfig` 的最小落盘方案

第一步最合理先做：

- `publishConfig`

原因：

- 它已经被明确判断为 `需要`
- 它不要求扩大 frozen public API
- 它主要约束的是分发语义，而不是消费入口
- 它可以作为 registry-ready metadata 的第一锚点

### 第一步进入前提

- 当前 package 仍保持 `private / in-repo trial`
- `publishConfig` 策略文档已完成
- release boundary 与 trial metadata 冻结状态保持不变

### 第一步验证出口

- `package.json` 中的 `publishConfig` 语义不扩大 public surface
- `exports / files / dist` 不发生漂移
- `pnpm harness:test` 持续通过
- README / 架构文档与 metadata 口径一致

## 4.2 第二步：收 `types` 的最小实现方案与落盘顺序

第二步最合理进入：

- `types`

但这里应分两小步理解：

1. 先定义类型最小实现方案
2. 再决定 `types` 字段如何进入 metadata

原因：

- `types` 已被明确判断为 `需要`
- 但它不是纯 metadata 字段问题，而是会牵涉类型产物与入口覆盖
- 如果没有实现方案，直接落 metadata 只会形成空承诺

### 第二步进入前提

- `types` 策略文档已完成
- 当前 frozen public API 的覆盖面不变
- 已明确 `types` 只服务：
  - `.`
  - `./runtime`
  - `./phase`
  - `./plugin`
  - `./host`
  - `./host/codex`

### 第二步验证出口

- 类型方案不把 internal-only 路径带入类型承诺面
- 类型入口与 frozen exports 一一对应
- 若进入实现，补最小类型消费验证
- `pnpm harness:test` 持续通过

## 4.3 第三步：进入 metadata 联动核对

在 `publishConfig` 和 `types` 都进入实施线后，第三步应做：

- metadata 联动核对

这里的重点不是再加新字段，而是确认以下关系是否成立：

- `publishConfig` 与目标分发域一致
- `types` 与 frozen exports 对齐
- `exports / dist / files / README` 继续一致

### 第三步进入前提

- `publishConfig` 已完成最小落盘或最小实现确认
- `types` 已完成最小实现方案，或已进入明确落盘方案

### 第三步验证出口

- metadata 字段之间没有互相打架
- frozen public API 仍未扩大
- registry-ready metadata 没有引入多余字段

## 4.4 第四步：重新判断 `main`

`main` 不应进入首轮实施，而应在上述几步之后再重开判断。

原因：

- 它依赖组织内目标消费环境事实
- 它属于兼容性补项，而不是 registry-ready metadata 的第一锚点
- 在 `publishConfig` 和 `types` 未进入稳定实施前，讨论 `main` 很容易失焦

### 第四步进入前提

- `publishConfig` 与 `types` 已进入稳定实施顺序
- 目标消费环境已明确
- 组织内发布流程与消费验证设计开始接近实施

### 第四步验证出口

- 若结论为“不需要 `main`”，需证明目标消费环境稳定支持 `exports`
- 若结论为“需要 `main`”，需证明存在真实兼容性约束
- 无论哪种结论，都不得扩大 frozen public API

## 4.5 第五步：继续保持 source map 暂缓

source map 当前仍应保持：

- `暂不需要`

因此它不应进入首轮 registry-ready metadata 实施顺序。

它更适合作为：

- 后续增强项

而不是当前主线项。

### 第五步进入前提

- registry-ready metadata 主线已经稳定
- 组织内消费方明确提出调试产物需求

### 第五步验证出口

- source map 的引入确实提升组织内消费调试价值
- 它不会反向打乱 `files / dist / metadata` 的最小边界

## 5. 推荐顺序汇总

当前最合理的顺序应稳定写成：

1. 先落 `publishConfig` 最小方案
2. 再落 `types` 最小实现方案与 metadata 顺序
3. 再做 registry-ready metadata 联动核对
4. 最后根据消费环境重开 `main` 判断
5. source map 继续暂缓

这个顺序背后的核心逻辑是：

- 先处理确定项
- 再处理实现项
- 最后处理兼容性补项

## 6. 当前哪些项应明确暂缓

当前应明确暂缓的，不只是 source map，还包括：

- 去掉 `private`
- 引入真实发布脚本
- 进入真实 `pack / publish`
- 扩大 frozen public API
- 把 `diagnostics / cli / internal/* / shared` 卷入 metadata surface

这些都不属于本轮 `registry-ready metadata` 顺序设计的主线。

## 7. 每一步的最小门控方式

为了避免顺序设计再次漂移，后续每一步都应至少经过以下门控。

## 7.1 文档门控

进入某一步之前，应先有对应策略或判断文档，避免边实现边决定。

## 7.2 元数据门控

任何字段落盘前，都必须确认：

- 不扩大 exports
- 不打破 files whitelist
- 不引入 internal-only 漂移

## 7.3 回归门控

每一步后都应继续保持：

- `pnpm harness:test`
  - 持续通过

若新增类型相关实现，则还应补：

- 类型消费验证

## 8. 当前结论

当前应稳定采用以下口径：

- `registry-ready metadata` 的第一步不是 `main`
- 第一优先级应是：
  - `publishConfig`
  - `types`
- `main` 应保留在兼容性补项阶段重新判断
- source map 当前继续暂缓

## 9. 下一步建议

在这份实施顺序文档之后，最自然的下一步是：

- 开始 Harness `private registry package` `types` 最小实现方案设计

或者：

- 开始 Harness `private registry package` `publishConfig` 最小落盘方案设计

因为这两项已经被正式收成：

- registry-ready metadata 的第一阶段主线
