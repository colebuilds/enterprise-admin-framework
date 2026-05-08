---
title: Harness private registry package types metadata 最小落盘方案 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: private-registry-package-types-strategy-v1, private-registry-package-types-minimal-implementation-plan-v1, private-registry-package-metadata-implementation-sequencing-v1
---

# Harness private registry package types metadata 最小落盘方案 V1

## 1. 目标

本文档用于把 Harness future package 在：

- `private registry package`

目标层级下的 `types metadata` 继续收成正式的最小落盘方案，明确回答：

- `package.json` 中的 `types` 最小应如何写入
- 它如何映射当前 frozen public API
- 它如何映射当前 `exports / dist / .d.ts`
- 它当前应只表达哪些语义
- 它当前仍不应表达哪些语义
- 它落盘后的最小验证出口是什么

这里讨论的是：

- 目标 metadata 形态
- 未来真实落盘边界

它不等于：

- 当前立刻修改 `packages/harness/package.json`
- 当前立刻把 package 升级为 `registry-ready`
- 当前立刻进入真实 publish 实施

## 2. 当前方案前提

当前真实前提包括：

- 当前 package 仍是 `private / in-repo trial`
- frozen public API 已建立
- 当前 `exports` 仍全部指向：
  - `dist/*.mjs`
- 首轮类型桥接已经真实存在：
  - `dist/index.d.ts`
  - `dist/runtime.d.ts`
  - `dist/phase.d.ts`
  - `dist/plugin.d.ts`
  - `dist/host.d.ts`
  - `dist/host/codex/codex-adapter.d.ts`
- `types` 已被正式判断为：
  - `需要`
- `types` 的最小实现形态已经先于 metadata 落盘而成立

因此本轮要回答的不是：

- 现在要不要补类型文件

而是：

- 当下一步真正把 `types` 写进 `package.json` 时，最小应该怎么写

## 3. 设计原则

`types metadata` 的最小落盘方案当前应遵守以下原则。

## 3.1 先服务 frozen public API，不引入新的类型导出面

`types metadata` 必须严格服务当前 frozen public API：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

它不能成为：

- 新增类型入口
- 提前暴露 internal-only 路径
- 借类型语义扩大 package surface

## 3.2 先提供根类型入口，不先做条件导出矩阵

在 `private registry package` 第一轮 metadata 落盘里，最小目标不是立刻设计完整的条件导出类型矩阵，而是先给 package 根级类型入口一个稳定落点。

因此首轮更合理的最小形态是：

- `types`
  - 指向 package 根级类型入口

而不是一上来就把所有子路径类型映射也编码进 metadata。

## 3.3 `types metadata` 必须服从现有 `exports -> dist` 结构

当前 package 的公开消费结构是：

- `exports -> dist/*.mjs`

因此 `types metadata` 也必须围绕：

- `dist/*.d.ts`

建立，而不能反过来要求：

- 重新设计 `exports`
- 重新设计 `dist`
- 提前补 `main`

## 4. 推荐的最小落盘形态

当前最推荐的第一轮 `types metadata` 最小落盘形态是：

```json
{
  "types": "./dist/index.d.ts"
}
```

这表示：

- package 根入口的默认类型入口为 `dist/index.d.ts`

它与当前 frozen public API 的关系是：

- 根入口 `.` 直接映射到 `dist/index.mjs`
- 根类型入口 `types` 对应映射到 `dist/index.d.ts`

## 5. 为什么当前最小只落根级 `types`

原因有三点。

## 5.1 根级 `types` 已能表达 package 的最小类型存在性

首轮 metadata 最重要的是先让 package 明确具备：

- 根类型入口

而不是立刻完成：

- 所有子路径 metadata 型类型映射

## 5.2 当前 frozen public API 的子路径类型已经有真实产物，不必先靠 metadata 扩语义

当前真实类型产物已经存在：

- `dist/runtime.d.ts`
- `dist/phase.d.ts`
- `dist/plugin.d.ts`
- `dist/host.d.ts`
- `dist/host/codex/codex-adapter.d.ts`

