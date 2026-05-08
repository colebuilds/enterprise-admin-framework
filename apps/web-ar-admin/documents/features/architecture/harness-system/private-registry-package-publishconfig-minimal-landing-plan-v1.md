---
title: Harness private registry package publishConfig 最小落盘方案 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-publishconfig-strategy-v1, private-registry-package-metadata-implementation-sequencing-v1, private-registry-package-metadata-strategy-v1
---

# Harness private registry package publishConfig 最小落盘方案 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `publishConfig` 从策略定义继续推进到：

- 最小落盘方案

明确回答：

- 未来真正写入 `package.json` 时，`publishConfig` 最少应长什么样
- 它当前应只表达哪些语义
- 它当前仍不应表达哪些语义
- 它落盘后的最小验证出口是什么

这里讨论的是：

- 目标落盘方案
- 未来实施边界

它不等于：

- 当前立刻修改 `packages/harness/package.json`
- 当前立刻进入真实 publish 实施

## 2. 当前方案前提

当前真实前提包括：

- 当前 package 仍是 `private / in-repo trial`
- frozen public API 已建立
- frozen trial metadata 边界已建立
- 最小 `build / dist / files / exports` 已建立
- `publishConfig` 已被正式判断为：
  - `需要`
- `publishConfig` 已被纳入 `registry-ready metadata` 第一优先级实施线

因此本轮要回答的不是：

- 现在要不要立刻落盘

而是：

- 当下一步真的进入最小 metadata 实施时，`publishConfig` 最小应该写成什么

## 3. 设计原则

`publishConfig` 的最小落盘方案当前应遵守以下原则。

## 3.1 先约束分发域，不先承诺发布流程

首轮落盘应优先表达：

- 目标分发域

而不是：

- 完整发布流程
- 完整发布脚本语义

也就是说，`publishConfig` 第一版应该先承担：

- 组织内私有 registry 语义收口

而不是：

- 发布自动化入口

## 3.2 先保持 frozen trial boundary 不变

即使未来要落 `publishConfig`，也必须继续保持：

- frozen public API 不变
- frozen trial metadata 核心集合不漂移
- `exports / dist / files` 不扩张

因此 `publishConfig` 的引入只能是：

- 补充 registry-ready metadata 语义

不能变成：

- 扩大 package surface 的借口

## 3.3 先做最小可验证形态

首轮落盘不应追求“把所有可能字段一次写满”，而应先形成：

- 最小可验证结构

只要它已经能够明确：

- 私有 registry 分发目标
- 当前 package 不应被误读为 public publish 目标

就足够支撑第一步实施。

## 4. 最小字段形态

当前推荐的 `publishConfig` 最小落盘形态应收成：

```json
{
  "publishConfig": {
    "registry": "<private-registry-url>"
  }
}
```

这里的关键不是当前立刻填入具体值，而是把最小结构先定义清楚：

- 顶层使用 `publishConfig`
- 首轮只要求一个明确的 `registry`

## 4.1 为什么当前只建议 `registry`

原因是当前第一步目标只是：

- 约束目标分发域

而不是：

- 建立完整发布流程
- 解决所有发布实现细节

如果在首轮就把更多字段塞进去，容易导致：

- 语义过宽
- 和 future public package 的配置语义混写
- 当前文档与后续实施边界再次失焦

## 4.2 当前不建议把更多字段并入最小方案

在当前阶段，以下内容都不建议作为 `publishConfig` 首轮最小落盘的一部分：

- 任何暗示公开发布目标的配置
- 任何把 package 从 `private` 推向可发布状态的配置
- 任何依赖未来发布脚本才能成立的配置

这意味着首轮最小方案的核心是：

- `registry`

而不是更复杂的发布参数组合。

## 5. `publishConfig` 当前应只表达哪些语义

当前 `publishConfig` 首轮落盘后，应只表达以下语义。

## 5.1 表达目标分发域属于组织内私有 registry

这应是首轮最核心、也是最明确的语义。

## 5.2 表达 package 已进入 registry-ready metadata 的第一步

也就是：

- package 已不再只是纯仓库内 trial metadata
- 但仍未进入真实发布实施

## 5.3 表达当前 package 仍处于受控边界内

即使 `publishConfig` 出现，也仍应继续保持：

- frozen public API 不变
- `private` 不变
- `diagnostics / cli / tests / internal/* / shared` 不进入 surface

## 6. `publishConfig` 当前仍不应表达哪些语义

## 6.1 不应表达真实发布已开启

`publishConfig` 的出现不等于：

- 现在就允许 `publish`
- 现在就允许 `pack`
- 现在就允许新增发布脚本

## 6.2 不应表达 package 已不再 private

首轮落盘后，也不应被理解为：

- 当前应该去掉 `"private": true`

## 6.3 不应表达 public package 语义

首轮 `publishConfig` 也不应承担：

- public registry 分发语义
- 外部用户发布语义
- public package metadata 完整化语义

## 7. 与当前 frozen trial metadata 的兼容边界

未来若落盘 `publishConfig`，其兼容边界应是：

- 只新增 `publishConfig`
- 不改当前 frozen public API
- 不改当前 frozen `exports`
- 不改当前 `files`
- 不改当前 `dist` 入口面
- 不改当前 `scripts.build`

也就是说，这一步的本质是：

- metadata 增量补强

而不是：

- metadata 重构

## 8. 最小验证出口

未来若真正进入 `publishConfig` 落盘实施，至少应有以下验证出口。

## 8.1 metadata 边界验证

至少要验证：

- `publishConfig` 的引入没有扩大 public surface
- `exports / files / dist` 仍与 frozen trial scope 一致
- `private` 仍保持不变

## 8.2 回归验证

至少要验证：

- `pnpm harness:test`
  - 持续通过

## 8.3 文档一致性验证

至少要验证：

- `packages/harness/README.md`
- `harness-system` 架构文档
- package 当前阶段说明

与新增 `publishConfig` 的语义口径一致。

## 8.4 语义边界验证

至少要验证：

- 当前 package 没有被误描述为 `publish-ready`
- 当前没有新增真实发布脚本
- 当前没有进入真实 publish 流程

## 9. 当前结论

当前应稳定采用以下口径：

- `publishConfig` 的最小落盘形态应先收成：
  - `publishConfig.registry`
- 它首轮只应表达：
  - 组织内私有 registry 分发域
- 它当前仍不应表达：
  - public package 语义
  - 真实发布实施语义
  - 去 private 语义

## 10. 下一步建议

在这份最小落盘方案之后，最自然的下一步是：

- 开始 Harness `private registry package` `publishConfig` 真实落盘第一步

或者：

- 先开始 Harness `private registry package` `types` 最小实现方案设计

如果要继续严格按已收口顺序推进，当前更自然的是：

- 先进入 `publishConfig` 的真实最小落盘
