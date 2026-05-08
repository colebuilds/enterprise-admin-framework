---
title: Harness private registry package types 最小实现方案 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-types-strategy-v1, private-registry-package-metadata-implementation-sequencing-v1, private-registry-package-metadata-strategy-v1
---

# Harness private registry package types 最小实现方案 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `types` 从策略定义继续推进到：

- 最小实现方案

明确回答：

- 类型产物未来最小应如何提供
- 哪些入口必须被类型覆盖
- 类型产物与 `exports / dist / metadata` 应如何对应
- 哪些路径仍不得进入类型承诺面
- 后续真实实现前最小验证出口是什么

这里讨论的是：

- 目标实现方案
- 未来落盘边界

它不等于：

- 当前立刻生成 `.d.ts`
- 当前立刻修改 `package.json`
- 当前立刻进入真实 publish 实施

## 2. 当前方案前提

当前真实前提包括：

- 当前 package 仍是 `private / in-repo trial`
- frozen public API 已建立
- frozen trial metadata 边界已建立
- 最小 `build / dist / files / exports` 已建立
- `types` 已被正式判断为：
  - `需要`
- `types` 已被纳入 `registry-ready metadata` 第一阶段主线
- `publishConfig` 已先于 `types` 进入 metadata 实施线

因此本轮要回答的不是：

- 现在要不要立刻补类型文件

而是：

- 当下一步真的进入类型实现时，最小可行方案应长什么样

## 3. 设计原则

`types` 的最小实现方案当前应遵守以下原则。

## 3.1 先服务 frozen public API，不发明额外类型面

首轮类型实现必须严格围绕当前 frozen exports：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

进行，不应顺手带出：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

## 3.2 先提供最小桥接声明层，不先追求完整类型体系

当前最合理的首轮实现目标不是：

- 一次性把所有对象模型做成高完备度类型系统

而是：

- 先给 frozen public API 提供最小可消费的声明桥接层

也就是说，第一版 types 应优先满足：

- 入口存在
- 基本可导入
- 基本可理解

而不是：

- 完整的内部实现细节暴露

## 3.3 类型产物应跟随 dist，而不是跟随 src 漫长扩张

当前 package 对外消费面已经是：

- `exports -> dist`

因此类型产物也应尽量围绕：

- `dist`

建立对应关系，而不是回头为整个 `src/` 建一套开放类型面。

## 4. 推荐的最小实现形态

当前最推荐的首轮实现形态是：

- 为 frozen public API 的每个导出入口提供对应的 `.d.ts`
- 以最小桥接声明层的方式与当前 `dist/*.mjs` 对齐

这意味着首轮实现更接近：

- 明确入口声明

而不是：

- 全量自动暴露内部类型树

## 4.1 第一轮类型产物的最小文件形态

第一轮最小可行形态可收成：

- `dist/index.d.ts`
- `dist/runtime.d.ts`
- `dist/phase.d.ts`
- `dist/plugin.d.ts`
- `dist/host.d.ts`
- `dist/host/codex/codex-adapter.d.ts`

这组文件应与当前真实产物：

- `dist/index.mjs`
- `dist/runtime.mjs`
- `dist/phase.mjs`
- `dist/plugin.mjs`
- `dist/host.mjs`
- `dist/host/codex/codex-adapter.mjs`

形成一一对应关系。

## 4.2 为什么当前不建议从 internal 类型树直接开放

原因是当前 package 的对外边界已经被明确限制在 frozen public API。

如果首轮 types 直接从 internal 层大面积暴露：

- 会扩大可见 surface
- 会把 trial 中仍刻意 internal-only 的结构提前固化
- 会让 `private registry package` 过早继承 public-package 级别的稳定性负担

所以第一轮更合理的做法是：

- 只对入口做桥接
- 只暴露入口真正需要的类型对象

## 5. 最小覆盖入口与映射关系

首轮 types 最小必须覆盖以下入口。

## 5.1 根入口

- package 入口：
  - `.`
- 产物入口：
  - `dist/index.mjs`