因此第一轮 metadata 只需要先解决：

- package 级类型主入口

不需要在本轮就把所有子路径类型映射一起抬进 metadata 复杂度。

## 5.3 这样可以避免过早把 future public package 的类型分发语义带进来

如果第一轮就引入更复杂的类型分发表达，很容易把当前 `private registry package` 的最小需求，过早抬成：

- future public package
- 更复杂工具链兼容
- 更高等级的稳定性承诺

这不符合当前阶段边界。

## 6. 当前 frozen public API 的映射关系

当前推荐的 metadata 与现有入口关系如下。

## 6.1 根入口

- public API：
  - `.`
- JS 产物：
  - `dist/index.mjs`
- 类型产物：
  - `dist/index.d.ts`
- metadata：
  - `types: "./dist/index.d.ts"`

## 6.2 其他 frozen 子路径

当前仍有真实类型产物，但首轮最小 metadata 方案暂不单独为它们新增 metadata 字段：

- `./runtime -> dist/runtime.mjs -> dist/runtime.d.ts`
- `./phase -> dist/phase.mjs -> dist/phase.d.ts`
- `./plugin -> dist/plugin.mjs -> dist/plugin.d.ts`
- `./host -> dist/host.mjs -> dist/host.d.ts`
- `./host/codex -> dist/host/codex/codex-adapter.mjs -> dist/host/codex/codex-adapter.d.ts`

也就是说，第一轮 metadata 只确认：

- 存在 package 级根类型入口

而不在本轮继续扩大 metadata 复杂度。

## 7. 当前应只表达的语义

第一轮 `types metadata` 当前只应表达以下语义：

- package 已具备根级类型入口
- 类型入口与当前 frozen public API 根入口一致
- 类型产物已经进入真实 build 产物链
- `private registry package` 的 metadata 已开始承接类型消费语义

## 8. 当前仍不应表达的语义

当前第一轮 `types metadata` 仍不应表达以下语义：

- 所有子路径的 metadata 分发规则都已最终确定
- 当前 package 已达到完整 `registry-ready`
- 当前 package 已达到 `publish-ready`
- internal-only 路径可以被类型消费
- 当前已经需要 `main` 或 source map 联动

## 9. 当前仍不得进入类型 metadata 承诺面的路径

以下路径当前仍不得被带进类型 metadata 语义：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

原因不变：

- 它们不属于 frozen public API
- 它们仍是 internal-only
- 当前不应因类型元数据而扩大 package 边界

## 10. 最小验证出口

后续如果真的进入 `types metadata` 真实落盘，最小验证出口至少包括：

## 10.1 metadata 存在性

- `package.json` 中存在：
  - `types`
- 且值为：
  - `./dist/index.d.ts`

## 10.2 frozen public API 不漂移

- `exports` 不扩大
- `files` 不扩大
- `dist` 公开路径不扩大

## 10.3 类型入口不漂移

- `dist/index.d.ts` 存在
- 其他 frozen public API 对应 `.d.ts` 仍存在
- `.d.ts` 集合继续只承接当前 frozen public API

## 10.4 回归不回退

- `pnpm harness:test` 持续通过
- 现有 package boundary / release-prep / types-output 测试不回退

## 10.5 README 与架构文档一致

- `packages/harness/README.md` 若描述了 `types`，其口径必须与真实 metadata 一致
- `harness-system/README.md` 应继续挂载对应设计或落盘文档

## 11. 当前结论

当前最合理的第一轮 `types metadata` 最小落盘方案是：

- 在 `package.json` 中只新增：
  - `"types": "./dist/index.d.ts"`

并保持：

- frozen public API 不变
- frozen `exports / files / dist` 不变
- `private / in-repo trial` 不变
- internal-only 路径仍不进入类型 metadata 承诺面

这一步完成后，才更适合进入下一步：

- `types metadata` 真实最小落盘第一步
