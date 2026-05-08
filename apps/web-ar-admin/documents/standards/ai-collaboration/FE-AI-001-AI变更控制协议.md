---
title: AI-变更控制协议
type: standard
code: FE-AI-001
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-04-10
scope: ai change execution
applies_to: human, ai-agent
---

# AI-变更控制协议

## 1. 目标

约束 AI 执行变更时的边界、风险和回报方式，确保过程可追踪、结果可审计。

## 2. 适用范围

适用于代码、文档、配置修改与排查修复任务。

## 3. 执行原则

- 明确目标：先说明本次要解决什么、不包含什么。
- 明确边界：先声明允许改动与禁止改动范围。
- 明确计划：先列出计划文件、计划命令、验证方式。
- 明确授权：获得明确执行授权后再落盘修改。
- 最小改动：只做完成目标所需的最小必要改动。
- 可审计：执行后必须输出结构化结果回报。

## 4. 默认禁止（未授权即禁止）

- 新增、删除、重命名文件
- 安装依赖、修改 lockfile
- 全仓 lint/test/build、批量替换、全局修复
- 修改共享基座、全局配置、受保护目录

## 5. 执行中控制

- 优先按计划执行。
- 若需要补充计划外命令，仅允许低风险只读核查命令，并在结果中说明原因。
- 涉及副作用或高风险动作时，先暂停并确认。
- 发现边界冲突时，先暂停并回报，不自行扩权。

## 6. 必停条件

- 需要改计划外文件
- 需要执行计划外高风险命令
- 需要依赖变更或 lockfile 变更
- 原方案无法达成目标

## 7. 执行后回报（最低要求）

- 实际修改文件：路径 + 修改摘要 + 是否计划内
- 实际执行命令：命令 + 结果摘要 + 是否计划内
- 文件变化：新增/删除/重命名（无则写无）
- 偏差审计：计划外改动/命令/未完成项/禁止范围触碰
- 建议验证：页面、流程、命令、风险点

## 8. 关联文档

- `documents/standards/ai-collaboration/FE-AI-002-AI任务边界模板.md`
- `documents/standards/ai-collaboration/FE-AI-003-AI子任务协作与主代理协调规范.md`
- `documents/standards/ai-collaboration/FE-AI-006-AI协作执行速查卡.md`
- `documents/standards/ai-collaboration/FE-AI-007-AI分阶段执行与连续交付协议.md`
- `documents/standards/ai-collaboration/FE-AI-999-AI协作一页纸.md`
