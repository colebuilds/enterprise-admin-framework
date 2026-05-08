---
title: Harness System 最小可运行方案
type: feature
status: draft
author: cole
owner: cole
created: 2026-03-30
updated: 2026-05-06
---

# Harness System 最小可运行方案

当前版本：`0.1.0`

真实版本载体：

- `/.harness-version.json`

真实迭代日志：

- `documents/evolution/engineering/harness/Harness-迭代日志.md`

## 1. 背景

当前项目已经具备较强的 AI 协作治理能力，包括：

- 项目入口规则
- 任务边界与变更控制
- 多代理协作规则
- 文档治理与工程护栏

但现阶段仍主要解决“AI 如何被约束地执行”，尚未形成真正的任务交付闭环。

当前缺口主要集中在：

- 任务类型未统一建模
- 完成定义不够稳定
- 执行后验证仍偏临时

因此，本方案希望在不重写既有规则的前提下，补一版最小可运行的 Harness 方案。

## 2. 目标

本次只建立最小闭环，先定义四件事：

1. 任务类型
2. 完成定义
3. 最小验证
4. 最小运行时记录与自动写入

在此基础上，当前阶段再补一层最小任务编排外壳，用于支撑批次级任务顺序、状态与切换，但不进入自动调度平台。

当前阶段的多 agent 也同步收敛为系统级角色分层：

- 主控 agent
- 多子执行 agent
- 单子查询 agent

其中主控负责前台响应与总调度，执行层保持扁平，查询层单独隔离。

本方案的目标不是直接建设完整运行平台，而是先让任务从“对话请求”升级为“可交付单元”。

## 3. 当前阶段定位

本目录属于架构演进期方案，当前定位为：

- trial / draft 方案
- 用于在真实任务中试运行
- 不等同于最终稳定标准
- 当前试运行基线版本为 `0.1.0`

待后续在真实任务中跑顺后，再决定是否上升为 `documents/standards/ai-collaboration/` 下的正式规范。

## 4. 与现有规范的关系

本方案不替代现有治理层规则，而是在其上增加任务交付闭环。

- `AGENTS.md`
  - 继续负责入口、优先级、授权和停止规则
- `FE-AI-001-AI变更控制协议.md`
  - 继续负责执行控制
- `FE-AI-002-AI任务边界模板.md`
  - 继续负责单次任务边界
- `FE-AI-003-AI子任务协作与主代理协调规范.md`
  - 继续负责多代理协作
- `FE-QUALITY-*`
  - 继续作为质量规范来源

本目录只负责把这些既有规则接成任务交付模型。

当前目录中的主控 / 子执行 / 子查询，只用于说明 Harness 的系统级运行角色；具体任务级的 `single-agent / multi-agent` 判断，仍应由对应 skill 与任务卡流程决定。

同样，任务转场也采用系统级规则：

- 插问默认不切任务
- 无关长问题默认作为旁路问题处理
- 只有显式切换任务时才真正转场

## 5. 本次交付

- `technical-design.md`
  - 定义最小状态流、任务类型、完成定义、最小验证、最小运行时与最小批次对象
- `task-card-template.md`
  - 定义任务卡最小字段模板
- `test-plan.md`
  - 定义 Harness 当前阶段的分层测试用例、版本绑定与回归策略
- `closure-summary.md`
  - 记录 Harness `0.1.0` 的阶段性收口结论、已闭环能力与下一步建议
- `task-object-model.md`
  - 定义 Harness 的 `Requirement / Task / Work Item / Execution Unit` 对象模型
- `closure-model.md`
  - 定义 Harness 的 `Task / total-acceptance / total-mr-ready` 收口模型
- `runtime-control-plane.md`
  - 定义 `.harness-runtime/` 如何从最小记录器升级为控制面 V1
- `runtime-template-v1.md`
  - 定义五类 runtime 文件在 V1 中的模板职责与字段方向
- `skill-protocol-model.md`
  - 定义 Harness 各类 skill 的对象承接、输入输出与 runtime 回写协议
- `core-architecture-v2.md`
  - 定义 Harness 从试运行规则系统升级为生命周期内核、插件接入框架与问题诊断闭环的 V2 方向
