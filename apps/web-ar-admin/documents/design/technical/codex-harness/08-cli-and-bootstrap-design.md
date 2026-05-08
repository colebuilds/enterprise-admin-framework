---
title: Codex Harness CLI 与项目引导设计
type: design
status: draft
owner: cole
scope: init / doctor / upgrade 命令面与第一版项目引导策略
applies_to: human, ai-agent
---

# Codex Harness CLI 与项目引导设计

## 1. 文档定位

本文档用于定义当前第一版 `adapter-codex` 的 CLI 命令面，以及项目引导策略。

本文档重点回答的问题是：

- 为什么需要正式 CLI，而不是继续手工接入
- `init / doctor / upgrade` 分别是什么
- 第一版命令应该做到什么程度
- 第一版命令不应该做什么
- CLI 和 `Harness core / adapter-codex / docs-kit / skills-kit` 的关系是什么

---

## 2. 为什么需要 CLI

如果产品长期停留在：

- 手工复制配置
- 手工复制文档
- 手工拼接 `AGENTS.md`
- 手工组织 skills

那么它更像一套“顾问式落地方法”，而不是一个真正可安装、可升级、可校验的产品。

因此，第一版就需要正式 CLI，原因有三：

### 2.1 统一接入入口

用户接入时，需要的是一个稳定入口，而不是若干分散文档。

### 2.2 统一升级与校验入口

随着产品迭代，项目不能一直靠人工对照文档升级。

### 2.3 统一产品体验

CLI 是当前版本最直接的用户入口，它决定用户是否真正感受到“开箱即用”。

---

## 3. 第一版 CLI 命令面

当前建议第一版只收敛为三个命令：

```bash
harness-codex init
harness-codex doctor
harness-codex upgrade
```

这三个命令分别承担：

- `init`
  - 建立最小可用骨架
- `doctor`
  - 检查当前项目是否仍处于健康接入状态
- `upgrade`
  - 把新版本骨架变化同步到已有项目

---

## 4. `init` 的定位

`init` 是第一版最重要的命令。

它不是“安装一个 npm 包”这么简单，而是：

**把 `adapter-codex` 的最小可用工作骨架写进用户项目。**

其目标包括：

- 建立 Codex 项目级配置入口
- 建立项目级 `AGENTS.md` 入口
- 建立文档治理入口
- 建立 `codex-pir` 手册入口
- 建立最小 skill/workflow 入口

### 4.1 第一版 `init` 的最小写入资产

第一版建议至少写入：

- `.codex/config.toml`
- `AGENTS.md`
- `documents/README.md`
- `documents/guides/engineering/codex-pir/`

### 4.2 第一版 `init` 的执行顺序

建议顺序：

1. 扫描项目环境
2. 识别是否已有 Codex 接入痕迹
3. 生成/合并 `.codex/config.toml`
4. 生成/合并 `AGENTS.md`
5. 建立文档骨架
6. 建立 `codex-pir` 入口
7. 建立 skill 接入入口
8. 输出初始化结果摘要

### 4.3 第一版 `init` 的成功标准

执行一次 `init` 后，项目应进入：

**最小可用的 Codex-first 工作状态。**

---

## 5. `doctor` 的定位

`doctor` 的目标不是“列一堆检查项”，而是：

**告诉用户当前项目是否仍处于健康接入状态。**

它至少应检查：

- `.codex/config.toml`
- `AGENTS.md`
- `documents/README.md`
- `codex-pir` 手册目录
- skill 入口约定

### 5.1 第一版 `doctor` 的输出结构

建议至少输出：

- `Status`
- `Healthy`
- `Warnings`
- `Errors`
- `Fixable`
- `Recommended next steps`

### 5.2 第一版 `doctor` 的成功标准

它至少要能回答：

1. 项目有没有接上骨架
2. 哪一层缺了
3. 缺失项能不能自动补

---

## 6. `upgrade` 的定位

`upgrade` 的目标是：

**把产品新版本的骨架变化同步到已接入项目。**

它不应是“重新初始化”，也不应是“暴力覆盖”。

### 6.1 第一版 `upgrade` 应处理的对象

至少包括：

- `.codex/config.toml` 模板更新
- `AGENTS.md` 模板块更新
- 文档骨架更新
- `codex-pir` 手册更新

### 6.2 第一版 `upgrade` 的原则

- 尽量合并
- 尽量提示差异
- 尽量保护项目私有修改

---

## 7. CLI 与产品分层的关系

CLI 并不是产品全部，但它是第一版最关键的用户入口。

分层关系应为：

- `core`
  - 提供对象模型、生命周期、执行闸门等抽象
- `runtime`
  - 提供运行态与控制面抽象
- `adapter-codex`
  - 提供当前宿主专属接入能力
- `docs-kit`
  - 提供文档模板与文档落盘规则
- `skills-kit`
  - 提供 workflow glue
- `cli`
  - 负责把这些资产真正写进用户项目

所以：

**CLI 不是核心能力本身，但它是第一版把核心能力交付给用户的方式。**

---

## 8. 第一版不要做什么

为了保持收敛，第一版 CLI 不建议做：

- 多宿主统一接入
- 很重的交互式安装向导
- skill marketplace
- 完整的自动 merge engine
- 服务端控制面
- 复杂 runtime 目录大规模落盘

第一版更重要的是：

- 简单
- 稳定
- 能用
- 可检查

---

## 9. 第一版 CLI 成功标准

第一版 CLI 如果是成功的，用户应能做到：

1. 运行一次 `init`
2. 项目进入最小可用 Codex-first 状态
3. 运行 `doctor` 知道骨架是否健康
4. 运行 `upgrade` 知道如何跟上产品版本

换句话说：

- `init` 建立骨架
- `doctor` 检查骨架
- `upgrade` 演进骨架

---

## 10. 一句话总结

**第一版 CLI 的本质不是“安装器”，而是把 `adapter-codex` 工作骨架稳定交付给用户项目的产品入口。**
