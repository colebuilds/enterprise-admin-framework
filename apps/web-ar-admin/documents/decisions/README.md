# decisions

- 目录职责：关键决策记录（ADR）。某个时间点做出的选择和理由——静态快照，不随时间修改，只会被新的 ADR 取代。
- 命名：`YYYY-MM-DD-主题.md`

---

## ADR 最小模板

```markdown
---
title: [决策标题]
date: YYYY-MM-DD
status: accepted | superseded | deprecated
superseded-by: [如已被取代，填新 ADR 文件名]
---

## 背景

[一句话：为什么需要做这个决策，当时面临什么问题]

## 决策

[做了什么选择]

## 理由

[为什么选这个而不是其他选项，核心权衡是什么]

## 放弃的选项

[其他考虑过但没选的方案，以及原因]

## 影响

[这个决策会带来哪些约束或后续动作]
```

---

## decisions vs evolution 区分

|  | decisions | evolution |
| --- | --- | --- |
| 时间维度 | 某个时间点的一次选择 | 随时间持续变化的过程 |
| 是否修改 | 不修改，只被新 ADR 取代 | 持续追加、更新 |
| 典型内容 | "我们选择用 TanStack Query 而不是 Pinia 管字典" | "字典系统从 v1 到 v2 的演进记录" |
