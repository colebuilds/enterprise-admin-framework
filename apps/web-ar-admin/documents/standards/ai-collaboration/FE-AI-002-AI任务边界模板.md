---
title: AI-任务边界模板
type: standard
code: FE-AI-002
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-04-10
scope: task boundary template
applies_to: human, ai-agent
---

# AI-任务边界模板

## 1. 用途

用于定义单次任务的修改边界、命令边界和暂停条件。

## 2. 最小输入模板

- 任务目标：
- 本次不包含：
- 允许修改范围：
- 禁止修改范围：
- 允许命令：
- 禁止命令：
- 额外限制：

## 3. 默认值（未声明即按此）

- 新增文件：否
- 删除文件：否
- 重命名文件：否
- 安装依赖：否
- 修改 lockfile：否
- 全仓操作：否

## 4. AI 补全要求

AI 可补全：

- 风险与影响面
- 待确认项
- 执行计划（文件、命令、验证）

AI 不可擅自放宽：

- 文件权限（增删改名）
- 依赖与 lockfile
- 高风险命令与全仓命令
- 受保护路径访问权限

## 5. 执行门槛

- 未获得明确执行授权前，不落盘修改。
- 执行中若出现边界冲突，先暂停并回报。

## 6. 输出模板

- 边界确认结果：已确认 / 需修改 / 暂不执行
- 待确认项：
- 已授权执行计划：
- 风险与影响面：
- 验证建议：

## 7. 关联文档

- `documents/standards/ai-collaboration/FE-AI-001-AI变更控制协议.md`
- `documents/standards/ai-collaboration/FE-AI-006-AI协作执行速查卡.md`
- `documents/standards/ai-collaboration/FE-AI-007-AI分阶段执行与连续交付协议.md`
