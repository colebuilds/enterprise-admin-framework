---
title: Codex Harness 产品打包与 Monorepo 方案
type: design
status: draft
owner: cole
scope: 长期 Harness 与当前 Codex 发行版的产品实现分层
applies_to: human, ai-agent
---

# Codex Harness 产品打包与 Monorepo 方案

## 1. 文档定位

本文档用于说明当前产品为什么需要从“单仓混合开发态”演进为“长期 Harness + 当前 adapter-codex”的产品实现结构。

本文档重点回答的问题是：

- 为什么当前仓库形态不适合直接作为独立产品仓库
- 为什么需要 monorepo
- 哪些能力应进入长期 `Harness core`
- 哪些能力应进入当前 `adapter-codex`
- 第一版最合理的 package 划分是什么
- 为什么当前只发布 Codex 适配器是合理的

---

## 2. 当前问题

当前开发仓库中混合了多类内容：

- Harness 内核设计与实现
- Codex-first 的工作骨架文档
- 文档治理与 AI 协作治理规则
- 项目私有试验内容
- 历史演进文档
- 当前宿主专属接入方式

这会导致几个直接问题：

### 2.1 无法稳定区分产品态与开发态

现在很多内容都在同一个仓库里，但并不都属于未来产品本体。

### 2.2 无法稳定区分核心与适配层

当前很多叙事仍然以 `Codex` 为中心，但长期产品并不应被 `Codex` 绑定。

### 2.3 无法把接入体验做成正式产品命令面

如果继续维持当前形态，用户接入更像手工装配，而不是正式初始化与升级流程。

---

## 3. 为什么要 Monorepo

长期采用 monorepo，不是为了“架构显得高级”，而是因为产品已经天然具备多包分层需求。

### 3.1 核心与宿主适配必须分开

长期产品需要有：

- 宿主无关核心
- 宿主专属适配层

如果两者不拆，后续扩展到其他宿主会持续受阻。

### 3.2 CLI、文档模板、skills glue 都是正式产品资产

未来用户接入产品，不应依赖手工复制一堆文档与配置，而应依赖正式命令面：

- `init`
- `doctor`
- `upgrade`

这意味着：

- CLI 是正式产品能力
- 文档模板是正式产品能力
- skills glue 是正式产品能力

### 3.3 第一版发行与长期产品必须解耦

当前第一版只做 `Codex` 是正确的，但长期产品本体不应改名或改抽象。

monorepo 的价值就在于：

- 长期产品本体保持稳定
- 第一版发行形态可以先聚焦一个适配器

---

## 4. 长期产品结构

长期产品应采用以下逻辑：

- 产品总名：`Harness`
- 第一版发行：`adapter-codex`
- 后续可扩展：`adapter-claude`、`adapter-gemini` 等

也就是说：

- `Harness` 是长期产品本体
- `Codex Harness` 是当前第一版产品叙事

---

## 5. 推荐 Monorepo 结构

```text
harness/
  packages/
    core/
    runtime/
    cli/
    adapter-codex/
    docs-kit/
    skills-kit/
  templates/
    codex/
  docs/
  examples/
```

---

## 6. 每个 Package 的职责

## 6.1 `packages/core`

职责：

- task object model
- lifecycle model
- execution gate model
- batch / work item / execution unit model
- blocked / resume 抽象

这一层应尽量保持宿主无关。

## 6.2 `packages/runtime`

职责：

- runtime state schema
- control plane 抽象
- hooks
- plugin attach / resolution 抽象
- diagnostics 升级闭环抽象

这一层同样应尽量保持宿主无关。

## 6.3 `packages/cli`

职责：

- `init`
- `doctor`
- `upgrade`
- 后续的安装、校验、升级命令面

这一层是最终用户最直接接触的产品入口。

## 6.4 `packages/adapter-codex`

职责：

- Codex config 生成/合并
- `AGENTS.md` 注入
- Codex profiles
- Codex prompt / profile / skill routing
- Codex 项目接入模板

这是当前第一版最重要的适配层。

## 6.5 `packages/docs-kit`

职责：

- requirement/design/delivery/evolution 模板
- 文档目录映射
- 文档落盘规则
- 文档产物化辅助能力

## 6.6 `packages/skills-kit`

职责：

- `superpowers` 映射
- role -> skill mapping
- workflow glue
- 后续可复用 skill 集成层

---

## 7. 当前阶段最小可行版本

虽然长期结构应完整，但当前阶段不应一步把所有包都做重。

当前阶段最合理的最小可行版本是：

- `core`
- `cli`
- `adapter-codex`
- `docs-kit`

并让：

- `runtime` 先以轻实现存在
- `skills-kit` 先围绕 `superpowers` 做映射，不做大而全体系

---

## 8. 为什么当前只发布 Codex 适配器

当前只发布 `adapter-codex` 是合理的，原因有三：

### 8.1 先验证复杂需求执行骨架是否稳定

当前最重要的不是适配器数量，而是：

- 复杂需求拆解是否稳定
- 执行闸门是否稳定
- 多任务推进是否稳定
- 文档产物化是否稳定

### 8.2 当前已有最强上下文是 Codex

当前方法论、profiles、prompts、skills、文档治理都已经围绕 `Codex` 打了一轮基础。

### 8.3 多适配器过早只会放大抽象不稳定

如果 core 边界还没稳就上多适配器，最终只会让产品层和实现层都更混乱。

---

## 9. 用户安装形态

当前最终目标不应是“让用户手工复制文件”，而应是形成正式接入命令面，例如：

```bash
pnpm dlx harness-codex init
pnpm dlx harness-codex doctor
pnpm dlx harness-codex upgrade
```

其中第一阶段应优先做：

- `init`

它负责：

- 检测项目类型
- 写/合并配置
- 注入 `AGENTS.md`
- 接文档模板
- 接 skills
- 输出下一步使用说明

---

## 10. 当前仓库与未来产品仓库的关系

当前开发仓库仍可作为：

- 架构试验场
- 文档收敛场
- 内核演进场

但如果要进入正式产品化，后续应逐步把真正属于产品本体的内容迁入独立的 monorepo 结构，而不是继续长期和项目私有材料混在一起。

---

## 11. 一句话结论

**长期产品应收敛为 `Harness` monorepo，当前阶段只需先把 `Harness core + adapter-codex + CLI 接入面` 打稳。**
