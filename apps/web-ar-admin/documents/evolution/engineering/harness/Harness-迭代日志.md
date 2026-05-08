---
title: Harness 迭代日志
type: evolution
status: stable
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
---

# Harness 迭代日志

## 1. 目标

记录 Harness 系统的真实版本演进，用于承接：

- 版本号变化
- 能力新增
- 能力调整
- 兼容性影响
- 后续迁移注意事项

本文件是 Harness 真实迭代日志载体，不替代制度规范。

相关制度规范见：

- `documents/standards/ai-collaboration/FE-AI-005-Harness版本号与迭代日志规范.md`

## 2. 版本号载体

Harness 当前真实版本号载体为：

- `/.harness-version.json`

说明：

- 根目录 `package.json` 的 `version` 仍视为业务项目版本
- Harness 自身版本不与业务项目版本复用
- 后续 skill 应以 `/.harness-version.json` 为准判断 Harness 当前版本

## 3. 日志结构

每次版本级变化建议至少记录：

- 版本号
- 日期
- `Added / Changed / Removed`
- 影响范围
- 兼容性影响
- 迁移或注意事项
- 关联规范、skill、runtime 变更

## 4. 最小更新入口

当前阶段的最小真实更新入口为：

- `pnpm harness:version bump <patch|minor|major> --date <YYYY-MM-DD> --summary "<text>"`

说明：

- 该动作会同步更新 `/.harness-version.json`
- 该动作会同步在本文件追加一个新的版本日志骨架
- 当前阶段优先提供“最小真实动作”，不扩展为完整发布流水线

## 5. 当前版本

### 0.2.0 | 2026-04-02

#### Added

- 验证 Harness 版本动作与日志动作真实收口

#### Changed

- 无

#### Removed

- 无

#### 影响范围

- 待补充

#### 兼容性影响

- 无

#### 注意事项

- 请继续补充影响范围、迁移说明与关联规范

### 0.1.0 | 2026-04-02

#### Added

- 建立 Harness 系统蓝图与总体目标规范
- 建立总任务 / 中任务 / 可提交单元三层任务对象模型
- 建立总任务 / 总验收 / 总 MR 收口模型
- 建立 runtime 控制面 V1、runtime 模板 V1 与实例样例
- 建立 skill 协议模型
- 打通最小真实 runtime 写入入口

#### Changed

- `harness-task-flow` 升级到三层任务对象与总任务收口模型
- `ai-subtask-orchestration` 升级到三层任务对象、拆分确认与批次视角
- `harness-runtime-recording` 升级到 V1 控制面与模板口径

#### Removed

- 无

#### 影响范围

- `documents/features/architecture/harness-*`
- `documents/standards/ai-collaboration/*`
- `.harness-runtime/*`
- `skills/harness-task-flow/SKILL.md`
- `skills/ai-subtask-orchestration/SKILL.md`
- `skills/harness-runtime-recording/SKILL.md`

#### 兼容性影响

- 当前仍处于 `trial` 阶段
- 旧的单任务最小记录器口径已不再代表 Harness 当前主模型

#### 注意事项

- 后续若发生 Harness 系统能力级变化，应同步更新 `/.harness-version.json`
- 后续若发生版本级变化，应在本文件追加对应版本日志，而不是只改规范文档
