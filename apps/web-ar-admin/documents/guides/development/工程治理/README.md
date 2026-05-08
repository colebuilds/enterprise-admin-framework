title: 工程治理子目录说明 type: guide status: stable author: cole owner: cole created: 2026-03-31 updated: 2026-05-06 audience: human, ai-agent

---

# 工程治理子目录说明

## 1. 目录用途

`documents/guides/development/工程治理/` 用于存放工程治理、工具链接入、门禁落地与渐进迁移相关的操作手册。

本目录与以下正式规范配套：

- `documents/standards/collaboration/ENG-STD-001-工程治理与工具链规范.md`
- `documents/standards/collaboration/ENG-STD-002-提交规范.md`
- `documents/standards/ui/ENG-STD-003-样式规范.md`
- `documents/standards/architecture/ENG-STD-004-依赖边界与架构约束规范.md`
- `documents/standards/quality/ENG-STD-005-检查与发布门禁规范.md`

## 2. 收录范围

- 统一工程入口接入
- Stylelint 接入
- Commitlint 接入
- Dependency Cruiser 接入
- Husky / lint-staged 接入
- Codex 工程协作接入

当前已落地文档：

- `统一工程入口接入手册.md`
- `Stylelint-接入手册.md`
- `Commitlint-接入手册.md`
- `DependencyCruiser-接入手册.md`
- `Husky-LintStaged-接入手册.md`
- `工程治理文档使用建议.md`

## 3. 维护规则

- guide 负责说明如何接入、如何迁移、如何落地，不重复标准正文
- 文档应明确前置条件、推荐步骤、配置落点与渐进迁移建议
- 新增或重组本目录下的正式手册后，应同步检查最近一级 `README.md` 是否需要更新挂载
- 若后续工程治理能力继续扩展，应优先按工具职责补充独立手册

## 4. 相关入口

- `documents/guides/development/codex-pir/README.md`
  - 面向 Codex 的工程化协作体系入口
- `documents/guides/development/README.md`
  - 开发手册总入口与导航页

本目录只承接工程治理相关手册；Codex 协作体系文档单独沉淀在同级 `codex-pir/` 目录中。
