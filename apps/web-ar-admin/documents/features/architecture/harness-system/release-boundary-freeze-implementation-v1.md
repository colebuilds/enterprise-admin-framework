---
title: Harness release boundary 冻结实施 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-boundary-final-confirmation-v1, package-export-landing-readiness-judgement-v1, release-prep-readiness-judgement-after-build-v1
---

# Harness release boundary 冻结实施 V1

## 1. 目标

本文档用于把上一轮已经确认的 release boundary，继续落到可执行的冻结约束层。

本轮不做：

- 新增导出入口
- 扩大 current public surface
- 进入 `release prep` 实施

本轮只做两件事：

1. 冻结当前最小 public API
2. 冻结当前 trial 元数据边界

## 2. 当前冻结结论

当前已经冻结的 public API 仅包括：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

当前已经冻结的 trial 元数据边界包括：

- `name`
- `private`
- `version`
- `type`
- `description`
- `sideEffects`
- `files`
- `scripts.build`
- `exports`

## 3. 冻结方式

本轮冻结不是通过扩大配置实现，而是通过以下三层同时收口：

### 3.1 package 元数据层

当前 [package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json) 继续保持：

- `"private": true`
- `"version": "0.0.0-trial"`
- 最小 `files`
- 最小 `exports`
- 单一 `build` 脚本

### 3.2 使用说明层

当前 [README.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/README.md) 已明确把这组导出面和元数据边界表达为：

- 当前已冻结的 trial scope 边界
- 当前明确不导出的 internal-only 范围

### 3.3 自动回归层

当前自动回归继续覆盖：

- exports 集合
- dist 产物集合
- package public usage
- trial 元数据冻结断言

因此后续若有人调整：

- `exports`
- `files`
- `version`
- `private`
- `scripts.build`

将不再是隐式漂移，而会直接进入测试失败面。

## 4. 当前明确不纳入冻结范围的内容

当前仍明确不纳入本轮冻结的包括：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`
- 发布脚本
- `main`
- `types`
- source map 相关字段
- 从 `private` 切换为可发布状态

这些内容后续若要进入边界，应属于：

- `release prep`
- 或更后续的发布前实施

而不是当前 trial boundary 冻结范围。

## 5. 当前状态判断

本轮之后，Harness package 更准确的状态应判断为：

1. `exports-ready`
2. `build-ready (trial scope)`
3. `dist-ready (trial scope)`
4. `release-boundary-frozen (trial scope)`
5. `not release-prep-ready`

## 6. 最终结论

最终结论如下：

- 当前最小 public API 已正式冻结
- 当前 trial 元数据边界已正式冻结
- 当前 package 仍明确保持：
  - `private`
  - `in-repo trial`
- 下一步若继续，应进入：
  - `release prep` 前置的更高层判断
  - 或真正的 `release prep` 收口任务