- 类型入口：
  - `dist/index.d.ts`

## 5.2 runtime 入口

- package 入口：
  - `./runtime`
- 产物入口：
  - `dist/runtime.mjs`
- 类型入口：
  - `dist/runtime.d.ts`

## 5.3 phase 入口

- package 入口：
  - `./phase`
- 产物入口：
  - `dist/phase.mjs`
- 类型入口：
  - `dist/phase.d.ts`

## 5.4 plugin 入口

- package 入口：
  - `./plugin`
- 产物入口：
  - `dist/plugin.mjs`
- 类型入口：
  - `dist/plugin.d.ts`

## 5.5 host 入口

- package 入口：
  - `./host`
- 产物入口：
  - `dist/host.mjs`
- 类型入口：
  - `dist/host.d.ts`

## 5.6 host/codex 入口

- package 入口：
  - `./host/codex`
- 产物入口：
  - `dist/host/codex/codex-adapter.mjs`
- 类型入口：
  - `dist/host/codex/codex-adapter.d.ts`

## 6. 与 metadata 的对应关系

第一轮 `types` 实现不应直接跳成“大而全”的 metadata 设计，而应先形成以下稳定关系：

- frozen exports 保持不变
- 类型文件与 `dist` 一一对应
- 后续再决定 `package.json` 里的 `types` 如何最小落盘

这意味着本轮最重要的是先把：

- 类型产物映射

设计清楚，而不是先急着把：

- `types`

字段落盘。

## 6.1 为什么先做实现方案，再做 metadata 落盘

因为 `types` 和 `publishConfig` 不同。

`publishConfig` 更偏：

- 元数据语义

而 `types` 更偏：

- 真实产物能力

如果没有明确的产物方案，就先落 metadata，很容易形成：

- 空承诺

因此更合理的顺序是：

1. 先设计最小实现方案
2. 再决定 metadata 如何最小承接它

## 7. 当前仍不得进入类型承诺面的路径

即使未来开始补最小类型产物，以下路径当前仍不得进入类型承诺面：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

原因不是这些路径永远不能有类型，而是：

- 它们当前不属于 frozen public API
- 它们当前不属于 registry-ready metadata 主线

## 8. 最小验证出口

未来若真正进入 `types` 实现阶段，至少应有以下验证出口。

## 8.1 类型入口存在性验证

至少应验证：

- 每个 frozen public API 入口都存在对应 `.d.ts`
- 不存在缺口入口

## 8.2 映射一致性验证

至少应验证：

- `exports` 的每个公开入口都能对应到：
  - `.mjs` 产物
  - `.d.ts` 产物

## 8.3 边界不扩张验证

至少应验证：

- 类型产物没有把 internal-only 路径带入 package surface
- `exports / files / dist` 没有因类型实现而被扩大

## 8.4 类型消费验证

至少应验证：

- 组织内最小消费样例能稳定解析这些入口的类型

这一步不要求一开始就上完整矩阵，但至少要有：

- 最小类型消费 smoke

## 8.5 统一回归验证

至少应验证：

- `pnpm harness:test`
  - 持续通过

若后续新增独立类型测试，则也应纳入统一回归入口。

## 9. 当前结论

当前应稳定采用以下口径：

- `types` 的第一轮实现应优先采用：
  - frozen public API 对应的最小桥接声明层
- 它至少应覆盖：
  - `.`
  - `./runtime`
  - `./phase`
  - `./plugin`
  - `./host`
  - `./host/codex`
- 它应首先建立：
  - `dist/*.mjs -> dist/*.d.ts` 的一一对应关系
- 它当前仍不应：
  - 把 internal-only 路径带入类型承诺面
  - 直接升级成 public package 等级的完整类型体系

## 10. 下一步建议

在这份最小实现方案之后，最自然的下一步是：

- 开始 Harness `private registry package` `types` 真实最小实现第一步

或者：

- 先开始 Harness `private registry package` `types` metadata 最小落盘方案设计

如果继续严格按当前主线推进，更自然的是：

- 先进入 `types` 的真实最小实现第一步
