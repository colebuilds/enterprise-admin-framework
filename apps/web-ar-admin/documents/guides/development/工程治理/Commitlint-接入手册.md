---
title: Commitlint 接入手册
type: guide
status: stable
author: cole
owner: cole
created: 2026-03-31
updated: 2026-03-31
audience: human, ai-agent
tool: Commitlint
tool_version: stable
related_standards:
  - ENG-STD-001
  - ENG-STD-002
  - ENG-STD-005
---

# Commitlint 接入手册

## 1. 文档定位

本文档用于说明如何把提交信息校验接入工程流程，并让提交约定从“口头要求”逐步收敛为“可检查、可阻断、可迁移”的工具链能力。  
本文档只讲接入与迁移，不重复提交规范正文，也不把当前仓库的状态写成既成事实。

## 2. 适用场景

适合以下情况：

- 仓库已有或准备统一提交规范
- 团队希望把提交信息格式前置到本地校验
- 需要在提交前就识别不合规提交
- 希望为后续版本治理、变更审计和 release 记录打基础

## 3. 前置条件

接入前建议先确认：

- 已明确提交信息的目标格式
- 团队对 `type`、`scope`、`subject` 的含义有统一认知
- 本地开发流程允许在提交时多一步校验
- 能接受先保留旧写法兼容，再逐步收紧的迁移方式

## 4. 推荐接入步骤

### 4.1 先确定校验边界

先确认当前仓库希望统一到哪种提交写法，再决定是否启用更严格的校验。  
如果历史提交风格较多，建议先把规则定义为“最小可用集合”，后续再逐步收紧。

### 4.2 建立 Commitlint 配置

建议将提交规则放在独立配置文件中，例如：

- `commitlint.config.*`
- 或项目约定的共享配置文件

配置重点应放在提交格式校验，不要把业务规则或架构规则混入其中。

### 4.3 接入提交消息校验入口

建议把 Commitlint 放到 `commit-msg` 场景中，让提交消息在真正进入仓库前被检查。  
如果项目已经使用 Git hooks，可把校验逻辑挂到相应 hook 中。

### 4.4 提供统一脚本入口

建议同时提供一个显式脚本入口，例如：

- `lint:commit`

这样团队在排查问题或做手动校验时，有一个可直接复用的入口。

### 4.5 逐步收紧

接入初期可优先保证可用性和兼容性，后续再逐步收紧：

- `scope` 要求
- `subject` 长度与写法
- 特殊场景格式
- 例外处理方式

## 5. 推荐配置 / 脚本落点

建议主要落在以下位置：

- `commitlint.config.*`
  - 提交规范主体
- `.husky/commit-msg`
  - 提交消息提交前校验入口
- `package.json`
  - `lint:commit` 或同类手动校验脚本
- `verify`
  - 若项目希望把提交规范纳入完整门禁，可在更高层入口中聚合

## 6. 与标准规范关系

- [ENG-STD-001](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-001-工程治理与工具链规范.md)
  - 定义提交规范在工程治理体系中的职责边界
- [ENG-STD-002](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-002-提交规范.md)
  - 定义提交信息应该遵守什么格式与语义
- [ENG-STD-005](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-005-检查与发布门禁规范.md)
  - 定义提交规范在哪些阶段被执行与阻断

## 7. 常见注意事项

- 不要把 Commitlint 当成变更内容解释器，它只负责提交消息
- 不要把校验规则收得过死，尤其是历史仓库迁移时
- 不要用提交消息去替代变更说明文档
- 不要把 `scope` 设计得过于抽象，否则后续追踪会变差

## 8. 渐进迁移建议

建议按以下顺序迁移：

1. 先跑通提交消息校验
2. 再接入 `commit-msg` hook
3. 再补手动脚本入口
4. 最后再考虑是否纳入更高层门禁

## 9. 一句话总结

Commitlint 接入的目标不是让每条提交都“长得一样”，而是让提交消息能够稳定表达这次改动的类别、范围和意图，并在提交前就尽早发现明显不合规的写法。