- `phase-hook-plugin-contract-v1.md`
  - 定义 Harness 生命周期 phase、hook 与 plugin 接入合同的 V1 最小协议
- `config-model-v1.md`
  - 定义 Harness 初始化配置、默认配置、项目覆盖配置与任务运行时覆盖的 V1 最小模型
- `diagnostics-intake-v1.md`
  - 定义 Harness 问题文件收集、文件复制式诊断输入与议题 / 修复任务反哺的 V1 最小闭环
- `terminology-and-object-model-v2.md`
  - 定义 Harness 的正式术语体系，以及 Requirement / Task / Work Item / Execution Unit 等对象维度的 V2 映射
- `lifecycle-default-config-example-v1.md`
  - 定义 Harness 生命周期、插件、任务策略、runtime 与 diagnostics 的默认配置样例 V1
- `diagnostics-directory-and-issue-file-model-v1.md`
  - 定义 `/.harness-diagnostics/` 根目录、`issues/<issue-id>/` 目录结构，以及 issue / evidence / report 的文件职责
- `runtime-and-config-schema-v1.md`
  - 定义 Harness runtime 快照、事件对象与 config 装配对象的最小 schema 合同
- `diagnostics-collect-analyze-contract-v1.md`
  - 定义 `collect-diagnostics` 与 `analyze-diagnostics` 的输入、输出、读写对象与升级边界
- `project-config-location-and-naming-v1.md`
  - 定义 Harness 项目级配置文件的推荐落点、命名约定与发现优先级
- `plugin-registry-and-manifest-model-v1.md`
  - 定义 plugin contract、plugin manifest、plugin registry 与 project config 的分工关系
- `task-runtime-overrides-model-v1.md`
  - 定义当前任务临时控制对象的承接位置、生效范围与和 project config 的边界
- `phase-state-transition-model-v1.md`
  - 定义 phase 当前状态、合法转移、blocked / resume 语义与 closure 子状态模型
- `method-tactic-layer-model-v1.md`
  - 定义场景化 method / tactic 的架构位置，以及它与 phase、plugin、task_domain 的分工关系
- `plugin-attach-and-resolution-rules-v1.md`
  - 定义 plugin attach 条件、resolution 顺序、冲突类型与 failure policy 的最小规则
- `diagnostics-runtime-and-issue-runtime-model-v1.md`
  - 定义 diagnostics 在 `current-task.yaml` 中的运行态字段组，以及单个 issue 的 `issue-runtime.yaml` 最小模型
- `diagnostics-domain-contract-v1.md`
  - 定义 diagnostics internal domain 的最小 input / lifecycle / upgrade path / runtime output contract，以及当前最小模块边界
- `phase-owner-enhancer-recommended-mapping-v1.md`
  - 定义各标准 phase 的默认 owner / enhancer 推荐映射，以及核心 plugin 的推荐角色分工
- `diagnostics-upgrade-to-remediation-task-rules-v1.md`
  - 定义 diagnostics 结果保持 issue、升级议题、升级 remediation task 的判定门槛与升级路径
- `project-config-and-plugin-registry-assembly-example-v1.md`
  - 定义 `/.harness/config.json` 与 `/.harness/plugins.json` 的最小装配示例，以及默认 phase 映射如何进入项目配置
- `diagnostics-collect-analyze-minimal-implementation-plan-v1.md`
  - 定义 diagnostics 第一版 collect / analyze 真实落地时的最小实现范围、建议文件、动作顺序与验证样例
- `.harness-runtime/`
  - 提供最小运行时目录、模板与自动写入目标，用于批次快照、任务快照、试运行反馈、人工验证和关键事件记录
- `/.harness-version.json`
  - 提供 Harness 真实版本号载体
- `documents/evolution/engineering/harness/Harness-迭代日志.md`
  - 提供 Harness 真实迭代日志载体
- `package-ready-kernel-convergence-checklist-v1.md`
  - 定义 Harness 在进入 package-ready 前的内核收敛清单、状态标签、必须完成项与建议顺序
- `package-export-boundary-v1.md`
  - 定义 Harness future package 的最小导出边界，以及 `public core / host adapter / internal-only` 的分层建议
