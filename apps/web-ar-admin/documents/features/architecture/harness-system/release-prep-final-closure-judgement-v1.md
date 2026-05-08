---
title: Harness trial-scope release prep 最终收口判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-readiness-judgement-after-boundary-freeze-v1, release-prep-final-implementation-entry-boundary-v1
---

# Harness trial-scope release prep 最终收口判断 V1

## 1. 目标

本文档用于回答当前这轮 Harness `trial-scope release prep` 的最终问题：

- 当前是否已经可以结束这一轮 `trial-scope release prep`
- 如果可以，当前收口结论是什么
- 如果不可以，最后残留缺口是什么
- 结束之后，下一步应转向哪里

这里的“结束”指的是：

- 当前 frozen trial scope 下的最小 release-prep 收口已经完成

它不等于：

- 真实发布
- 去掉 `private`
- 进入 publish 实施
- 对外宣称 `publish-ready`

## 2. 最终判断结论

当前明确结论是：

- **已经可以结束当前这轮 `trial-scope release prep`**

更准确地说，当前 Harness package 的状态应判断为：

1. `release-boundary-frozen (trial scope)`
2. `release-prep-entered-and-closed (trial scope)`
3. `not publish-ready`

这意味着：

- 当前 trial scope 下该收的边界已经收完
- 当前不需要继续在同一层级补新的 release-prep 小边界
- 后续若继续推进，应该转向新的更高层判断

## 3. 为什么本轮已经可以结束

## 3.1 frozen public API 已完成冻结并持续受测

当前 public API 已同时满足：

- `exports` 已真实落盘
- `dist` 已真实存在
- `README` 已明确使用说明
- release boundary 已正式冻结
- 自动回归已覆盖 exports / public usage / build output / boundary freeze

当前冻结范围仍严格保持为：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

这说明本轮 release prep 不再需要继续回答：

- 对外入口到底是什么

## 3.2 trial 元数据边界已完成冻结并进入白名单约束

当前 frozen trial 元数据边界已经完成收口：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `scripts.build`
- `exports`

并且第一阶段已进一步把它们收成：

- 发布前元数据白名单

这说明本轮不再需要继续细化：

- 哪些 package 字段属于 trial scope

## 3.3 路径、脚本、流程、检查、辅助脚本与最终实施入口都已形成闭环

当前已经连续完成：

1. 路径白名单
2. 脚本与流程边界
3. 一致性检查与辅助脚本边界
4. 最终实施入口判断

这意味着当前 trial-scope release prep 的完整链路已经具备：

- 白名单
- 禁止项
- 允许项
- 触发条件
- 自动回归

因此本轮不再是“边界零散存在”，而是“边界组已经闭环”。

## 3.4 现有自动回归已足以承接本轮收口

当前 `pnpm harness:test` 已覆盖：

- frozen public API
- frozen trial 元数据边界
- 路径白名单
- 脚本与流程边界
- 一致性检查与辅助脚本边界
- 最终实施入口边界

因此结束本轮 release prep，不是建立在纯文档判断上，而是建立在：

- 已落盘
- 已验证
- 有回归兜底

## 4. 为什么这仍不等于 publish-ready

虽然当前可以结束 `trial-scope release prep`，但这仍不意味着 Harness 已经进入可发布状态。

当前仍然明确成立的是：

- `"private": true` 保持不变
- `diagnostics` 仍不进入对外导出层
- `cli` 仍不进入对外导出层
- `internal/*` 与 `shared` 仍不进入对外产物层
- 未新增 `main`
- 未新增 `types`
- 未新增 source map 相关字段
- 未新增发布脚本
- 未开始真实 `publish / pack` 流程

因此当前最准确的理解仍然是：

- trial-scope release prep 已完成
- 但 publish 语义仍未开启

## 5. 当前已完成的收口结论

当前这轮 `trial-scope release prep` 完成后，应冻结以下结论：

### 5.1 当前 package 仍是 private in-repo trial

当前 package 仍应继续被表述为：

- `private`
- `in-repo trial`

不得因为本轮结束而改写为：

- `publish-ready`
- `public package`

### 5.2 当前最小对外面已稳定

当前 frozen public API、dist、files、README、测试口径已经对齐，且仍保持最小集合。

### 5.3 当前 release-prep 已完成的是“边界收口”，不是“发布实施”

当前这轮真正完成的是：

- 发布前边界的收紧与冻结

不是：

- 发布流程的真实执行

## 6. 若本轮不结束，会缺什么

本轮判断为“可以结束”，因此当前并不存在仍必须留在本轮内部继续补的关键缺口。

后续如果继续在本轮内部细化，多半只会变成：

- 同层边界重复表述
- release-prep 结论分散
- 在 trial scope 内过度设计

因此当前更合理的做法不是继续在本轮内扩写，而是结束本轮并转入新的更高层判断。

## 7. 结束后下一步应转向哪里

结束当前 `trial-scope release prep` 之后，下一步更合理的方向应转向：

- 更高层的发布前总判断

也就是明确回答：

- 当前是否要继续保持长期 `private / in-repo trial`
- 是否进入新的 publish-prep 或 release-strategy 判断
- 若未来要从 trial 走向可发布，需要哪些额外前置条件

因此下一步不应再是：

- 继续补新的 trial-scope release-prep 小边界

而应是：

- 开始 Harness 发布前总判断：是否继续停留在 private trial，还是进入更高层发布策略评估

## 8. 最终结论

最终结论如下：

- 当前**已经可以结束这轮 `trial-scope release prep`**
- 当前完成的是：
  - frozen trial scope 下 release-prep 边界的完整收口
- 当前**仍不是 `publish-ready`**
- 当前 package 仍应明确保持：
  - `private`
  - `in-repo trial`
- 下一步若继续，应转向：
  - `开始 Harness 发布前总判断：是否继续停留在 private trial，还是进入更高层发布策略评估`
