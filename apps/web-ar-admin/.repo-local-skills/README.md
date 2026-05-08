# .repo-local-skills

本目录用于存放项目私有技能（`*/SKILL.md`），仅本地使用，不提交仓库。

职责边界：

- 这里是 **AI 本地 skill 入口目录**
- 这里放 `SKILL.md`、metadata、索引和匹配脚本
- 这里**不是**正式开发手册目录
- 面向人类的正式说明、方案、规范、速查手册、SOP，统一放在 `documents/`

使用约定（与 AGENTS.md 一致）：

- 触发条件：用户点名或任务与 skill metadata（name/description/keywords）明显命中
- 读取方式：先读 metadata，再按需读正文
- 优先级：低于 AGENTS.md 与 documents 正式规范

如果需要查看面向人类的 skill 速查与调用口令，优先看：

- `documents/guides/development/AI技能调用速查手册.md`

如果需要查看 i18n 这类 skill 的正式上游文档，按以下顺序看：

1. `documents/design/technical/2026-05-01-前端国际化方案.md`
2. `documents/standards/coding/FE-STD-008-国际化与字典边界规范.md`
3. `documents/guides/development/国际化接入与运行时机制说明.md`
4. `documents/guides/development/模块内多语言接入AI提示词模板.md`

建议结构：

- `.repo-local-skills/<skill-name>/SKILL.md`
- `.repo-local-skills/_template/SKILL.md`（模板）

已内置示例：

- `archived-local-skill-a/SKILL.md`：已归档，本地占位保留
- `archived-local-skill-b/SKILL.md`：已归档，本地占位保留

元数据索引：

- `registry.json`：私有 skills 的 name/description/keywords/path 汇总
- `scripts/rebuild-registry.py`：重建索引脚本

重建命令：

- `python3 .repo-local-skills/scripts/rebuild-registry.py`

按需匹配命令：

- `python3 .repo-local-skills/scripts/find-skill.py 任务启动 边界`
- `python3 .repo-local-skills/scripts/find-skill.py 执行回报 偏差审计`

按需加载正文：

- `python3 .repo-local-skills/scripts/load-skill.py archived-local-skill-a`
- `python3 .repo-local-skills/scripts/load-skill.py archived-local-skill-b`
