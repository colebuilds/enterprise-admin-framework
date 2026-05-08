---
title: Development 子目录说明
type: guide
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-05-06
audience: human, ai-agent
---

# Development 子目录说明

## 1. 目录用途

`documents/guides/development/` 用于存放日常开发流程、开发约定与操作手册。

## 2. 收录范围

- 开发流程说明
- 本地开发操作指南
- 提交流程说明
- 常见开发约定

## 3. 快速导航

### 3.1 AI 协作入口

- `documents/guides/development/AI技能调用一页口令卡.md`
  - 只想快速决定“该点哪个 skill、该说什么”时，先看这里
- `documents/guides/development/AI技能调用速查手册.md`
  - 忘记 skill 名称、提示词或组合用法时，优先看这里
- `documents/guides/development/AI子任务下发示例.md`
  - 需要把任务拆给子代理时使用
- `documents/guides/development/AI会话上下文恢复执行指南.md`
  - 跨会话恢复上下文时使用

### 3.2 国际化与提示词模板

- `documents/design/technical/2026-05-01-前端国际化方案.md`
  - 想先理解这套系统的多语言方案分层、命名与边界时，先看这里
- `documents/guides/development/国际化接入与运行时机制说明.md`
  - 看 i18n 运行时实现、模块接入方式、已知限制与验证方法时，使用这份手册
- `documents/guides/development/模块内多语言接入AI提示词模板.md`
  - 可直接复制给 AI 的模块内多语言接入提示词模板

### 3.3 权限接入与核对

- `documents/guides/development/权限接入与模块核对SOP.md`
  - 模块级权限盘点、静态预审、权威核对、接入方式和问题分类口径
- `documents/guides/development/权限核对AI提示词模板.md`
  - 可直接复制给 AI 的权限静态预审与权威核对提示词模板

### 3.4 缺陷处理

- `documents/guides/development/AI协作缺陷处理执行指南.md`
  - 一轮 bug 处理、方案卡、实施与回填流程

### 3.5 需求与规范落地

- `documents/guides/development/需求会话上下文交接模板.md`
  - 需求交接、上下文补齐和会话续接
- `documents/guides/development/规范落地执行指南.md`
  - 涉及规范落地、结构治理与高风险改动时使用

### 3.6 工程治理与 Codex 工程化协作

- `documents/guides/development/工程治理/README.md`
  - 工程治理工具链、门禁接入与渐进迁移手册入口
- `documents/guides/development/codex-pir/README.md`
  - Codex PIR 角色体系、工作流、配置与接入方法入口

## 4. 推荐阅读顺序

如果你只是想尽快开始：

1. 不知道该点哪个 skill：先看 `AI技能调用一页口令卡.md`
2. 想看更完整的 skill 和链路：再看 `AI技能调用速查手册.md`
3. 要做模块内多语言接入：看 `模块内多语言接入AI提示词模板.md`
4. 要先理解方案层：看 `../design/technical/2026-05-01-前端国际化方案.md`
5. 要看技术实现与接入方式：再看 `国际化接入与运行时机制说明.md`
6. 要做模块权限核对：看 `权限接入与模块核对SOP.md`
7. 想直接复制权限排查提示词：看 `权限核对AI提示词模板.md`
8. 要处理 bug：看 `AI协作缺陷处理执行指南.md`

## 5. 维护规则

- 当前 `README.md` 本身就是本目录导航页
- 文档应围绕实际开发动作组织
- 新增文档后，应把入口补到本页，而不是只把文件放进目录中