- `package-structure-and-exports-map-v1.md`
  - 定义 Harness future package 的最小目录结构、`exports` map 建议，以及明确不应导出的路径
- `package-structure-trial-split-implementation-plan-v1.md`
  - 定义 Harness future package 结构试拆的分阶段实施顺序、暂不迁移对象、风险与验证出口
- `diagnostics-package-positioning-v1.md`
  - 定义 diagnostics 在 future package 中的当前定位判断、暂不外提的原因，以及未来若要升级为 optional domain 所需的最小前置条件
- `package-export-landing-readiness-judgement-v1.md`
  - 定义当前是否适合进入真实 `exports` / package 落盘阶段，以及建议的最小落盘范围与仍需保留的 internal-only 边界
- `build-dist-release-readiness-judgement-v1.md`
  - 定义当前是否适合进入 `build / dist / 发布前准备` 阶段，并明确当前仍应保持 `private / in-repo trial` 的原因与后续前置条件
- `build-boundary-and-dist-output-strategy-v1.md`
  - 定义 future build boundary、dist 产物层应承接的最小入口，以及当前明确不应进入 dist 的 internal-only 范围
- `build-implementation-plan-v1.md`
  - 定义 Harness 真实 build 的分阶段实施顺序、首轮明确不包含的范围，以及 build 前应先补的 package 级验证出口
- `build-output-and-package-metadata-boundary-v1.md`
  - 定义 future `dist` 最小形态、源码入口到未来产物入口的映射，以及 build 前需要先收死的 package 元数据边界
- `release-prep-readiness-judgement-after-build-v1.md`
  - 定义最小真实 build 与第一轮 `dist` 落地后，当前是否适合进入 `release prep`，以及仍然阻塞的核心前置项
- `diagnostics-release-prep-blocker-reassessment-v1.md`
  - 定义 diagnostics 在多轮 domain 前置收口后，当前是否仍然构成 `release prep` 主阻塞，以及后续阻塞优先级如何调整
- `host-release-prep-blocker-reassessment-v1.md`
  - 定义 host 在已有单实现、package 导出、build 与 smoke 之后，当前是否仍然构成 `release prep` 主阻塞，以及后续阻塞优先级如何调整
- `release-boundary-final-confirmation-v1.md`
  - 定义 diagnostics 与 host 都降为次级阻塞后，当前是否已经适合开始收口 Harness 的 public API 与 trial 元数据边界
- `release-boundary-freeze-implementation-v1.md`
  - 定义当前最小 public API 与 trial 元数据边界如何通过 package 元数据、README 与自动回归一起冻结为正式 trial scope 边界
- `release-prep-readiness-judgement-after-boundary-freeze-v1.md`
  - 定义在 diagnostics、host 与 release boundary 都完成复评和冻结后，当前是否已经适合进入最小范围的 `release prep`
- `release-prep-metadata-and-path-whitelist-v1.md`
  - 定义 frozen trial scope 下当前 release prep 第一阶段的元数据白名单、路径白名单，以及它们如何被 package 元数据、README 与自动回归共同约束
- `release-prep-script-and-process-boundary-v1.md`
  - 定义 frozen trial scope 下当前 release prep 第二阶段允许的最小脚本集合、允许与禁止的流程动作集合，以及它们如何被 package 元数据、README 与自动回归共同约束
- `release-prep-consistency-and-helper-script-boundary-v1.md`
  - 定义 frozen trial scope 下当前 release prep 第三阶段允许的一致性检查集合、允许的最小辅助脚本集合，以及明确禁止的检查与辅助脚本集合
- `release-prep-final-implementation-entry-boundary-v1.md`
  - 定义 frozen trial scope 下当前 release prep 第四阶段已允许进入的最小实施入口、仍明确禁止的实施动作，以及进入后续阶段的最小触发条件
- `release-prep-final-closure-judgement-v1.md`
  - 定义当前 frozen trial scope 下四个 release-prep 阶段完成后，是否已经可以结束本轮 trial-scope release prep，以及结束后下一步应转向哪里
- `private-trial-vs-release-strategy-judgement-v1.md`
  - 定义当前是否应继续停留在 `private / in-repo trial`，还是已经值得进入更高层发布策略评估，以及在策略结论形成前当前 package 应继续保持的现实边界
