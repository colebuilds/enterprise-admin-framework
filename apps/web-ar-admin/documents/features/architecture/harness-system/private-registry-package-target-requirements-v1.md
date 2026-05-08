---
title: Harness private registry package 目标条件 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-strategy-target-tier-evaluation-v1, private-trial-vs-release-strategy-judgement-v1
---

# Harness private registry package 目标条件 V1

## 1. 目标

本文档用于把 Harness future package 的目标发布层级：

- `private registry package`

继续收成一组正式准入条件，明确回答：

- 到达该层需要哪些元数据
- 需要什么级别的 API 稳定性
- 需要哪些发布前条件
- 当前已具备哪些
- 当前仍缺失哪些

这里讨论的是：

- 目标层级条件
- 与当前 trial state 的差距

它不等于：

- 立即进入真实发布
- 立即去掉 `private`
- 立即开始组织内 registry 分发

## 2. 当前判断前提

当前已经成立的现实前提包括：

- `packages/harness/` 已是可消费的 in-repo trial package
- frozen public API 已真实落盘
- frozen trial 元数据边界已真实落盘
- 最小 build / dist 已真实落盘
- `trial-scope release prep` 已完整收口
- `pnpm harness:test` 已覆盖当前 trial scope 的主要边界

当前仍明确成立的现实限制包括：

- package 仍为 `"private": true`
- 当前仍不是 `publish-ready`
- 当前仍未形成发布级元数据策略
- 当前 frozen public API 仍只是 trial-scope 承诺

## 3. private registry package 的目标元数据边界

若目标层级是：

- `private registry package`

则目标元数据边界至少应具备以下能力。

## 3.1 必须明确存在的元数据

至少应明确并稳定以下字段：

- `name`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `exports`
- `scripts.build`

这是从当前 frozen trial 元数据边界延续过来的最小核心集合。

## 3.2 需要从 trial 升级为 registry-ready 的元数据

与当前 trial 相比，至少还需要正式决定：

- `publishConfig`
- 是否提供 `main`
- 是否提供 `types`
- 是否提供 source map 相关字段
- 版本发布策略如何定义

这里的关键不是“现在立刻加字段”，而是：

- 到达该层前，这些字段必须有清楚结论

## 3.3 当前仍不属于该层强制项的内容

当前不应把以下内容误当成 `private registry package` 必须立即完成的硬项：

- `diagnostics` 对外导出
- `cli` 对外导出
- `tests` 对外导出
- `internal/*` 对外暴露
- `shared` 对外暴露

这些仍应继续保持为：

- internal-only 边界

## 4. private registry package 所需的 API 稳定性要求

到达该层，并不要求外部 public package 那种最高等级承诺，但至少要高于当前 trial-scope 冻结。

## 4.1 最低稳定性要求

至少需要把当前 frozen public API 明确提升为：

- 组织内可消费的稳定入口集合

也就是：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

不能再只是：

- trial-scope 下暂时冻结

## 4.2 breaking change 约束

至少需要明确：

- 未来 breaking change 是否允许自由发生
- 若允许，需要什么升级节奏
- 若不允许，需要什么版本与迁移说明约束

换句话说，必须有最低级别的：

- compatibility 口径

## 4.3 deprecation / compatibility 口径

不一定要立刻建立完整 deprecation 机制，但至少要明确：

- 若某个入口未来调整，是否需要过渡窗口
- 是否需要在 README / 变更记录中给出迁移说明

## 5. private registry package 所需的发布前条件

要进入该层，除了元数据和 API 稳定性，还至少需要以下发布前条件。

## 5.1 build 与产物条件

至少应满足：

- build 可稳定执行
- `dist` 结构稳定
- `exports -> dist -> files` 映射稳定
- 产物层不引入 internal-only 路径

## 5.2 测试条件

至少应满足：

- 当前 trial scope 回归持续稳定
- package public usage 验证持续稳定
- build 后消费验证更强一层
- 若补 `types`，则补类型消费验证
- 若补 source map，则补产物一致性验证

## 5.3 流程条件

至少应正式回答：

- 是否需要 `pack`
- 是否需要 `prepublishOnly`
- 是否需要组织内发布脚本
- 哪些动作仍需人工门控

这一步仍然不等于脚本已经全部实现，但至少要形成正式流程设计。

## 6. 当前已具备哪些

基于当前真实实现，已具备的条件包括：

### 6.1 基础 package 边界已成立

- 最小 `exports` 已真实落盘
- 最小 `build` 已真实落盘
- 第一轮 `dist` 已真实落盘
- frozen public API 已建立
- frozen trial 元数据边界已建立

### 6.2 现有 package 对外面已稳定到 trial 级别

- `exports / dist / files / README / tests` 当前已对齐
- `trial-scope release prep` 已完整收口
- internal-only 边界仍保持封闭

### 6.3 当前自动回归已足以支撑下一层设计判断

- `pnpm harness:test` 能稳定覆盖当前 trial 边界
- package usage / build output / release boundary / release-prep 边界都有回归

## 7. 当前仍缺失哪些

若要真正到达 `private registry package`，当前仍缺失的重点包括：

## 7.1 发布级元数据策略仍未形成

当前仍未正式确定：

- `publishConfig`
- `main`
- `types`
- source map 策略
- registry 目标与版本策略

## 7.2 API 仍未升级为组织内稳定承诺

当前 API 只是：

- trial-scope frozen

还不是：

- 组织内稳定可依赖 API

## 7.3 发布级自动回归仍未补齐

当前回归足以支撑 trial，但还不足以直接支撑 registry 级分发，需要继续补：

- 更强的 build 后消费验证
- 元数据 / 产物 / 入口联动验证
- 若未来补类型，则补类型消费验证

## 7.4 组织内发布流程仍未设计或实现

当前仍未正式定义：

- pack / publish 的最小动作
- 组织内发布脚本是否存在
- 发布前人工门控点

## 8. 当前最合理的下一步

既然目标层级已经锁定为：

- `private registry package`

那么下一步最合理的工作不应是直接改实现，而应优先进入：

1. 发布级元数据策略设计
2. API 稳定性策略设计
3. 发布级自动回归扩容设计
4. 组织内发布流程设计

## 9. 最终结论

最终结论如下：

- `private registry package` 的目标条件已经可以拆成三组：
  - 元数据边界
  - API 稳定性要求
  - 发布前条件
- 当前已具备：
  - trial package 的核心边界、最小 build / dist、frozen API、frozen trial 元数据、较完整回归
- 当前仍缺失：
  - 发布级元数据策略
  - 组织内稳定 API 承诺
  - 发布级自动回归扩容
  - 组织内发布流程设计
- 因此下一步若继续，应进入：
  - `开始 Harness private registry package 元数据策略设计`
