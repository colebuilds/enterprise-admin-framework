---
title: Husky-LintStaged 接入手册
type: guide
status: stable
author: cole
owner: cole
created: 2026-03-31
updated: 2026-03-31
audience: human, ai-agent
tool: Husky + lint-staged
tool_version: stable
related_standards:
  - ENG-STD-001
  - ENG-STD-002
  - ENG-STD-005
---

# Husky-LintStaged 接入手册

## 1. 文档定位

本文档用于说明如何把 Git hooks 与 staged 文件检查接入工程流程，让提交前门禁在本地就能拦住明显问题。  
本文档只讲接入与迁移，不重复门禁规范正文，也不把当前仓库状态写成既成事实。

## 2. 适用场景

适合以下情况：

- 希望在提交前先做快速校验
- 需要只检查暂存区文件，减少本地等待时间
- 团队希望把 commit message 校验和 staged 文件检查分开处理
- 需要为本地门禁建立稳定、轻量的钩子层

## 3. 前置条件

接入前建议先确认：

- 已经有可复用的静态检查脚本
- 团队接受 hook 必须尽量快、尽量轻
- 已明确哪些检查适合放在提交前，哪些应留给 CI
- 已规划好 `commit-msg` 与 `pre-commit` 的职责边界

## 4. 推荐接入步骤

### 4.1 初始化 hook 框架

先建立 `.husky/` 目录和基础 hook 约定，让仓库具备统一的 Git hooks 承载位置。

### 4.2 拆分 hook 职责

建议最少区分两类 hook：

- `pre-commit`
  - 负责 staged 文件的快速检查
- `commit-msg`
  - 负责提交信息校验

### 4.3 接入 lint-staged

把只适合检查暂存区文件的任务接入 `lint-staged`，例如：

- 代码格式化
- 局部静态检查
- 可安全自动修复的任务

### 4.4 控制 hook 成本

提交前钩子应保持短、快、可预期。  
较重的全量检查留给 `verify` 或 CI，不建议全部塞进 hook。

### 4.5 与门禁入口对齐

当本地 hook 已稳定后，再把它与更高层的 `check` / `verify` 策略对齐，确保本地、提交前、CI 三层职责清晰。

## 5. 推荐配置 / 脚本落点

建议主要落在以下位置：

- `.husky/pre-commit`
  - staged 文件检查入口
- `.husky/commit-msg`
  - commitlint 校验入口
- `lint-staged.config.*`
  - staged 文件任务映射
- `package.json`
  - `lint:staged`、`lint:commit` 或同类手动脚本

## 6. 与标准规范关系

- [ENG-STD-001](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-001-工程治理与工具链规范.md)
  - 定义 Git hooks 在工程治理中的职责边界
- [ENG-STD-002](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-002-提交规范.md)
  - 定义 commit message 该遵守什么格式
- [ENG-STD-005](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-005-检查与发布门禁规范.md)
  - 定义提交前门禁、本地检查与 CI 的分层关系

## 7. 常见注意事项

- 不要把所有检查都塞进 Git hooks，hooks 应保持轻量
- 不要把 `pre-commit` 和 `commit-msg` 混成一个任务
- 不要让 lint-staged 处理过重的全量检查
- 不要把自动修复能力放到会影响语义的规则上

## 8. 渐进迁移建议

建议按以下顺序迁移：

1. 先接 `commit-msg`
2. 再接 `pre-commit`
3. 再为暂存区配置 lint-staged
4. 最后把本地 hook 与更高层门禁对齐

## 9. 一句话总结

Husky + lint-staged 接入的目标不是让提交流程更重，而是把最该在本地先发现的问题拦在提交前，同时保留轻量、快速、可迁移的开发体验。
