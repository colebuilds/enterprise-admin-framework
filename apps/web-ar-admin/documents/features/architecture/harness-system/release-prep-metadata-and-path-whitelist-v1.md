---
title: Harness release prep 元数据与路径白名单 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-readiness-judgement-after-boundary-freeze-v1, release-boundary-freeze-implementation-v1, release-boundary-final-confirmation-v1
---

# Harness release prep 元数据与路径白名单 V1

## 1. 目标

本文档用于承接 Harness 最小 release prep 第一阶段，把当前 frozen trial scope 下的：

- 发布前元数据边界
- 路径白名单边界

正式收成一组可执行、可验证的白名单约束。

本轮不做：

- 扩 exports
- 去掉 `private`
- 增加发布脚本
- 进入真实发布

## 2. 当前白名单结论

当前 release prep 第一阶段确认的元数据白名单为：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `scripts.build`
- `exports`

当前 release prep 第一阶段确认的路径白名单为：

### 2.1 exports 白名单

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

### 2.2 dist 白名单

- `dist/index.mjs`
- `dist/runtime.mjs`
- `dist/phase.mjs`
- `dist/plugin.mjs`
- `dist/host.mjs`
- `dist/host/codex/codex-adapter.mjs`

### 2.3 files 白名单

- `dist`
- `README.md`
- `package.json`

## 3. 当前明确排除的路径

当前 release prep 第一阶段明确继续排除：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

这些排除项同时适用于：

- public exports
- dist 产物层
- package `files` 白名单语境

## 4. 当前元数据边界解释

### 4.1 当前允许继续确认的字段

当前进入 release prep 的范围，只允许围绕以下字段继续判断和收紧：

- `private`
- `version`
- `files`
- `scripts.build`
- `exports`

以及与它们直接相关的：

- `name`
- `description`
- `type`
- `sideEffects`

### 4.2 当前明确不进入本轮的字段

当前仍明确不进入本轮 release prep 第一阶段：

- `main`
- `types`
- source map 相关字段
- 发布脚本字段
- 去私有化相关字段

原因不是这些字段永远不需要，而是它们不属于当前 frozen trial scope 下的最小 release-prep 白名单。

## 5. 白名单如何被约束

当前白名单不是只存在于文档里，而是由三层共同约束：

### 5.1 package 元数据层

[package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json) 当前继续保持最小白名单形态。

### 5.2 README 使用说明层

[README.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/README.md) 当前明确说明：

- 哪些是已冻结 public API
- 哪些是 trial 元数据边界
- 哪些路径当前仍不进入 build / dist / exports

### 5.3 自动回归层

当前自动回归继续覆盖：

- exports 集合
- dist 产物集合
- package public usage
- trial 元数据冻结
- release-prep 路径白名单

因此后续若有人修改：

- `files`
- `exports`
- `dist` 产物集合
- internal-only 路径进入产物层

将直接体现在回归失败中。

## 6. 当前状态判断

本轮之后，Harness package 更准确的状态应判断为：

1. `release-boundary-frozen (trial scope)`
2. `release-prep-enterable (trial scope)`
3. `release-prep-metadata-whitelisted`
4. `release-prep-path-whitelisted`
5. `not publish-ready`

## 7. 最终结论

最终结论如下：

- 当前发布前元数据边界已正式收口
- 当前 package 路径白名单已正式收口
- 当前 `exports / files / dist / README / tests` 已围绕同一组最小 trial scope 白名单对齐
- 当前 package 仍明确保持：
  - `private`
  - `in-repo trial`
- 下一步若继续，应进入：
  - `开始 Harness release prep 第二阶段：收口发布前脚本与流程边界`