- `release-strategy-target-tier-evaluation-v1.md`
  - 定义 Harness future package 的候选发布层级、当前最现实的目标层级，以及从当前状态推进到该层最少还差什么
- `harness-independent-project-hosting-evaluation-v1.md`
  - 定义 Harness 是否已不再适合长期由当前业务仓库承载、是否应启动独立项目承载路线，以及最小迁出边界的大方向判断
- `harness-independent-project-migration-boundary-plan-v1.md`
  - 定义 Harness 独立项目迁出时最小应迁出的资产、当前业务仓库应保留的 `consumer / integration` 资产，以及迁出后双方职责分层
- `private-registry-package-target-requirements-v1.md`
  - 定义 Harness 若以 `private registry package` 为目标层级时，所需的元数据、API 稳定性与发布前条件，以及当前已具备与仍缺失的部分
- `private-registry-package-metadata-strategy-v1.md`
  - 定义 Harness 若继续推进到 `private registry package` 时，元数据应如何分为必备字段、条件性字段与暂不引入字段，以及当前仍缺哪些策略结论
- `private-registry-package-conditional-metadata-judgement-v1.md`
  - 定义 `publishConfig / main / types / source map` 在 `private registry package` 目标层级下分别是需要、暂不需要还是延后判断
- `private-registry-package-publishconfig-strategy-v1.md`
  - 定义 `publishConfig` 在 `private registry package` 目标层级下为什么需要、它应约束哪些发布行为，以及它与 current trial / future public 的边界差异
- `private-registry-package-types-strategy-v1.md`
  - 定义 `types` 在 `private registry package` 目标层级下为什么需要、至少应覆盖哪些 frozen public API 入口，以及它与 current trial / future public 的边界差异
- `private-registry-package-main-compatibility-judgement-v1.md`
  - 定义 `main` 在 `private registry package` 目标层级下为什么仍应延后判断、`exports` 为什么不足以单独结束该问题，以及后续应在什么条件下重新判断
- `private-registry-package-main-reassessment-prerequisites-v1.md`
  - 定义在 `publishConfig`、`types`、类型产物与类型消费验证都已进入真实状态后，`main` 正式重判前至少还需要哪些消费环境与流程前置，以及何时才适合进入重判窗口
- `private-registry-package-registry-consumption-validation-v1.md`
  - 定义在安装态 package 语境下，`publishConfig / exports / types / .d.ts` 是否仍协同成立，以及这轮更高层消费验证对 `main` 重判窗口的实际影响
- `private-registry-package-internal-release-process-prerequisites-v1.md`
  - 定义 future `private registry package` 的组织内发布流程前置至少应分哪些阶段、每阶段允许什么与禁止什么，以及这套流程如何支撑 `main` 的正式重判
- `private-registry-package-metadata-implementation-sequencing-v1.md`
  - 定义从 frozen trial metadata 走到 `registry-ready metadata` 的推荐实施顺序，以及 `publishConfig / types / main / source map` 各自应在什么时序处理
- `private-registry-package-publishconfig-minimal-landing-plan-v1.md`
  - 定义 `publishConfig` 在 `private registry package` 目标层级下未来真正写入 `package.json` 时的最小字段形态、语义边界与最小验证出口
- `private-registry-package-types-minimal-implementation-plan-v1.md`
  - 定义 `types` 在 `private registry package` 目标层级下未来真正进入实现时的最小产物形态、入口映射关系与最小验证出口
- `private-registry-package-types-metadata-minimal-landing-plan-v1.md`
  - 定义 `types` 在 `private registry package` 目标层级下未来真正写入 `package.json` 时的最小字段形态、映射关系与最小验证出口

## 6. 明确不包含

本次不包含以下内容：

- 自动任务调度
- 状态存储系统
- 自动重试与异常分流引擎
- 独立任务平台
- 新一轮 FE-AI 正式标准编号体系

## 7. 后续演进建议

若该方案在真实任务中稳定运行，可继续按以下顺序演进：

1. 先试运行并验证最小运行时自动写入是否够用
2. 再视痛点决定是否补更完整的快照读写
3. 再补 review-ready / merge-ready 条件
4. 稳定后再上升为正式标准
