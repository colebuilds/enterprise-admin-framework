---
title: Harness release prep 一致性检查与辅助脚本边界 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-script-and-process-boundary-v1, release-prep-metadata-and-path-whitelist-v1
---

# Harness release prep 一致性检查与辅助脚本边界 V1

## 1. 目标

本文档用于承接 Harness 最小 release prep 第三阶段，把当前 frozen trial scope 下的：

- 一致性检查边界
- 辅助脚本边界

正式收成一组可执行、可验证的发布前约束。

本轮不做：

- 新增真实发布脚本
- 去掉 `private`
- 进入真实发布
- 扩大 public surface

## 2. 当前允许的最小一致性检查集合

当前 release prep 第三阶段只允许以下一致性检查进入有效边界：

1. 最小 build 是否可执行
2. `pnpm harness:test` 是否通过
3. `exports / dist / files / README / tests` 是否与 frozen trial scope 一致
4. 当前 release-prep 元数据白名单、路径白名单、脚本边界是否保持不变

这意味着当前允许的检查仍然只围绕：

- 现有 trial 边界的一致性

而不是围绕：

- 发布成功性
- npm 发布行为
- 外部 registry 交互

## 3. 当前允许的最小辅助脚本集合

当前 release prep 第三阶段只允许以下辅助脚本存在于 package 语境：

- `packages/harness/scripts/build.mjs`

当前这组辅助脚本的语义仍然只允许：

- 构建当前最小 trial 产物

不允许承担：

- 发布
- 打包
- 版本推进
- 去私有化

## 4. 当前明确禁止的检查与辅助脚本

当前明确禁止的检查包括：

- 假定已经 publish-ready 的检查
- 假定外部 registry 可用的检查
- 假定 `private` 会被移除的检查
- 假定 `diagnostics / cli / internal/*` 会进入 package surface 的检查

当前明确禁止的辅助脚本包括：

- `release.mjs`
- `publish.mjs`
- `pack.mjs`
- `version.mjs`
- `prepublish.mjs`
- `prepublishOnly.mjs`
- 其他带有真实发布语义的 package helper script

## 5. 当前边界如何被约束

当前一致性检查与辅助脚本边界由三层共同约束：

### 5.1 package 元数据层

[package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json) 当前只保留：

- `build`

并且不引入任何发布相关 script name。

### 5.2 package scripts 目录层

当前 `packages/harness/scripts/` 只允许存在：

- `build.mjs`

不允许出现带有发布语义的辅助脚本文件。

### 5.3 自动回归层

当前自动回归继续覆盖：

- 允许的辅助脚本集合
- 禁止的辅助脚本集合
- 允许的 package script 集合
- 元数据 / 路径 / 脚本 / 流程边界一致性

因此后续若有人加入：

- 发布类 helper script
- 版本脚本
- 去私有化脚本

将直接体现为回归失败。

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
9. `not publish-ready`

## 7. 最终结论

最终结论如下：

- 当前 release prep 允许的一致性检查集合已正式收口
- 当前 release prep 允许的辅助脚本集合已正式收口
- 当前 release prep 明确禁止的检查与辅助脚本也已正式收口
- 当前 `package.json / scripts / README / tests / 架构文档` 已围绕同一组 frozen trial scope 边界对齐
- 当前 package 仍明确保持：
  - `private`
  - `in-repo trial`
- 下一步若继续，应进入：
  - `开始 Harness release prep 第四阶段：收口发布前最终实施入口判断`
