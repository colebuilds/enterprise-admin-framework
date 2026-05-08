---
title: Harness release prep 最终实施入口边界 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-consistency-and-helper-script-boundary-v1, release-boundary-freeze-implementation-v1
---

# Harness release prep 最终实施入口边界 V1

## 1. 目标

本文档用于承接 Harness 最小 release prep 第四阶段，把当前 frozen trial scope 下的：

- 最终实施入口
- 禁止实施动作
- 后续阶段触发条件

正式收成一组可执行、可验证的发布前约束。

本轮不做：

- 开始真实发布
- 去掉 `private`
- 新增发布脚本
- 扩大 public surface

## 2. 当前允许进入的最小实施入口

当前 release prep 第四阶段只允许进入以下最小实施入口：

1. 读取 frozen public API
2. 读取 frozen trial 元数据边界
3. 读取路径白名单
4. 读取脚本、流程、一致性检查与辅助脚本边界
5. 执行最小 build：
   - `node packages/harness/scripts/build.mjs`
6. 执行统一回归：
   - `pnpm harness:test`
7. 基于现有 frozen trial scope 继续做发布前判断文档与边界核对

这组入口的共同特征是：

- 只读确认
- 最小构建
- 最小验证
- 不改变当前 package 对外面

## 3. 当前仍明确禁止的实施动作

当前 release prep 第四阶段仍明确禁止：

- 去掉 `"private": true`
- 新增 `release` / `publish` / `pack` / `version` / `prepublishOnly` / `postpublish` / `prerelease` 脚本
- 新增 `release.mjs` / `publish.mjs` / `pack.mjs` / `version.mjs` / `prepublish.mjs` / `prepublishOnly.mjs`
- 新增 `main`
- 新增 `types`
- 新增 source map 相关字段
- 新增 `publishConfig`
- 扩大 `exports`
- 扩大 `files`
- 扩大 `dist`
- 导出 `diagnostics`
- 导出 `cli`
- 导出 `tests`
- 导出 `internal/*`
- 导出 `shared`
- 开始真实 publish 或 pack 流程

这些动作当前仍属于：

- 超出 trial scope 的发布语义
- 超出当前 release-prep 最小边界

## 4. 当前进入后续阶段的最小触发条件

若后续要从当前 release prep 再往后推进，至少应同时满足以下最小触发条件：

1. frozen public API 继续保持不变
2. frozen trial 元数据边界继续保持不变
3. 路径白名单、脚本边界、流程边界、一致性检查边界、辅助脚本边界继续保持不变
4. `pnpm harness:test` 持续通过
5. 当前 `dist` 继续只承接允许入口
6. 必须显式开启新的后续任务，而不是在当前阶段内顺滑扩张

这里的“后续阶段”只表示：

- 允许开始做新一轮发布前判断

并不表示：

- 已自动进入真实发布实施

## 5. 当前边界如何被约束

当前最终实施入口边界由四层共同约束：

### 5.1 package 元数据层

[package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json) 当前继续保持：

- `private`
- 最小 `files`
- 最小 `exports`
- 最小 `scripts.build`

且不引入任何发布相关字段。

### 5.2 package README 层

[README.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/README.md) 当前应明确：

- 当前允许进入哪些最小实施入口
- 当前明确禁止哪些实施动作
- 当前后续阶段触发条件是什么

### 5.3 自动回归层

当前自动回归继续覆盖：

- frozen public API
- frozen trial 元数据边界
- 路径白名单
- 脚本与流程边界
- 一致性检查与辅助脚本边界
- 最终实施入口边界

因此后续若有人加入：

- 发布元数据
- 发布脚本
- 额外导出面

将直接体现为回归失败。

### 5.4 架构判断层

当前 `harness-system` 下的 release-prep 系列文档继续共同表达：

- 当前已经适合进入最小 release prep
- 但当前仍只是 frozen trial scope 下的最小实施入口
- 当前还不是 publish-ready

## 6. 当前状态判断

本轮之后，Harness package 更准确的状态应判断为：

1. `release-boundary-frozen (trial scope)`
2. `release-prep-enterable (trial scope)`
3. `release-prep-metadata-whitelisted`
4. `release-prep-path-whitelisted`
5. `release-prep-script-bounded`
6. `release-prep-process-bounded`
7. `release-prep-consistency-bounded`
8. `release-prep-helper-script-bounded`
9. `release-prep-final-entry-bounded`
10. `not publish-ready`

## 7. 最终结论

最终结论如下：

- 当前 release prep 已允许进入的最小实施入口已正式收口
- 当前仍明确禁止的实施动作已正式收口
- 当前进入后续阶段的最小触发条件已正式收口
- 当前 `package.json / README / tests / 架构文档` 已围绕同一组 frozen trial scope 边界对齐
- 当前 package 仍明确保持：
  - `private`
  - `in-repo trial`
- 下一步若继续，应进入：
  - `开始 Harness release prep 最终判断：是否结束当前 trial-scope release prep`
