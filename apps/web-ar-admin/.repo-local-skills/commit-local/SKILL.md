---
name: commit-local
description: 用于在当前仓库执行本地私有的提交信息口径，特别是当你希望 commit message 的 type/scope 保持英文规范值、subject 默认使用简体中文且不影响仓库共享 skill 时使用。
keywords: commit, 提交, commit message, 中文 subject, 本地提交规范, commit-local
---

# Commit Local

## 目标

- 为当前仓库提供只在本地生效的提交信息口径补充。
- 不修改仓库共享的 `.codex/skills/commit/*` 通用 skill。
- 与本地 `documents` 中的提交规范保持一致。

## 适用场景

- 用户明确要求按当前仓库的本地提交口径生成或修改 commit message。
- 你准备创建、审查或 amend commit，且需要避免再次出现“subject 全英文”的问题。
- 任务描述命中：`commit`、`提交`、`中文 subject`、`提交规范`、`amend 提交信息` 等关键词。

## 输入要求

- 至少有当前变更范围或现有 commit message。
- 执行前先检查：
  - `documents/standards/coding/FE-STD-005-Git分支与提交规范.md`
  - 当前 `git status`
  - 当前 `git diff` 或目标 commit message

## 执行步骤

1. 先读取本地正式规范 `FE-STD-005-Git分支与提交规范.md`。
2. 生成提交信息时使用格式：`type(scope): subject`。
3. `type` 和 `scope` 使用英文规范值。
4. `subject` 默认使用简体中文，简洁说明本次改动；除非用户明确要求，否则不要使用全英文主题。
5. 如果正在 amend 历史提交，只修改目标 commit 的 message，不要顺手混入其他未提交改动。

## 风险与禁止项

- 不要把只想本地生效的提交口径写回共享 `.codex/skills/commit/*`。
- 不要在未获用户确认时擅自 amend 已经推送的提交。
- 不要生成模糊 subject，如 `update`、`fix`、`misc`。

## 输出要求

- 提供最终 commit message 候选。
- 若已执行 commit 或 amend，明确给出新的 commit hash。
- 若存在未提交的其他改动，提醒其与当前 commit 是否隔离。

## 关联

- `documents/standards/coding/FE-STD-005-Git分支与提交规范.md`
- `AGENTS.md`
