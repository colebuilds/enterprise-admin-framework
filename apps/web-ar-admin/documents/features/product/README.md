---
title: Product Features 目录说明
type: guide
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-04-10
audience: human, ai-agent
---

# Product Features 目录说明

## 1. 目录职责

`documents/features/product/` 用于存放产品需求类文档，采用“一个需求一个目录”的组织方式。

目标：

- 让产品、开发、测试、AI 在同一需求上下文中协作
- 让需求过程、技术决策、测试结论可追溯
- 避免文档散落、命名混乱、历史不可复盘

## 2. 组织规则（强约束）

1. 一个需求一个目录

- 示例：`出款数据看板/`

2. 复杂需求在目录内分文档治理

- 不要把产品、技术、测试、交接全部塞进一篇文档

3. 文档按职责归位

- 产品问题归产品文档
- 技术问题归技术文档
- 测试问题与用例记录归测试文档
- 最终收口归交接/总结文档

## 3. 复杂需求推荐文件清单

以下为复杂需求目录的推荐最小集（按优先级）：

### 3.1 必备文件

1. `README.md`

- 作用：需求目录导航页（总入口）
- 内容：背景、范围、状态、文档索引、负责人

2. `product-spec.md`

- 作用：产品需求主文档
- 内容：目标、业务规则、交互、口径、待确认问题

3. `technical-design.md`

- 作用：技术方案文档
- 内容：架构设计、数据流、接口映射、降级策略、风险与技术债

4. `test-plan.md`

- 作用：测试计划与执行记录
- 内容：测试范围、测试用例、执行结果、阻塞项、回归结论

5. `handover.md`（或 `closure-report.md`）

- 作用：需求收口总结文档
- 内容：完成度、改动清单、问题清单、风险、验收与上线建议

### 3.2 按需文件

6. `api-contract.md`

- 作用：联调契约文档
- 内容：接口清单、字段定义、错误码、缺口与确认结论

7. `mock-strategy.md`

- 作用：Mock 策略文档
- 内容：Mock 边界、数据一致性规则、切换策略、已知限制

8. `decisions.md`

- 作用：关键决策记录
- 内容：问题、方案选型、取舍、最终结论

9. `changelog.md`

- 作用：需求内版本演进记录
- 内容：每次迭代的变更点与影响范围

10. `acceptance-summary.md`

- 作用：最终一致性验收汇总
- 内容：文档集合、frontmatter 合规、段落完整性、路径引用可达性结论

## 4. 问题归档矩阵（必须遵守）

1. 产品问题（交互、口径、需求歧义）

- 放在：`product-spec.md`（待确认） + `decisions.md`（已决议）

2. 开发问题（技术实现、架构风险、接口缺口）

- 放在：`technical-design.md` + `api-contract.md`

3. 测试问题（缺陷、阻塞、回归失败）

- 放在：`test-plan.md`

4. 开发中生成的测试用例记录

- 放在：`test-plan.md`（必须包含用例设计与执行轨迹）

## 5. 文件格式规范

### 5.1 Frontmatter（建议统一）

每个文档建议包含以下元数据：

```yaml
---
title: <文档标题>
type: <standard|guide|design|decision|evolution|feature|reference>
status: <draft|review|stable|deprecated|archived>
author: <name>
owner: <name>
created: YYYY-MM-DD
updated: YYYY-MM-DD
audience: human, ai-agent
---
```

### 5.2 命名规范

- 目录名：`<需求名>/`
- 文件名：小写中划线优先（如 `technical-design.md`）
- 历史快照可加日期后缀：`<需求名>-<主题>-YYYY-MM-DD.md`
- 不使用：`最新版.md`、`最终版.md`、`new.md`

### 5.3 内容结构规范

每篇文档至少包含：

- 背景/目标
- 范围（包含/不包含）
- 主体内容
- 风险与待办（如适用）
- 更新记录或结论

## 6. 收口要求（需求完成时）

需求完成时必须有 `handover.md`（或 `closure-report.md`），至少覆盖：

- 完成范围与未完成范围
- 代码改动清单
- 文档改动清单
- 测试结果与验收结论
- 未解决问题与后续建议

## 7. 目录示例

```text
features/product/
└── 某需求/
    ├── README.md
    ├── product-spec.md
    ├── technical-design.md
    ├── test-plan.md
    ├── api-contract.md          # 可选
    ├── mock-strategy.md         # 可选
    ├── decisions.md             # 可选
    ├── changelog.md             # 可选
    └── handover.md
```

## 8. 当前示例

- `documents/features/product/出款数据看板/`
