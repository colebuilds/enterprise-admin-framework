---
title: 任务边界模板-极简执行版
type: standard
code: FE-AI-002-LITE
status: stable
author: cole
owner: cole
created: 2026-04-10
updated: 2026-04-10
scope: ai task boundary quick template
applies_to: human, ai-agent
---

# 任务边界模板-极简执行版

## 1. 任务输入（最小必填）

- 任务目标：
- 本次不包含：
- 允许修改范围：
- 禁止修改范围：
- 允许命令：
- 禁止命令：

## 2. 默认策略（未写明即按此）

- 新增文件：否
- 删除文件：否
- 重命名文件：否
- 安装依赖：否
- 修改 lockfile：否
- 全仓 lint/test/build：否

## 3. AI 需补全内容

- 风险与影响面
- 待确认项
- 执行计划（文件+命令+验证）

## 4. 执行门槛

- 仅在“明确执行授权”后进入落盘。
- 遇到边界冲突必须暂停并回报，不得自行扩权。

## 5. 输出模板

- 边界确认结果：已确认 / 需修改 / 暂不执行
- 待确认项清单：
- 已授权后执行计划：
