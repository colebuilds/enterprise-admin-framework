---
title: Harness release prep 脚本与流程边界 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-readiness-judgement-after-boundary-freeze-v1, release-prep-metadata-and-path-whitelist-v1
---

# Harness release prep 脚本与流程边界 V1

## 1. 目标

本文档用于承接 Harness 最小 release prep 第二阶段，把当前 frozen trial scope 下的：

- 脚本边界
- 流程边界

正式收成一组可执行、可验证的发布前约束。

本轮不做：

- 新增真实发布脚本
- 去掉 `private`
- 进入真实发布
- 扩大 public surface

## 2. 当前允许的最小脚本集合

当前 release prep 第二阶段只允许以下 package 脚本进入有效边界：

- `build`

当前 [package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json) 中允许的最小脚本集合保持为：

```json
{
  "build": "node ./scripts/build.mjs"
}
```

这意味着当前 release prep 语境里，package 只承认：

- 构建当前最小 trial 产物

不承认：

- 发布
- 打包发布前钩子
- 版本切换
- 去私有化动作

## 3. 当前允许的最小流程动作集合

当前 release prep 第二阶段允许的最小流程动作集合为：

1. 读取并确认当前 frozen public API
2. 读取并确认当前 frozen trial 元数据边界
3. 读取并确认当前路径白名单
4. 执行最小 build
5. 执行统一回归：
   - `pnpm harness:test`
6. 判断发布前元数据与流程边界是否一致

这组动作的特征是：

- 只读确认 + 最小构建 + 最小验证
- 不涉及对外发布
- 不涉及开放新入口

## 4. 当前明确禁止的动作集合

当前 release prep 第二阶段明确禁止：

- 新增 `release` 脚本
- 新增 `publish` 脚本
- 新增 `prepublishOnly` / `postpublish` 脚本
- 新增 `pack` / `version` / `prerelease` 脚本
- 去掉 `"private": true`
- 扩大 `exports`
- 扩大 `files`
- 把 `diagnostics` 拉入导出层
- 把 `cli` 拉入 package surface
- 把 `internal/*` 或 `shared` 卷入对外产物层
- 把当前 trial package 叙述成 `publish-ready`

## 5. 当前边界如何被约束

当前脚本与流程边界不是只存在于文档里，而是由三层共同约束：

### 5.1 package 元数据层

[package.json](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/package.json) 当前只保留：

- `build`

且不引入任何发布相关脚本。

### 5.2 README 使用说明层

[README.md](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/packages/harness/README.md) 当前应明确：

- 当前允许执行什么
- 当前仍禁止什么
- 当前仍是 `private / in-repo trial`

### 5.3 自动回归层

当前自动回归继续覆盖：

- 脚本允许集合
- 脚本禁止集合
- 元数据白名单
- 路径白名单
- exports / dist / public usage

因此后续若有人加入：

- 发布脚本
- 版本脚本
- 去私有化相关脚本

将直接体现为回归失败。

## 6. 当前状态判断

本轮之后，Harness package 更准确的状态应判断为：

1. `release-boundary-frozen (trial scope)`
2. `release-prep-enterable (trial scope)`
3. `release-prep-metadata-whitelisted`
4. `release-prep-path-whitelisted`
5. `release-prep-script-bounded`
6. `release-prep-process-bounded`
7. `not publish-ready`

## 7. 最终结论

最终结论如下：

- 当前 release prep 允许的脚本集合已正式收口
- 当前 release prep 允许与禁止的流程动作已正式收口
- 当前 `package.json / README / tests / 架构文档` 已围绕同一组 trial scope 脚本与流程边界对齐
- 当前 package 仍明确保持：
  - `private`
  - `in-repo trial`
- 下一步若继续，应进入：
  - `开始 Harness release prep 第三阶段：收口发布前一致性检查与辅助脚本边界`
