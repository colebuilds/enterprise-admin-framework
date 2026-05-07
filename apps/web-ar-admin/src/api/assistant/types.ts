/**
 * @description: 提交反馈 请求
 * @url: /api/ai/feedback
 * @name: CreateFeedbackDto
 */
export interface CreateFeedbackDto {
  /**
   * 消息ID
   */
  messageId: string;
  /**
   * 评分 (1-5)
   */
  rating: number;
  /**
   * 是否有帮助
   */
  helpful?: boolean;
  /**
   * 评论
   */
  comment?: string;
}

/**
 * @description: 提交反馈 响应
 * @url: /api/ai/feedback
 * @name: MessageFeedbackVO
 */
export interface MessageFeedbackVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * messageId
   */
  messageId: string;
  /**
   * rating
   */
  rating: number;
  /**
   * helpful
   */
  helpful?: Record<string, any>;
  /**
   * comment
   */
  comment?: Record<string, any>;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * updatedAt
   */
  updatedAt?: Date;
}

export type CreateFeedbackResponseVO = MessageFeedbackVO;

export interface IntentInfoVO {
  /**
   * 意图标识
   */
  intent: string;
  /**
   * 中文标签
   */
  labelZh: string;
  /**
   * 英文标签
   */
  labelEn: string;
  /**
   * 优先级
   */
  priority: number;
}

/**
 * @description: 获取支持的意图列表 响应
 * @url: /api/ai/feedback/intents
 * @name: IntentListResponseVO
 */
export type IntentListResponseVO = IntentInfoVO[];

export interface ChatContextDto {
  /**
   * 当前页面路径
   */
  pagePath?: string;
  /**
   * 模块名称
   */
  module?: string;
}

/**
 * @description: 发送消息（SSE 流式） 请求
 * @url: /api/ai/chat
 * @name: ChatRequestDto
 */
export interface ChatRequestDto {
  /**
   * 用户输入
   */
  prompt: string;
  /**
   * 会话ID，不传则自动创建
   */
  sessionId?: string;
  /**
   * 上下文信息
   */
  context?: ChatContextDto;
  /**
   * 当前回复是否在回答上一轮澄清问题
   */
  clarifyId?: string;
  /**
   * 用户选择的澄清选项 ID
   */
  clarifyOptionId?: string;
}

export interface TaskSocketConfigVO {
  /**
   * Socket.IO 服务路径
   */
  path: string;
  /**
   * Socket.IO 命名空间
   */
  namespace: string;
  /**
   * Socket.IO 传输方式
   */
  transports: string[];
  /**
   * 订阅事件名
   */
  subscribeEvent: string;
  /**
   * 取消订阅事件名
   */
  unsubscribeEvent: string;
  /**
   * 订阅成功事件名
   */
  subscribedEvent: string;
  /**
   * 取消订阅成功事件名
   */
  unsubscribedEvent: string;
  /**
   * 运行进度事件名
   */
  updateEvent: string;
  /**
   * 运行日志事件名
   */
  logEvent: string;
  /**
   * 运行完成事件名
   */
  doneEvent: string;
  /**
   * 运行异常事件名
   */
  errorEvent: string;
}

export interface ClarifyOptionVO {
  /**
   * 选项 ID
   */
  id: string;
  /**
   * 选项文案
   */
  label: string;
}

export interface ConflictingIntentVO {
  /**
   * 意图类型
   */
  intent: string;
  /**
   * 置信度
   */
  confidence: number;
}

export interface EscalationSignalVO {
  /**
   * 转人工类型
   */
  type: "negative_emotion" | "human_request" | "sensitive_topic";
  /**
   * 强度 0-1
   */
  intensity: number;
}

export interface AnswerReferenceVO {
  /**
   * 
   */
  id: string;
  /**
   * 
   */
  title: string;
  /**
   * 
   */
  path?: string;
  /**
   * 
   */
  score: number;
  /**
   * 
   */
  primarySource?: string;
}

export interface AnswerMetaVO {
  /**
   * 
   */
  confidenceScore: number;
  /**
   * 
   */
  confidenceLevel: "high" | "medium" | "low";
  /**
   * 
   */
  supportType: "semantic_cache" | "vector_cache" | "knowledge" | "analysis_context" | "fallback";
  /**
   * 
   */
  cacheHit: boolean;
  /**
   * 
   */
  documentCount: number;
  /**
   * 
   */
  noKnowledgeFallback: boolean;
  /**
   * 
   */
  references: AnswerReferenceVO[];
  /**
   * 
   */
  permissionWarnings?: string[];
}

/**
 * @description: 发送消息（SSE 流式） 响应
 * @url: /api/ai/chat
 * @name: SSEEventVO
 */
export interface SSEEventVO {
  /**
   * 事件类型
   */
  type: "session" | "thinking" | "intent" | "task" | "chunk" | "done" | "error";
  /**
   * 事件序号（同一 SSE 响应内单调递增）
   */
  seq?: number;
  /**
   * 会话ID（type=session）
   */
  sessionId?: string;
  /**
   * 追踪ID（type=intent, done）
   */
  traceId?: string;
  /**
   * 运行ID（type=task）
   */
  runId?: string;
  /**
   * 任务ID（type=task）
   */
  taskId?: string;
  /**
   * 运行模式（type=task）
   */
  mode?: "interactive" | "task";
  /**
   * 任务状态（type=task）
   */
  status?: Record<string, any>;
  /**
   * Planner 策略（type=task）
   */
  strategy?: string;
  /**
   * 轮询地址（type=task）
   */
  pollUrl?: string;
  /**
   * 任务进度传输协议（type=task）
   */
  transport?: string;
  /**
   * Socket.IO 订阅配置（type=task）
   */
  socket?: TaskSocketConfigVO;
  /**
   * 意图类型（type=intent）
   */
  intent?: string;
  /**
   * 意图置信度 0-1（type=intent）
   */
  confidence?: number;
  /**
   * 检测到的语言（type=intent）
   */
  locale?: "zh" | "en";
  /**
   * 行动建议（type=intent）
   */
  action?: "answer" | "clarify" | "escalate";
  /**
   * 澄清问题，当 action=clarify 时返回（type=intent）
   */
  clarifyQuestion?: string;
  /**
   * 澄清轮次 ID，当 action=clarify 时返回（type=intent）
   */
  clarifyId?: string;
  /**
   * 澄清选项，当 action=clarify 时返回（type=intent）
   */
  clarifyOptions?: ClarifyOptionVO[];
  /**
   * 冲突意图列表，当存在多个相近意图时返回（type=intent）
   */
  conflictingIntents?: ConflictingIntentVO[];
  /**
   * 转人工信号（type=intent）
   */
  escalation?: EscalationSignalVO;
  /**
   * 内容片段（type=chunk）
   */
  content?: string;
  /**
   * 助手消息ID（type=done）
   */
  messageId?: string;
  /**
   * 回答质量与引用信息（type=done）
   */
  answerMeta?: AnswerMetaVO;
  /**
   * 错误信息（type=error）
   */
  message?: string;
  /**
   * 错误码（type=error）
   */
  code?: "stream_conflict" | "rate_limit" | "tool_loop_exceeded" | "timeout" | "service_unavailable" | "internal_error";
  /**
   * 是否可重试（type=error）
   */
  retryable?: boolean;
  /**
   * 建议的重试等待秒数（type=error）
   */
  retryAfterSeconds?: number;
}

export interface AgentTaskVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * runId
   */
  runId: string;
  /**
   * stepId
   */
  stepId?: Record<string, any>;
  /**
   * queueName
   */
  queueName: string;
  /**
   * taskType
   */
  taskType: "analysis" | "approval_resume" | "action";
  /**
   * status
   */
  status?: "queued" | "running" | "completed" | "failed" | "cancelled" | "retrying";
  /**
   * jobId
   */
  jobId?: Record<string, any>;
  /**
   * payload
   */
  payload: Record<string, any>;
  /**
   * attempts
   */
  attempts?: Record<string, any>;
  /**
   * lastError
   */
  lastError?: Record<string, any>;
  /**
   * scheduledAt
   */
  scheduledAt?: Date;
  /**
   * startedAt
   */
  startedAt?: Date;
  /**
   * finishedAt
   */
  finishedAt?: Date;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * updatedAt
   */
  updatedAt: Date;
}

export interface RuntimeRunEventVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * runId
   */
  runId: string;
  /**
   * stepId
   */
  stepId?: Record<string, any>;
  /**
   * eventType
   */
  eventType: "plan_completed" | "task_created" | "task_queued" | "run_started" | "history_loaded" | "mcp_started" | "tool_started" | "tool_completed" | "tool_failed" | "mcp_completed" | "answer_started" | "answer_completed" | "run_completed" | "run_failed" | "clarify_requested" | "clarify_resolved" | "dag_started" | "dag_completed" | "step_completed";
  /**
   * level
   */
  level?: "info" | "warn" | "error";
  /**
   * title
   */
  title: string;
  /**
   * detail
   */
  detail?: Record<string, any>;
  /**
   * dataJson
   */
  dataJson?: Record<string, any>;
  /**
   * createdAt
   */
  createdAt?: Date;
}

export interface RuntimeStepVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * runId
   */
  runId: string;
  /**
   * stepIndex
   */
  stepIndex: number;
  /**
   * stepType
   */
  stepType: "clarify" | "retrieve_knowledge" | "query_tool" | "analyze" | "aggregate" | "answer" | "escalate" | "react";
  /**
   * goal
   */
  goal: string;
  /**
   * toolName
   */
  toolName?: Record<string, any>;
  /**
   * status
   */
  status?: "pending" | "queued" | "running" | "completed" | "failed" | "skipped" | "blocked";
  /**
   * inputJson
   */
  inputJson?: Record<string, any>;
  /**
   * outputJson
   */
  outputJson?: Record<string, any>;
  /**
   * resultSummary
   */
  resultSummary?: Record<string, any>;
  /**
   * retryCount
   */
  retryCount?: Record<string, any>;
  /**
   * requiresApproval
   */
  requiresApproval?: Record<string, any>;
  /**
   * approvalStatus
   */
  approvalStatus?: Record<string, any>;
  /**
   * dependsOn
   */
  dependsOn?: string[];
  /**
   * preset
   */
  preset?: Record<string, any>;
  /**
   * errorCode
   */
  errorCode?: Record<string, any>;
  /**
   * errorMessage
   */
  errorMessage?: Record<string, any>;
  /**
   * startedAt
   */
  startedAt?: Date;
  /**
   * completedAt
   */
  completedAt?: Date;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * updatedAt
   */
  updatedAt: Date;
  /**
   * 
   */
  tasks: AgentTaskVO[][];
  /**
   * 
   */
  events: RuntimeRunEventVO[][];
}

/**
 * @description: 获取任务运行详情 响应
 * @url: /api/ai/chat/runs/{runId}
 * @name: RuntimeRunVO
 */
export interface RuntimeRunVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * sessionId
   */
  sessionId: string;
  /**
   * triggerMessageId
   */
  triggerMessageId: string;
  /**
   * traceId
   */
  traceId?: Record<string, any>;
  /**
   * tenantId
   */
  tenantId?: Record<string, any>;
  /**
   * orgId
   */
  orgId?: Record<string, any>;
  /**
   * userId
   */
  userId: number;
  /**
   * intent
   */
  intent: string;
  /**
   * mode
   */
  mode: "interactive" | "task";
  /**
   * plannerStrategy
   */
  plannerStrategy: string;
  /**
   * goal
   */
  goal?: Record<string, any>;
  /**
   * state
   */
  state?: "received" | "planned" | "queued" | "running" | "waiting_approval" | "answering" | "completed" | "failed" | "cancelled";
  /**
   * planJson
   */
  planJson?: Record<string, any>;
  /**
   * contextJson
   */
  contextJson?: Record<string, any>;
  /**
   * currentStepIndex
   */
  currentStepIndex?: Record<string, any>;
  /**
   * finalAnswer
   */
  finalAnswer?: Record<string, any>;
  /**
   * finalSummary
   */
  finalSummary?: Record<string, any>;
  /**
   * errorCode
   */
  errorCode?: Record<string, any>;
  /**
   * errorMessage
   */
  errorMessage?: Record<string, any>;
  /**
   * planSource
   */
  planSource?: Record<string, any>;
  /**
   * planHash
   */
  planHash?: Record<string, any>;
  /**
   * startedAt
   */
  startedAt?: Date;
  /**
   * completedAt
   */
  completedAt?: Date;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * updatedAt
   */
  updatedAt: Date;
  /**
   * 
   */
  steps: RuntimeStepVO[][];
  /**
   * 
   */
  tasks: AgentTaskVO[][];
  /**
   * 
   */
  events: RuntimeRunEventVO[][];
}

export interface ChatMessageVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * sessionId
   */
  sessionId: string;
  /**
   * role
   */
  role: "user" | "assistant" | "system";
  /**
   * content
   */
  content: string;
  /**
   * locale
   */
  locale: string;
  /**
   * metadata
   */
  metadata?: Record<string, any>;
  /**
   * tokenCount
   */
  tokenCount?: Record<string, any>;
  /**
   * traceId
   */
  traceId?: Record<string, any>;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * 
   */
  feedbacks: MessageFeedbackVO[][];
  /**
   * 
   */
  triggeredRuns: RuntimeRunVO[][];
}

export interface SessionTopicVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * sessionId
   */
  sessionId: string;
  /**
   * tenantId
   */
  tenantId?: Record<string, any>;
  /**
   * subject
   */
  subject: string;
  /**
   * status
   */
  status?: "active" | "resolved" | "abandoned";
  /**
   * resolvedPath
   */
  resolvedPath?: Record<string, any>;
  /**
   * resolvedTitle
   */
  resolvedTitle?: Record<string, any>;
  /**
   * resolvedModule
   */
  resolvedModule?: Record<string, any>;
  /**
   * startTurn
   */
  startTurn: number;
  /**
   * endTurn
   */
  endTurn?: Record<string, any>;
  /**
   * turnCount
   */
  turnCount?: Record<string, any>;
  /**
   * entities
   */
  entities?: Record<string, any>;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * updatedAt
   */
  updatedAt: Date;
}

export interface SessionListItemVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * tenantId
   */
  tenantId?: Record<string, any>;
  /**
   * orgId
   */
  orgId?: Record<string, any>;
  /**
   * userId
   */
  userId: number;
  /**
   * title
   */
  title?: Record<string, any>;
  /**
   * locale
   */
  locale?: Record<string, any>;
  /**
   * state
   */
  state?: "active" | "awaiting_clarification" | "task_running" | "escalated";
  /**
   * stateJson
   */
  stateJson?: Record<string, any>;
  /**
   * activeTopicId
   */
  activeTopicId?: Record<string, any>;
  /**
   * topicCount
   */
  topicCount?: Record<string, any>;
  /**
   * turnCount
   */
  turnCount?: Record<string, any>;
  /**
   * lastResolvedPath
   */
  lastResolvedPath?: Record<string, any>;
  /**
   * createdAt
   */
  createdAt?: Date;
  /**
   * updatedAt
   */
  updatedAt: Date;
  /**
   * 
   */
  messages: ChatMessageVO[][];
  /**
   * 
   */
  runtimeRuns: RuntimeRunVO[][];
  /**
   * 
   */
  topics: SessionTopicVO[][];
  /**
   * 消息数量
   */
  messageCount: number;
}

/**
 * @description: 会话列表 响应
 * @url: /api/ai/chat/sessions
 * @name: PaginatedSessionDataVO
 */
export interface PaginatedSessionDataVO {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 会话列表
   */
  list: SessionListItemVO[];
}

export type PaginatedSessionResponseVO = PaginatedSessionDataVO;

/**
 * @description: 获取历史消息 响应
 * @url: /api/ai/chat/sessions/{sessionId}/messages
 * @name: PaginatedMessageDataVO
 */
export interface PaginatedMessageDataVO {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 消息列表
   */
  list: ChatMessageVO[];
}

export type PaginatedMessageResponseVO = PaginatedMessageDataVO;

/**
 * @description: 提交消息意图反馈 请求
 * @url: /api/ai/chat/messages/{messageId}/intent-feedback
 * @name: MessageIntentFeedbackDto
 */
export interface MessageIntentFeedbackDto {
  /**
   * 实际意图（用户纠正）
   */
  actualIntent?: string;
  /**
   * 用户是否满意
   */
  satisfied?: boolean;
}

export interface QuickQuestionItemVO {
  /**
   * 问题ID
   */
  id: string;
  /**
   * 问题内容
   */
  question: string;
  /**
   * 关联意图
   */
  intent?: string;
}

export interface FaqItemVO {
  /**
   * 问题ID
   */
  id: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 关联意图
   */
  intent?: string;
  /**
   * 外部链接
   */
  url?: string;
}

export interface WelcomeConfigVO {
  /**
   * 欢迎页徽标文本
   */
  badge: string;
  /**
   * 欢迎语
   */
  greeting: string;
  /**
   * 欢迎页说明文案
   */
  description: string;
  /**
   * 右侧面板眉标题
   */
  panelEyebrow: string;
  /**
   * 右侧面板标题
   */
  panelTitle: string;
  /**
   * 推荐入口区标题
   */
  sectionTitle: string;
  /**
   * 推荐入口区说明
   */
  sectionCopy: string;
  /**
   * 快速提问卡片标题
   */
  quickQuestionsTitle: string;
  /**
   * 快速提问卡片说明
   */
  quickQuestionsCopy: string;
  /**
   * 常见问题卡片标题
   */
  faqTitle: string;
  /**
   * 常见问题卡片说明
   */
  faqCopy: string;
  /**
   * 快速提问列表
   */
  quickQuestions: QuickQuestionItemVO[];
  /**
   * 常见问题列表
   */
  faqItems: FaqItemVO[];
  /**
   * 欢迎页能力标签
   */
  capabilities: string[];
  /**
   * 欢迎页引导描述
   */
  promptTips: string[];
}

export interface IntentOptionVO {
  /**
   * 意图值
   */
  value: string;
  /**
   * 意图标签
   */
  label: string;
}

export interface IntentsConfigVO {
  /**
   * 意图标签映射
   */
  labels: Record<string, any>;
  /**
   * 意图选项列表
   */
  options: IntentOptionVO[];
}

export interface InputConfigVO {
  /**
   * 最大输入长度
   */
  maxLength: number;
  /**
   * 占位符文本
   */
  placeholder: string;
  /**
   * 输入区提示标签
   */
  hintTags: string[];
  /**
   * 输入区提示标签标题
   */
  hintLabel: string;
  /**
   * 流式生成状态文案
   */
  streamingLabel: string;
}

/**
 * @description: 获取 AI 助手配置 响应
 * @url: /api/ai/chat/config
 * @name: AssistantConfigVO
 */
export interface AssistantConfigVO {
  /**
   * 欢迎页配置
   */
  welcome: WelcomeConfigVO;
  /**
   * 意图配置
   */
  intents: IntentsConfigVO;
  /**
   * 输入配置
   */
  input: InputConfigVO;
  /**
   * 免责声明
   */
  disclaimer: string;
}

export type AssistantConfigResponseVO = AssistantConfigVO;

export type GetRuntimeRunResponseVO = RuntimeRunVO;

/**
 * @description: 多语言翻译 请求
 * @url: /api/ai/admin/translate
 * @name: TranslateRequestDto
 */
export interface TranslateRequestDto {
  /**
   * 原始内容
   */
  content: string;
  /**
   * 目标语言列表
   */
  targetLanguages: string[];
  /**
   * 原始语言（可选，自动检测）
   */
  sourceLanguage?: string;
}

export interface TranslationItemDto {
  /**
   * 语言名称
   */
  languageName: string;
  /**
   * 翻译内容
   */
  content: string;
}

/**
 * @description: 多语言翻译 响应
 * @url: /api/ai/admin/translate
 * @name: TranslateResponseDto
 */
export interface TranslateResponseDto {
  /**
   * 原始内容
   */
  sourceContent: string;
  /**
   * 检测到的原始语言
   */
  sourceLanguage: string;
  /**
   * 翻译结果列表
   */
  translations: TranslationItemDto[];
}

export type TranslateResponseVO = TranslateResponseDto;

export interface RatingDistributionVO {
  /**
   * 1星数量
   */
  1?: number;
  /**
   * 2星数量
   */
  2?: number;
  /**
   * 3星数量
   */
  3?: number;
  /**
   * 4星数量
   */
  4?: number;
  /**
   * 5星数量
   */
  5?: number;
}

/**
 * @description: 反馈统计 响应
 * @url: /api/ai/admin/feedback/stats
 * @name: FeedbackStatsDataVO
 */
export interface FeedbackStatsDataVO {
  /**
   * 总反馈数
   */
  total: number;
  /**
   * 有帮助数量
   */
  helpful: number;
  /**
   * 无帮助数量
   */
  unhelpful: number;
  /**
   * 平均评分
   */
  avgRating: number;
  /**
   * 评分分布
   */
  ratingDistribution: RatingDistributionVO;
}

export type FeedbackStatsResponseVO = FeedbackStatsDataVO;

export interface MisclassificationVO {
  /**
   * 预测意图
   */
  predicted: string;
  /**
   * 实际意图
   */
  actual: string;
  /**
   * 次数
   */
  count: number;
}

export interface PlannerAccuracySummaryVO {
  /**
   * planner 总体准确率
   */
  overall: number;
  /**
   * 模式准确率
   */
  mode: number;
  /**
   * 策略准确率
   */
  strategy: number;
  /**
   * 页面关系准确率
   */
  pageRelation: number;
  /**
   * 目标提示准确率
   */
  targetHint: number;
}

export interface PlannerBreakdownVO {
  /**
   * mode 维度准确率明细
   */
  mode: Record<string, any>;
  /**
   * strategy 维度准确率明细
   */
  strategy: Record<string, any>;
  /**
   * pageRelation 维度准确率明细
   */
  pageRelation: Record<string, any>;
  /**
   * targetHint 维度准确率明细
   */
  targetHint: Record<string, any>;
}

export interface PlannerMisrouteVO {
  /**
   * 误路由维度
   */
  dimension: "mode" | "strategy" | "pageRelation" | "targetHint";
  /**
   * 预测值
   */
  predicted: string;
  /**
   * 实际值
   */
  actual: string;
  /**
   * 次数
   */
  count: number;
}

/**
 * @description: 意图识别统计 响应
 * @url: /api/ai/admin/feedback/intents/stats
 * @name: IntentFeedbackStatsVO
 */
export interface IntentFeedbackStatsVO {
  /**
   * 总记录数
   */
  total: number;
  /**
   * 已标注记录数
   */
  labeledTotal: number;
  /**
   * 准确率
   */
  accuracy: number;
  /**
   * 各意图准确率
   */
  intentAccuracy: Record<string, any>;
  /**
   * 常见误分类
   */
  commonMisclassifications: MisclassificationVO[];
  /**
   * planner 维度准确率汇总
   */
  plannerAccuracy: PlannerAccuracySummaryVO;
  /**
   * planner 维度准确率明细
   */
  plannerBreakdown: PlannerBreakdownVO;
  /**
   * 常见误路由
   */
  commonMisroutes: PlannerMisrouteVO[];
}

export type IntentFeedbackStatsResponseVO = IntentFeedbackStatsVO;

/**
 * @description: 标记工单已解决 请求
 * @url: /api/ai/admin/escalation/{id}/resolve
 * @name: ResolveEscalationDto
 */
export type ResolveEscalationDto = Record<string, unknown>;

export interface DocumentListItemDto {
  /**
   * ID
   */
  id: string;
  /**
   * 文档业务ID
   */
  docId: string;
  /**
   * 版本号
   */
  version: string;
  /**
   * 文档类型
   */
  type: "page" | "feature" | "api" | "faq" | "guide" | "glossary" | "component";
  /**
   * 所属模块
   */
  module: string;
  /**
   * 标签
   */
  tags: string[];
  /**
   * 标题
   */
  title: string;
  /**
   * 摘要
   */
  summary: string;
  /**
   * 是否激活
   */
  isActive: boolean;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * Q&A 数量
   */
  qaPairsCount: number;
  /**
   * 段落数量
   */
  sectionsCount: number;
}

/**
 * @description: 获取知识文档列表 响应
 * @url: /api/ai/knowledge/documents
 * @name: PaginatedDocumentDataDto
 */
export interface PaginatedDocumentDataDto {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 文档列表
   */
  list: DocumentListItemDto[];
}

export type PaginatedDocumentResponseVO = PaginatedDocumentDataDto;

export interface ComponentMetaDto {
  /**
   * Vue 组件文件路径
   */
  path: string;
  /**
   * 组件权限码列表
   */
  permissions?: string[];
  /**
   * 关联 API 名称列表
   */
  apis?: string[];
  /**
   * 导入的子组件路径
   */
  imports?: string[];
}

export interface DocumentMetadataDto {
  /**
   * 来源标识
   */
  source?: string;
  /**
   * 原始文件路径
   */
  sourceFile?: string;
  /**
   * 来源引用
   */
  sourceRefs?: string[];
  /**
   * 事实追踪 ID 列表
   */
  sourceFactIds?: string[];
  /**
   * 代码追踪引用
   */
  traceRefs?: string[];
  /**
   * 内容哈希
   */
  contentHash?: string;
  /**
   * Schema 版本号
   */
  schemaVersion?: string;
  /**
   * 生成器版本
   */
  generatorVersion?: string;
  /**
   * 置信度
   */
  confidence?: string;
  /**
   * 合并策略
   */
  mergePolicy?: string;
  /**
   * 作者
   */
  author?: string;
}

export interface DocumentRelationsDto {
  /**
   * 父模块 ID
   */
  parent?: string;
  /**
   * 子模块/页面 ID 列表
   */
  children?: string[];
  /**
   * 引用的子组件 ID 列表
   */
  components?: string[];
  /**
   * 被哪些页面使用
   */
  usedBy?: string[];
  /**
   * 相关文档 ID 列表
   */
  seeAlso?: string[];
}

export interface QAPairResponseDto {
  /**
   * ID
   */
  id: string;
  /**
   * Q&A 业务ID
   */
  qaId: string;
  /**
   * 主问题
   */
  question: string;
  /**
   * 问题变体
   */
  questionVariants: string[];
  /**
   * 回答内容
   */
  answer: string;
  /**
   * 回答类型
   */
  answerType: "text" | "steps" | "list" | "table" | "rich";
  /**
   * 额外上下文
   */
  context?: string;
  /**
   * 引用链接
   */
  references?: string[];
  /**
   * 意图分类
   */
  intent: "how_to" | "what_is" | "where_is" | "why" | "troubleshoot" | "compare" | "list";
  /**
   * 优先级
   */
  priority: number;
  /**
   * 向量ID
   */
  vectorId?: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

export interface DocumentSectionResponseDto {
  /**
   * ID
   */
  id: string;
  /**
   * 段落业务ID
   */
  sectionId: string;
  /**
   * 段落标题
   */
  title: string;
  /**
   * 段落内容
   */
  content: string;
  /**
   * 标题级别
   */
  level: number;
  /**
   * Token 数量
   */
  tokenCount?: number;
  /**
   * 向量ID
   */
  vectorId?: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 获取知识文档详情 响应
 * @url: /api/ai/knowledge/documents/{id}
 * @name: DocumentResponseDto
 */
export interface DocumentResponseDto {
  /**
   * ID
   */
  id: string;
  /**
   * 文档业务ID
   */
  docId: string;
  /**
   * 版本号
   */
  version: string;
  /**
   * 文档类型
   */
  type: "page" | "feature" | "api" | "faq" | "guide" | "glossary" | "component";
  /**
   * 所属模块
   */
  module: string;
  /**
   * 标签
   */
  tags: string[];
  /**
   * 页面路径
   */
  pagePath?: string;
  /**
   * 面包屑
   */
  pageBreadcrumb?: string[];
  /**
   * 页面权限
   */
  pagePermissions?: string[];
  /**
   * 组件路径
   */
  pageComponent?: string;
  /**
   * 页面功能点
   */
  pageFeatures?: string[];
  /**
   * 组件元信息
   */
  componentMeta?: ComponentMetaDto;
  /**
   * 生成工具元信息
   */
  metadata?: DocumentMetadataDto;
  /**
   * 标题
   */
  title: string;
  /**
   * 摘要
   */
  summary: string;
  /**
   * 原始 Markdown
   */
  markdown?: string;
  /**
   * 父文档ID
   */
  parentId?: string;
  /**
   * 相关文档ID列表
   */
  relatedDocs: string[];
  /**
   * 文档关系信息
   */
  relations?: DocumentRelationsDto;
  /**
   * 来源
   */
  source: string;
  /**
   * 原始文件路径
   */
  sourceFile?: string;
  /**
   * 内容哈希
   */
  contentHash: string;
  /**
   * 是否激活
   */
  isActive: boolean;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
  /**
   * Q&A 列表
   */
  qaPairs?: QAPairResponseDto[];
  /**
   * 段落列表
   */
  sections?: DocumentSectionResponseDto[];
}

export type GetDocumentResponseVO = DocumentResponseDto;

/**
 * @description: 混合检索知识库 请求
 * @url: /api/ai/knowledge/search
 * @name: SearchRequestDto
 */
export interface SearchRequestDto {
  /**
   * 搜索查询
   */
  query: string;
  /**
   * 限定模块
   */
  modules?: string[];
  /**
   * 返回数量
   */
  topK?: number;
  /**
   * Q&A 权重
   */
  qaWeight?: number;
  /**
   * 文档权重
   */
  docWeight?: number;
}

export interface SearchResultItemDto {
  /**
   * 结果ID
   */
  id: string;
  /**
   * 结果类型
   */
  type: "qa" | "doc";
  /**
   * 相关度分数
   */
  score: number;
  /**
   * 向量记录ID
   */
  vectorId: string;
  /**
   * Q&A 业务ID
   */
  qaId?: string;
  /**
   * 文档分段业务ID
   */
  sectionId?: string;
  /**
   * 文档信息
   */
  document: Record<string, any>;
  /**
   * 内容
   */
  content: Record<string, any>;
}

/**
 * @description: 混合检索知识库 响应
 * @url: /api/ai/knowledge/search
 * @name: SearchResponseDto
 */
export interface SearchResponseDto {
  /**
   * 搜索结果
   */
  results: SearchResultItemDto[];
  /**
   * 搜索耗时(ms)
   */
  searchTime: number;
}

export type SearchKnowledgeResponseVO = SearchResponseDto;

export interface SectionDto {
  /**
   * 段落ID
   */
  id: string;
  /**
   * 段落标题
   */
  title: string;
  /**
   * 段落内容
   */
  content: string;
  /**
   * 标题级别 (1-6)
   */
  level: number;
  /**
   * Token 数量
   */
  tokens?: number;
}

export interface ContentInfoDto {
  /**
   * 原始 Markdown
   */
  markdown: string;
  /**
   * 段落列表（可选，不传时由后台从 markdown 自动切片）
   */
  sections?: SectionDto[];
}

export interface ReferenceDto {
  /**
   * 引用类型
   */
  type: "page" | "doc" | "api" | "link";
  /**
   * 引用目标
   */
  target: string;
  /**
   * 引用标签
   */
  label: string;
}

export interface QAPairDto {
  /**
   * Q&A ID
   */
  id: string;
  /**
   * 主问题
   */
  question: string;
  /**
   * 问题变体
   */
  questionVariants?: string[];
  /**
   * 回答内容
   */
  answer: string;
  /**
   * 回答类型
   */
  answerType: "text" | "steps" | "list" | "table" | "rich";
  /**
   * 额外上下文
   */
  context?: string;
  /**
   * 引用链接
   */
  references?: ReferenceDto[];
  /**
   * 意图分类
   */
  intent: "how_to" | "what_is" | "where_is" | "why" | "troubleshoot" | "compare" | "list";
  /**
   * 优先级 (1-10)
   */
  priority: number;
}

export interface FeatureInfoDto {
  /**
   * 功能ID
   */
  id: string;
  /**
   * 功能名称
   */
  name: string;
  /**
   * 功能描述
   */
  description?: string;
  /**
   * 所需权限
   */
  permission?: string;
  /**
   * 页面位置
   */
  location?: string;
}

export interface PageInfoDto {
  /**
   * 路由路径
   */
  path: string;
  /**
   * 面包屑
   */
  breadcrumb: string[];
  /**
   * 页面操作权限
   */
  permissions: string[];
  /**
   * 路由访问权限
   */
  routePermissions?: string[];
  /**
   * 组件路径
   */
  component?: string;
  /**
   * 页面功能点
   */
  features?: FeatureInfoDto[];
}

export interface CreateDocumentDto {
  /**
   * 文档业务唯一 ID
   */
  id: string;
  /**
   * 文档版本号
   */
  version?: string;
  /**
   * 文档类型
   */
  type: "page" | "feature" | "api" | "faq" | "guide" | "glossary" | "component";
  /**
   * 所属业务模块
   */
  module: string;
  /**
   * 标签列表
   */
  tags?: string[];
  /**
   * 文档标题
   */
  title: string;
  /**
   * 文档摘要（一句话描述）
   */
  summary: string;
  /**
   * 文档正文内容（markdown 必填，sections 可选由后台自动切片）
   */
  content: ContentInfoDto;
  /**
   * 预生成的问答对列表（前端生成工具产出，不传时仅用 sections 检索）
   */
  qa?: QAPairDto[];
  /**
   * type=page 时的页面信息（路径、面包屑、权限、功能点）
   */
  page?: PageInfoDto;
  /**
   * type=component 时的组件元信息（路径、权限、API、依赖）
   */
  component?: ComponentMetaDto;
  /**
   * 父文档 ID
   */
  parentId?: string;
  /**
   * 相关文档 ID 列表
   */
  relatedDocs?: string[];
  /**
   * 文档关系（children、parent、components、usedBy、seeAlso）
   */
  relations?: DocumentRelationsDto;
  /**
   * 文档来源
   */
  source?: "manual" | "auto_generated" | "imported" | "converted";
  /**
   * 原始文件路径
   */
  sourceFile?: string;
  /**
   * 生成工具元信息（contentHash、generatorVersion、schemaVersion、confidence 等）
   */
  metadata?: DocumentMetadataDto;
}

/**
 * @description: 执行知识库同步 请求
 * @url: /api/ai/sync
 * @name: ExecuteSyncDto
 */
export interface ExecuteSyncDto {
  /**
   * 同步类型
   */
  syncType?: "full" | "incremental" | "single";
  /**
   * 是否删除本次同步范围内缺失的文档，仅建议全量同步时开启
   */
  deleteMissing?: boolean;
  /**
   * 同步来源标识，用于并发锁和日志归类
   */
  source?: string;
  /**
   * 删除缺失文档时限定的 source 范围，默认取同步文档中的 source 去重结果
   */
  pruneSources?: string[];
  /**
   * 待同步的知识文档列表
   */
  documents: CreateDocumentDto[];
  /**
   * 是否等待相关向量写入完成并切换到 ready 后再返回
   */
  waitForVectorReady?: boolean;
  /**
   * 等待向量 ready 的最长时间（毫秒）
   */
  waitTimeoutMs?: number;
  /**
   * 轮询向量状态的间隔（毫秒）
   */
  pollIntervalMs?: number;
}

export interface ExecuteSyncStatsVO {
  /**
   * 
   */
  docsAdded: number;
  /**
   * 
   */
  docsUpdated: number;
  /**
   * 
   */
  docsDeleted: number;
  /**
   * 
   */
  docsSkipped: number;
  /**
   * 
   */
  qaPairsAdded: number;
  /**
   * 
   */
  qaPairsUpdated: number;
  /**
   * 
   */
  sectionsAdded: number;
  /**
   * 
   */
  sectionsUpdated: number;
  /**
   * 
   */
  vectorsUpserted: number;
  /**
   * 
   */
  vectorsDeleted: number;
}

export interface SyncErrorItemVO {
  /**
   * 
   */
  file: string;
  /**
   * 
   */
  error: string;
}

/**
 * @description: 执行知识库同步 响应
 * @url: /api/ai/sync
 * @name: ExecuteSyncDataVO
 */
export interface ExecuteSyncDataVO {
  /**
   * 
   */
  syncType: "full" | "incremental" | "single";
  /**
   * 
   */
  status: "success" | "partial" | "failed";
  /**
   * 向量同步状态。queued 表示仅完成入队，completed 表示向量已 ready
   */
  vectorSyncStatus?: "queued" | "completed" | "partial" | "timeout";
  /**
   * 本次是否等待向量 ready 后再返回
   */
  waitedForVectorReady?: boolean;
  /**
   * 
   */
  stats: ExecuteSyncStatsVO;
  /**
   * 耗时（毫秒）
   */
  duration: number;
  /**
   * 错误摘要
   */
  error?: string;
  /**
   * 
   */
  errors?: SyncErrorItemVO[];
}

export type ExecuteSyncResponseVO = ExecuteSyncDataVO;

export interface KnowledgeSyncLogVO {
  /**
   * id
   */
  id?: Record<string, any>;
  /**
   * syncType
   */
  syncType: "full" | "incremental" | "single";
  /**
   * status
   */
  status: "success" | "partial" | "failed";
  /**
   * docsAdded
   */
  docsAdded?: Record<string, any>;
  /**
   * docsUpdated
   */
  docsUpdated?: Record<string, any>;
  /**
   * docsDeleted
   */
  docsDeleted?: Record<string, any>;
  /**
   * docsSkipped
   */
  docsSkipped?: Record<string, any>;
  /**
   * qaPairsAdded
   */
  qaPairsAdded?: Record<string, any>;
  /**
   * qaPairsUpdated
   */
  qaPairsUpdated?: Record<string, any>;
  /**
   * sectionsAdded
   */
  sectionsAdded?: Record<string, any>;
  /**
   * sectionsUpdated
   */
  sectionsUpdated?: Record<string, any>;
  /**
   * vectorsUpserted
   */
  vectorsUpserted?: Record<string, any>;
  /**
   * vectorsDeleted
   */
  vectorsDeleted?: Record<string, any>;
  /**
   * vectorSyncStatus
   */
  vectorSyncStatus?: Record<string, any>;
  /**
   * waitedForVectorReady
   */
  waitedForVectorReady?: Record<string, any>;
  /**
   * error
   */
  error?: Record<string, any>;
  /**
   * errors
   */
  errors?: Record<string, any>;
  /**
   * duration
   */
  duration: number;
  /**
   * createdAt
   */
  createdAt?: Date;
}

/**
 * @description: 同步日志 响应
 * @url: /api/ai/sync/logs
 * @name: PaginatedSyncLogDataVO
 */
export interface PaginatedSyncLogDataVO {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 同步日志列表
   */
  list: KnowledgeSyncLogVO[];
}

export type PaginatedSyncLogResponseVO = PaginatedSyncLogDataVO;

export interface KnowledgeIndexRebuildVO {
  /**
   * 
   */
  queued: number;
  /**
   * 
   */
  total: number;
}

/**
 * @description: 重建知识索引并重新入队向量化 响应
 * @url: /api/ai/sync/rebuild-index
 * @name: RebuildKnowledgeIndexDataVO
 */
export interface RebuildKnowledgeIndexDataVO {
  /**
   * 
   */
  indexRebuild: KnowledgeIndexRebuildVO;
}

export type RebuildKnowledgeIndexResponseVO = RebuildKnowledgeIndexDataVO;

/**
 * @description: 文案 AI 生成（SSE 流式） 请求
 * @url: /api/ai/content-gen/text
 * @name: ContentGenTextDto
 */
export interface ContentGenTextDto {
  /**
   * 操作类型
   */
  action: "generate" | "rewrite" | "expand" | "shorten" | "continue" | "translate" | "polish";
  /**
   * 选中的文本内容
   */
  content?: string;
  /**
   * 当前文档全文（续写时提供上下文）
   */
  documentContext?: string;
  /**
   * 用户附加指令
   */
  instruction?: string;
  /**
   * 模板类型（generate 时使用）：announcement/activity/rule/agent
   */
  templateType?: string;
  /**
   * 模板参数（generate 时使用）
   */
  templateParams?: Record<string, any>;
  /**
   * 目标语言（translate 时使用）
   */
  targetLanguage?: string;
}

export interface MetricWithChangeVO {
  /**
   * 当前值
   */
  value: number;
  /**
   * 变化百分比 (绝对值)
   */
  change: number;
  /**
   * 变化类型
   */
  changeType: "up" | "down" | "neutral";
  /**
   * 健康状态
   */
  status?: "healthy" | "warning" | "critical";
}

export interface OverviewStatsDataVO {
  /**
   * 会话统计
   */
  sessions: MetricWithChangeVO;
  /**
   * 消息统计
   */
  messages: MetricWithChangeVO;
  /**
   * 活跃用户数
   */
  activeUsers: MetricWithChangeVO;
  /**
   * 满意度 (%)
   */
  satisfaction: MetricWithChangeVO;
  /**
   * 转人工数
   */
  escalations: MetricWithChangeVO;
  /**
   * Token 消耗
   */
  tokenUsage: MetricWithChangeVO;
}

export interface UsageTrendPointVO {
  /**
   * 会话数
   */
  sessions: number;
  /**
   * 消息数
   */
  messages: number;
  /**
   * 用户数
   */
  users: number;
}

export interface UsageTrendTotalsVO {
  /**
   * 会话总数
   */
  sessions: number;
  /**
   * 消息总数
   */
  messages: number;
  /**
   * 用户总数
   */
  users: number;
}

export interface UsageTrendDataVO {
  /**
   * 趋势数据点
   */
  data: UsageTrendPointVO[];
  /**
   * 总计
   */
  totals: UsageTrendTotalsVO;
}

export interface TenantDistributionItemVO {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 会话数
   */
  sessions: number;
  /**
   * 用户数
   */
  users: number;
  /**
   * 占比 (%)
   */
  percentage: number;
  /**
   * 相较上一周期变化 (%)
   */
  change: number;
}

export interface TenantDistributionTotalsVO {
  /**
   * 会话总数
   */
  sessions: number;
  /**
   * 用户总数
   */
  users: number;
}

export interface TenantDistributionDataVO {
  /**
   * 分布数据
   */
  data: TenantDistributionItemVO[];
  /**
   * 总计
   */
  totals: TenantDistributionTotalsVO;
}

export interface RatingDistributionItemVO {
  /**
   * 评分 (1-5)
   */
  rating: number;
  /**
   * 数量
   */
  count: number;
  /**
   * 占比 (%)
   */
  percentage: number;
}

export interface HelpfulStatsVO {
  /**
   * 有帮助数
   */
  helpful: number;
  /**
   * 无帮助数
   */
  notHelpful: number;
  /**
   * 未响应数
   */
  noResponse: number;
}

export interface TrendPointVO {
  /**
   * 数值
   */
  value: number;
}

export interface ReportFeedbackStatsDataVO {
  /**
   * 总反馈数
   */
  total: number;
  /**
   * 满意度 (%)
   */
  satisfactionRate: number;
  /**
   * 评分分布
   */
  ratingDistribution: RatingDistributionItemVO[];
  /**
   * Helpful 统计
   */
  helpfulStats: HelpfulStatsVO;
  /**
   * 趋势数据
   */
  trend: TrendPointVO[];
}

export interface NegativeFeedbackItemVO {
  /**
   * 反馈ID
   */
  id: string;
  /**
   * 消息ID
   */
  messageId: string;
  /**
   * 会话ID
   */
  sessionId: string;
  /**
   * 评分 (1-5)
   */
  rating: number;
  /**
   * 是否有帮助
   */
  helpful?: Record<string, any>;
  /**
   * 用户评论
   */
  comment?: Record<string, any>;
  /**
   * 用户问题
   */
  query: string;
  /**
   * AI 回答
   */
  answer: string;
  /**
   * 创建时间 (ISO 格式)
   */
  createdAt: string;
}

export interface DistributionItemVO {
  /**
   * 名称/标签
   */
  name: string;
  /**
   * 数量
   */
  value: number;
  /**
   * 占比 (%)
   */
  percentage: number;
}

export interface IntentDistributionDataVO {
  /**
   * 分布数据
   */
  data: DistributionItemVO[];
  /**
   * 总数
   */
  total: number;
}

export interface AccuracyBySourceVO {
  /**
   * 分类来源
   */
  source: string;
  /**
   * 总数
   */
  total: number;
  /**
   * 正确数
   */
  correct: number;
  /**
   * 准确率 (%)
   */
  accuracy: number;
}

export interface AccuracyByIntentVO {
  /**
   * 意图类型
   */
  intent: string;
  /**
   * 总数
   */
  total: number;
  /**
   * 正确数
   */
  correct: number;
  /**
   * 准确率 (%)
   */
  accuracy: number;
}

export interface ConfidenceDistributionItemVO {
  /**
   * 置信度范围
   */
  range: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 准确率 (%)
   */
  accuracy: number;
}

export interface UserSatisfactionVO {
  /**
   * 满意数
   */
  satisfied: number;
  /**
   * 不满意数
   */
  unsatisfied: number;
  /**
   * 未响应数
   */
  noResponse: number;
  /**
   * 满意率 (%)
   */
  rate: number;
}

export interface IntentAccuracyDataVO {
  /**
   * 总体准确率 (%)
   */
  overallAccuracy: number;
  /**
   * 按来源准确率
   */
  bySource: AccuracyBySourceVO[];
  /**
   * 按意图准确率
   */
  byIntent: AccuracyByIntentVO[];
  /**
   * 置信度分布
   */
  confidenceDistribution: ConfidenceDistributionItemVO[];
  /**
   * 用户满意度
   */
  userSatisfaction: UserSatisfactionVO;
}

export interface PlannerTrendPointVO {
  /**
   * 时间标签
   */
  label: string;
  /**
   * 已标注数
   */
  totalLabeled: number;
  /**
   * 整体准确率 (%)
   */
  overallAccuracy: number;
}

export interface PlannerBreakdownItemVO {
  /**
   * 维度值
   */
  name: string;
  /**
   * 正确数量
   */
  correct: number;
  /**
   * 总数量
   */
  total: number;
  /**
   * 准确率 (%)
   */
  accuracy: number;
}

export interface PlannerBreakdownDataVO {
  /**
   * 
   */
  mode: PlannerBreakdownItemVO[];
  /**
   * 
   */
  strategy: PlannerBreakdownItemVO[];
  /**
   * 
   */
  pageRelation: PlannerBreakdownItemVO[];
  /**
   * 
   */
  targetHint: PlannerBreakdownItemVO[];
}

export interface PlannerMisrouteItemVO {
  /**
   * 误路由维度
   */
  dimension: "mode" | "strategy" | "pageRelation" | "targetHint";
  /**
   * 预测值
   */
  predicted: string;
  /**
   * 实际值
   */
  actual: string;
  /**
   * 出现次数
   */
  count: number;
}

/**
 * @description: 获取 planner 聚合统计 响应
 * @url: /api/ai/report/planner/stats
 * @name: PlannerStatsDataVO
 */
export interface PlannerStatsDataVO {
  /**
   * planner 汇总
   */
  summary: PlannerAccuracySummaryVO;
  /**
   * planner 趋势
   */
  trend: PlannerTrendPointVO[];
  /**
   * planner 分维度明细
   */
  breakdown: PlannerBreakdownDataVO;
  /**
   * 常见误路由
   */
  commonMisroutes: PlannerMisrouteItemVO[];
}

export interface EscalationSummaryVO {
  /**
   * 转人工总数
   */
  total: number;
  /**
   * 转人工率 (%)
   */
  rate: number;
  /**
   * 已解决数量
   */
  resolved: number;
  /**
   * 待处理数量
   */
  pending: number;
  /**
   * 已分配数量
   */
  assigned: number;
  /**
   * 已取消数量
   */
  cancelled: number;
  /**
   * 平均解决时间 (分钟)
   */
  avgResolutionTimeMinutes?: Record<string, any>;
}

export interface TrendSeriesPointVO {
  /**
   * 展示标签
   */
  label: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 比率 (%)
   */
  rate?: number;
}

export interface RecentEscalationVO {
  /**
   * 记录ID
   */
  id: string;
  /**
   * 会话ID
   */
  sessionId: string;
  /**
   * 触发问题
   */
  query: string;
  /**
   * 转人工原因
   */
  reason: string;
  /**
   * 状态
   */
  status: string;
  /**
   * 识别意图
   */
  intent?: Record<string, any>;
  /**
   * 创建时间 (ISO 格式)
   */
  createdAt: string;
  /**
   * 解决时间 (ISO 格式)
   */
  resolvedAt?: Record<string, any>;
}

export interface EscalationStatsDataVO {
  /**
   * 汇总信息
   */
  summary: EscalationSummaryVO;
  /**
   * 按原因分布
   */
  byReason: DistributionItemVO[];
  /**
   * 按状态分布
   */
  byStatus: DistributionItemVO[];
  /**
   * 趋势数据
   */
  trend: TrendSeriesPointVO[];
  /**
   * 最近转人工记录
   */
  recent: RecentEscalationVO[];
}

export interface KnowledgeSummaryVO {
  /**
   * 文档总数
   */
  totalDocuments: number;
  /**
   * 激活文档数
   */
  activeDocuments: number;
  /**
   * Q&A 总数
   */
  totalQaPairs: number;
  /**
   * 时间范围内新增文档数
   */
  createdInRange: number;
  /**
   * 时间范围内更新文档数
   */
  updatedInRange: number;
  /**
   * 向量就绪率 (%)
   */
  vectorReadyRate: number;
}

export interface DocumentStatsVO {
  /**
   * 按类型分布
   */
  byType: DistributionItemVO[];
  /**
   * 按模块分布
   */
  byModule: DistributionItemVO[];
}

export interface QAPairStatsVO {
  /**
   * 按意图分布
   */
  byIntent: DistributionItemVO[];
}

export interface VectorStatsVO {
  /**
   * 按状态分布
   */
  byStatus: DistributionItemVO[];
}

export interface KnowledgeQueueSummaryVO {
  /**
   * 等待中的任务数
   */
  waiting: number;
  /**
   * 执行中的任务数
   */
  active: number;
  /**
   * 延迟中的任务数
   */
  delayed: number;
  /**
   * 失败任务数
   */
  failed: number;
  /**
   * 已完成任务数
   */
  completed: number;
  /**
   * 暂停任务数
   */
  paused: number;
  /**
   * 待消化任务总数
   */
  pending: number;
}

export interface KnowledgeQueueFailedJobVO {
  /**
   * 任务 ID
   */
  jobId: string;
  /**
   * 业务文档 ID
   */
  docId?: string;
  /**
   * 文档主键 ID
   */
  documentId?: string;
  /**
   * 失败时间 (ISO 格式)
   */
  failedAt?: Record<string, any>;
  /**
   * 失败原因
   */
  reason?: Record<string, any>;
}

export interface KnowledgeQueueDiagnosticsVO {
  /**
   * 最老等待任务的排队时长（秒）
   */
  oldestWaitingAgeSeconds?: Record<string, any>;
  /**
   * 最老延迟任务的排队时长（秒）
   */
  oldestDelayedAgeSeconds?: Record<string, any>;
  /**
   * 当前执行中的业务文档 ID 列表
   */
  activeDocIds: string[];
  /**
   * 最近失败任务
   */
  latestFailedJob?: KnowledgeQueueFailedJobVO;
}

export interface KnowledgeQueueStatsVO {
  /**
   * 知识队列汇总
   */
  summary: KnowledgeQueueSummaryVO;
  /**
   * 知识队列诊断
   */
  diagnostics: KnowledgeQueueDiagnosticsVO;
}

export interface KnowledgeSyncSummaryVO {
  /**
   * 同步次数
   */
  totalRuns: number;
  /**
   * 成功次数
   */
  successfulRuns: number;
  /**
   * 部分成功次数
   */
  partialRuns: number;
  /**
   * 失败次数
   */
  failedRuns: number;
  /**
   * 成功率 (%)
   */
  successRate: number;
  /**
   * 平均耗时 (ms)
   */
  avgDuration: number;
  /**
   * 向量写入总数
   */
  vectorsUpserted: number;
  /**
   * 向量删除总数
   */
  vectorsDeleted: number;
}

export interface KnowledgeSyncTrendPointVO {
  /**
   * 展示标签
   */
  label: string;
  /**
   * 同步次数
   */
  count: number;
  /**
   * 失败次数
   */
  failedCount: number;
  /**
   * 平均耗时 (ms)
   */
  avgDuration: number;
  /**
   * 向量写入数
   */
  vectorsUpserted: number;
  /**
   * 成功率 (%)
   */
  successRate: number;
}

export interface SyncRecentItemVO {
  /**
   * 同步ID
   */
  id: string;
  /**
   * 同步类型
   */
  syncType: string;
  /**
   * 同步状态
   */
  status: string;
  /**
   * 新增文档数
   */
  docsAdded: number;
  /**
   * 更新文档数
   */
  docsUpdated: number;
  /**
   * 删除文档数
   */
  docsDeleted: number;
  /**
   * 跳过文档数
   */
  docsSkipped: number;
  /**
   * 新增问答数
   */
  qaPairsAdded: number;
  /**
   * 更新问答数
   */
  qaPairsUpdated: number;
  /**
   * 新增段落数
   */
  sectionsAdded: number;
  /**
   * 更新段落数
   */
  sectionsUpdated: number;
  /**
   * 向量写入数
   */
  vectorsUpserted: number;
  /**
   * 向量删除数
   */
  vectorsDeleted: number;
  /**
   * 向量同步状态
   */
  vectorSyncStatus?: "queued" | "completed" | "partial" | "timeout";
  /**
   * 本次是否等待向量 ready 后再返回
   */
  waitedForVectorReady: boolean;
  /**
   * 耗时 (ms)
   */
  duration: number;
  /**
   * 错误信息
   */
  error?: Record<string, any>;
  /**
   * 创建时间 (ISO 格式)
   */
  createdAt: string;
}

export interface KnowledgeSyncStatsVO {
  /**
   * 同步汇总信息
   */
  summary: KnowledgeSyncSummaryVO;
  /**
   * 按状态分布
   */
  byStatus: DistributionItemVO[];
  /**
   * 按类型分布
   */
  byType: DistributionItemVO[];
  /**
   * 同步趋势
   */
  trend: KnowledgeSyncTrendPointVO[];
  /**
   * 最近同步任务
   */
  recent: SyncRecentItemVO[];
}

export interface RecentSyncVO {
  /**
   * 同步ID
   */
  id: string;
  /**
   * 同步类型
   */
  syncType: string;
  /**
   * 同步状态
   */
  status: string;
  /**
   * 新增文档数
   */
  docsAdded: number;
  /**
   * 更新文档数
   */
  docsUpdated: number;
  /**
   * 删除文档数
   */
  docsDeleted: number;
  /**
   * 向量同步状态
   */
  vectorSyncStatus?: "queued" | "completed" | "partial" | "timeout";
  /**
   * 本次是否等待向量 ready 后再返回
   */
  waitedForVectorReady: boolean;
  /**
   * 耗时 (ms)
   */
  duration: number;
  /**
   * 创建时间 (ISO 格式)
   */
  createdAt: string;
}

export interface KnowledgeStatsDataVO {
  /**
   * 汇总信息
   */
  summary: KnowledgeSummaryVO;
  /**
   * 文档统计
   */
  documents: DocumentStatsVO;
  /**
   * Q&A 统计
   */
  qaPairs: QAPairStatsVO;
  /**
   * 向量统计
   */
  vector: VectorStatsVO;
  /**
   * 知识队列统计
   */
  queue: KnowledgeQueueStatsVO;
  /**
   * 同步统计
   */
  sync: KnowledgeSyncStatsVO;
  /**
   * 最近同步信息
   */
  recentSync?: RecentSyncVO;
}

export interface CostTrendPointVO {
  /**
   * Token 数量
   */
  tokens: number;
  /**
   * 成本 (USD)
   */
  cost: number;
}

export interface CostTotalsVO {
  /**
   * Token 总数
   */
  tokens: number;
  /**
   * 总成本 (USD)
   */
  cost: number;
}

export interface CostByRoleVO {
  /**
   * 角色 (user/assistant)
   */
  role: string;
  /**
   * Token 数量
   */
  tokens: number;
  /**
   * 占比 (%)
   */
  percentage: number;
}

export interface CostTrendDataVO {
  /**
   * 趋势数据点
   */
  data: CostTrendPointVO[];
  /**
   * 总计
   */
  totals: CostTotalsVO;
  /**
   * 按角色分布
   */
  byRole: CostByRoleVO[];
}

export interface ToolStatsItemVO {
  /**
   * 工具名称
   */
  name: string;
  /**
   * 调用总数
   */
  totalCalls: number;
  /**
   * 成功率 (0-1)
   */
  successRate: number;
  /**
   * 平均延迟 (ms)
   */
  avgLatencyMs: number;
}

export interface ToolExecutionStatsDataVO {
  /**
   * 总执行数
   */
  totalExecutions: number;
  /**
   * 各工具统计
   */
  tools: ToolStatsItemVO[];
}

export interface DotTypeDistributionItemVO {
  /**
   * 打点类型
   */
  type: string;
  /**
   * 数量
   */
  count: number;
}

export interface DotStatsVO {
  /**
   * 打点总数
   */
  total: number;
  /**
   * 按类型分布
   */
  byType: DotTypeDistributionItemVO[];
}

export interface MemoryStatsDataVO {
  /**
   * 打点统计
   */
  dots: DotStatsVO;
  /**
   * 反思记录数
   */
  reflections: number;
  /**
   * 会话摘要数
   */
  sessionSummaries: number;
}

export interface PlanSourceItemVO {
  /**
   * 来源 (preset | llm | cached)
   */
  source: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 占比 (0-1)
   */
  ratio: number;
}

export interface PresetStatsDataVO {
  /**
   * 总数
   */
  total: number;
  /**
   * 按来源分布
   */
  bySource: PlanSourceItemVO[];
}

export interface RetrievalQualityStatsDataVO {
  /**
   * 总请求数
   */
  total: number;
  /**
   * 命中率 (0-1)
   */
  hitRate: number;
  /**
   * 平均文档数
   */
  avgDocumentCount: number;
  /**
   * 零命中次数
   */
  zeroHitCount: number;
}

export interface MemoryTrendItemVO {
  /**
   * 日期
   */
  date: string;
  /**
   * 打点数
   */
  count: number;
}

export interface MemoryTrendStatsDataVO {
  /**
   * 每日趋势
   */
  trend: MemoryTrendItemVO[];
}

export interface ReflectionTypeItemVO {
  /**
   * 教训类型
   */
  type: string;
  /**
   * 数量
   */
  count: number;
}

export interface ReflectionEffectivenessDataVO {
  /**
   * 反思总数
   */
  total: number;
  /**
   * 被召回总次数
   */
  totalRetrieved: number;
  /**
   * 有帮助总次数
   */
  totalHelpful: number;
  /**
   * 有帮助率
   */
  helpfulRate?: Record<string, any>;
  /**
   * 按类型分布
   */
  topTypes: ReflectionTypeItemVO[];
}

export interface ModelCostItemVO {
  /**
   * 模型名称
   */
  model: string;
  /**
   * 调用次数
   */
  calls: number;
  /**
   * 总 Token
   */
  totalTokens: number;
  /**
   * 总成本
   */
  totalCost: number;
}

export interface ModelCostBreakdownDataVO {
  /**
   * 按模型拆分
   */
  models: ModelCostItemVO[];
}

/**
 * @description: 获取 RAG 看板快照 响应
 * @url: /api/ai/report/dashboard/snapshot
 * @name: DashboardSnapshotDataVO
 */
export interface DashboardSnapshotDataVO {
  /**
   * 概览统计
   */
  overview: OverviewStatsDataVO;
  /**
   * 使用趋势
   */
  usageTrend: UsageTrendDataVO;
  /**
   * 租户分布
   */
  tenantDistribution: TenantDistributionDataVO;
  /**
   * 反馈统计
   */
  feedbackStats: ReportFeedbackStatsDataVO;
  /**
   * 负面反馈预览
   */
  negativeFeedback: NegativeFeedbackItemVO[];
  /**
   * 意图分布
   */
  intentDistribution: IntentDistributionDataVO;
  /**
   * 意图准确率
   */
  intentAccuracy: IntentAccuracyDataVO;
  /**
   * planner 统计
   */
  plannerStats: PlannerStatsDataVO;
  /**
   * 转人工统计
   */
  escalationStats: EscalationStatsDataVO;
  /**
   * 知识库统计
   */
  knowledgeStats: KnowledgeStatsDataVO;
  /**
   * 成本趋势
   */
  costTrend: CostTrendDataVO;
  /**
   * 工具调用统计
   */
  toolExecutionStats: ToolExecutionStatsDataVO;
  /**
   * 记忆系统统计
   */
  memoryStats: MemoryStatsDataVO;
  /**
   * Preset 命中率
   */
  presetStats: PresetStatsDataVO;
  /**
   * 检索质量统计
   */
  retrievalQuality: RetrievalQualityStatsDataVO;
  /**
   * 记忆打点趋势
   */
  memoryTrend: MemoryTrendStatsDataVO;
  /**
   * 反思有效性
   */
  reflectionEffectiveness: ReflectionEffectivenessDataVO;
  /**
   * 模型成本拆分
   */
  modelCostBreakdown: ModelCostBreakdownDataVO;
}

export type DashboardSnapshotResponseVO = DashboardSnapshotDataVO;

export type PlannerStatsResponseVO = PlannerStatsDataVO;

export interface AlertThresholdDto {
  /**
   * 预警阈值
   */
  warning: number;
  /**
   * 严重阈值
   */
  critical: number;
}

export interface AlertNotificationDto {
  /**
   * 是否启用通知
   */
  enabled: boolean;
  /**
   * 通知渠道
   */
  channels: string[];
}

/**
 * @description: 获取告警配置 响应
 * @url: /api/ai/report/alerts/config
 * @name: AlertConfigDataVO
 */
export interface AlertConfigDataVO {
  /**
   * 忠实度阈值
   */
  faithfulness: AlertThresholdDto;
  /**
   * 命中率阈值
   */
  hitRate: AlertThresholdDto;
  /**
   * 延迟阈值 (ms)
   */
  latencyMs: AlertThresholdDto;
  /**
   * 通知配置
   */
  notifications: AlertNotificationDto;
}

export type AlertConfigResponseVO = AlertConfigDataVO;

/**
 * @description: 更新告警配置 请求
 * @url: /api/ai/report/alerts/config
 * @name: UpdateAlertConfigDto
 */
export interface UpdateAlertConfigDto {
  /**
   * 忠实度阈值
   */
  faithfulness: AlertThresholdDto;
  /**
   * 命中率阈值
   */
  hitRate: AlertThresholdDto;
  /**
   * 延迟阈值 (ms)
   */
  latencyMs: AlertThresholdDto;
  /**
   * 通知配置
   */
  notifications: AlertNotificationDto;
}

export interface SessionInfoVO {
  /**
   * 
   */
  id: string;
  /**
   * 
   */
  title?: string;
  /**
   * 
   */
  userId: number;
  /**
   * 
   */
  tenantId: number;
  /**
   * 
   */
  state: string;
  /**
   * 
   */
  stateJson?: Record<string, any>;
  /**
   * 
   */
  createdAt: Date;
  /**
   * 
   */
  updatedAt: Date;
}

export interface MessageTraceVO {
  /**
   * 
   */
  traceId: string;
  /**
   * 
   */
  intent?: string;
  /**
   * 
   */
  confidence?: number;
  /**
   * 
   */
  status?: string;
  /**
   * 
   */
  latency?: number;
  /**
   * 
   */
  retrievalTime?: number;
  /**
   * 
   */
  generationTime?: number;
  /**
   * 
   */
  faithfulness?: number;
  /**
   * 
   */
  chunkCount?: number;
  /**
   * 
   */
  model?: string;
  /**
   * 
   */
  tokens?: Record<string, any>;
  /**
   * 
   */
  error?: Record<string, any>;
}

export interface AgentStepVO {
  /**
   * 
   */
  stepIndex: number;
  /**
   * 
   */
  type: string;
  /**
   * 
   */
  goal: string;
  /**
   * 
   */
  toolName?: string;
  /**
   * 
   */
  preset?: string;
  /**
   * 
   */
  status: string;
  /**
   * 
   */
  summary?: string;
  /**
   * 
   */
  retryCount?: number;
  /**
   * 
   */
  error?: Record<string, any>;
  /**
   * 
   */
  durationMs?: Record<string, any>;
}

export interface AgentEventVO {
  /**
   * 
   */
  type: string;
  /**
   * 
   */
  level: string;
  /**
   * 
   */
  title: string;
  /**
   * 
   */
  detail?: string;
  /**
   * 
   */
  stepId?: string;
  /**
   * 
   */
  time: Date;
}

export interface AgentRunVO {
  /**
   * 
   */
  id: string;
  /**
   * 
   */
  intent: string;
  /**
   * 
   */
  mode: string;
  /**
   * 
   */
  strategy: string;
  /**
   * 
   */
  goal?: string;
  /**
   * 
   */
  state: string;
  /**
   * 
   */
  status: string;
  /**
   * 
   */
  finalSummary?: string;
  /**
   * 
   */
  error?: Record<string, any>;
  /**
   * 
   */
  startedAt?: Date;
  /**
   * 
   */
  completedAt?: Date;
  /**
   * 
   */
  durationMs?: Record<string, any>;
  /**
   * 
   */
  steps: AgentStepVO[];
  /**
   * 
   */
  tasks: AgentTaskVO[];
  /**
   * 
   */
  events: AgentEventVO[];
}

export interface SessionMessageVO {
  /**
   * 
   */
  id: string;
  /**
   * 
   */
  role: string;
  /**
   * 
   */
  content: string;
  /**
   * 
   */
  locale?: string;
  /**
   * 
   */
  metadata?: Record<string, any>;
  /**
   * 
   */
  feedback?: Record<string, any>;
  /**
   * 
   */
  trace?: MessageTraceVO;
  /**
   * 
   */
  agentRun?: AgentRunVO;
  /**
   * 
   */
  createdAt: Date;
}

export interface RuntimeRunSummaryVO {
  /**
   * 
   */
  id: string;
  /**
   * 
   */
  triggerMessageId: string;
  /**
   * 
   */
  intent: string;
  /**
   * 
   */
  mode: string;
  /**
   * 
   */
  strategy: string;
  /**
   * 
   */
  state: string;
  /**
   * 
   */
  status: string;
  /**
   * 
   */
  stepCount: number;
  /**
   * 
   */
  taskCount: number;
  /**
   * 
   */
  eventCount: number;
  /**
   * 
   */
  durationMs?: Record<string, any>;
  /**
   * 
   */
  startedAt?: Date;
  /**
   * 
   */
  completedAt?: Date;
}

export interface TraceSummaryVO {
  /**
   * 
   */
  totalRequests: number;
  /**
   * 
   */
  avgLatency: number;
  /**
   * 
   */
  avgFaithfulness?: Record<string, any>;
  /**
   * 
   */
  totalTokens: number;
  /**
   * 
   */
  totalCost: number;
  /**
   * 
   */
  errorCount: number;
}

export interface MemoryDotVO {
  /**
   * 记忆打点 ID
   */
  id: string;
  /**
   * 打点类型
   */
  dotType: string;
  /**
   * 原始内容
   */
  content: string;
  /**
   * 摘要文本
   */
  summaryText?: Record<string, any>;
  /**
   * 重要度
   */
  importance?: Record<string, any>;
  /**
   * 来源
   */
  source?: Record<string, any>;
  /**
   * 轮次编号
   */
  turnNumber?: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
}

export interface ReflectionVO {
  /**
   * 反思记录 ID
   */
  id: string;
  /**
   * 轮次编号
   */
  turnNumber?: Record<string, any>;
  /**
   * 用户提问
   */
  query?: Record<string, any>;
  /**
   * 识别意图
   */
  intent?: Record<string, any>;
  /**
   * 评估结果
   */
  evaluation?: Record<string, any>;
  /**
   * 反思文本
   */
  reflectionText?: Record<string, any>;
  /**
   * 经验类型
   */
  lessonType?: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
}

export interface ToolExecutionVO {
  /**
   * 执行 ID
   */
  id: string;
  /**
   * 关联 Run ID
   */
  runId: string;
  /**
   * 关联 Step ID
   */
  stepId?: Record<string, any>;
  /**
   * 工具名称
   */
  toolName: string;
  /**
   * 工具输入
   */
  toolInput?: Record<string, any>;
  /**
   * 工具输出
   */
  toolOutput?: Record<string, any>;
  /**
   * 执行状态
   */
  status: string;
  /**
   * 错误信息
   */
  errorMessage?: Record<string, any>;
  /**
   * 耗时 (ms)
   */
  latencyMs?: Record<string, any>;
  /**
   * 重试次数
   */
  retryCount?: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
}

/**
 * @description: 获取会话详情 响应
 * @url: /api/ai/report/sessions/{sessionId}
 * @name: SessionDetailDataVO
 */
export interface SessionDetailDataVO {
  /**
   * 
   */
  session: SessionInfoVO;
  /**
   * 
   */
  messages: SessionMessageVO[];
  /**
   * 意图反馈记录
   */
  intentFeedbacks: string[];
  /**
   * 转人工记录
   */
  escalations: string[];
  /**
   * Agent 执行链路汇总
   */
  runtimeRuns: RuntimeRunSummaryVO[];
  /**
   * 会话级 trace 聚合摘要
   */
  traceSummary?: TraceSummaryVO;
  /**
   * 记忆打点
   */
  memoryDots: MemoryDotVO[];
  /**
   * 反思记录
   */
  reflections: ReflectionVO[];
  /**
   * 工具执行明细
   */
  toolExecutions: ToolExecutionVO[];
}

export type SessionDetailResponseVO = SessionDetailDataVO;

export interface TaskPerformanceVO {
  /**
   * 平均 faithfulness
   */
  avgFaithfulness: number;
  /**
   * 成功率
   */
  successRate: number;
}

export interface EfficiencyVO {
  /**
   * P50 延迟 (ms)
   */
  p50Latency: number;
  /**
   * P90 延迟 (ms)
   */
  p90Latency: number;
}

export interface ToolCorrectnessVO {
  /**
   * 工具匹配率
   */
  toolMatchRate: number;
  /**
   * 平均不必要调用数
   */
  avgUnnecessaryCalls: number;
}

export interface TrajectoryQualityVO {
  /**
   * 平均重试次数
   */
  avgRetries: number;
}

export interface RobustnessVO {
  /**
   * 工具错误率
   */
  toolErrorRate: number;
  /**
   * 降级使用率
   */
  fallbackRate: number;
}

export interface SafetyVO {
  /**
   * 敏感操作确认率
   */
  confirmRate: number;
  /**
   * 敏感操作次数
   */
  sensitiveCount: number;
}

export interface SixDimensionsVO {
  /**
   * 维度1：任务性能
   */
  taskPerformance: TaskPerformanceVO;
  /**
   * 维度2：效率
   */
  efficiency: EfficiencyVO;
  /**
   * 维度3：工具正确性
   */
  toolCorrectness: ToolCorrectnessVO;
  /**
   * 维度4：轨迹质量
   */
  trajectoryQuality: TrajectoryQualityVO;
  /**
   * 维度5：鲁棒性
   */
  robustness: RobustnessVO;
  /**
   * 维度6：安全合规
   */
  safety: SafetyVO;
}

/**
 * @description: 六维评估统计 响应
 * @url: /api/ai/report/evaluation/six-dimensions
 * @name: SixDimensionEvaluationDataVO
 */
export interface SixDimensionEvaluationDataVO {
  /**
   * 总请求数
   */
  total: number;
  /**
   * 六维评估数据
   */
  dimensions: SixDimensionsVO;
}

export type SixDimensionEvaluationResponseVO = SixDimensionEvaluationDataVO;

/**
 * @description: 对抗验证统计 响应
 * @url: /api/ai/report/evaluation/contest-stats
 * @name: ContestStatsDataVO
 */
export interface ContestStatsDataVO {
  /**
   * 对抗验证总次数
   */
  total: number;
  /**
   * 一致率
   */
  agreedRate?: Record<string, any>;
  /**
   * 一致次数
   */
  agreed: number;
  /**
   * 不一致次数
   */
  disagreed: number;
  /**
   * 按方法分布
   */
  byMethod: Record<string, any>;
}

export type ContestStatsResponseVO = ContestStatsDataVO;

export interface PromptVersionVO {
  /**
   * 版本 ID
   */
  id: string;
  /**
   * 模板标识
   */
  templateKey: string;
  /**
   * 版本号
   */
  version: number;
  /**
   * 状态
   */
  status: "draft" | "active" | "retired";
  /**
   * 名称
   */
  name: string;
  /**
   * 总调用次数
   */
  totalCalls?: number;
  /**
   * 平均评分
   */
  avgScore?: Record<string, any>;
  /**
   * 平均延迟 (ms)
   */
  avgLatency?: Record<string, any>;
  /**
   * 失败次数
   */
  failureCount?: number;
  /**
   * 激活时间
   */
  activatedAt?: Record<string, any>;
  /**
   * 退役时间
   */
  retiredAt?: Record<string, any>;
  /**
   * 创建者
   */
  createdBy?: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
}

/**
 * @description: Prompt 版本列表 响应
 * @url: /api/ai/report/prompt/versions
 * @name: PromptVersionListResponseVO
 */
export type PromptVersionListResponseVO = PromptVersionVO[];

export interface PromptOptimizationVO {
  /**
   * 优化记录 ID
   */
  id: string;
  /**
   * 模板标识
   */
  templateKey: string;
  /**
   * 失败样本数
   */
  failureCount: number;
  /**
   * 采样周期
   */
  samplePeriod?: Record<string, any>;
  /**
   * 分析模型
   */
  analyzerModel?: Record<string, any>;
  /**
   * 失败原因分析
   */
  analysis?: Record<string, any>;
  /**
   * 建议 Prompt（JSON 多语言）
   */
  suggestedPrompt?: Record<string, any>;
  /**
   * 旧失败分数
   */
  oldFailureScore?: Record<string, any>;
  /**
   * 新失败分数
   */
  newFailureScore?: Record<string, any>;
  /**
   * 通过样本数
   */
  passingSampleCount?: Record<string, any>;
  /**
   * 失败样本提升百分比
   */
  improvement?: Record<string, any>;
  /**
   * 正常样本退化百分比
   */
  regression?: Record<string, any>;
  /**
   * LLM 评估理由
   */
  evalReason?: Record<string, any>;
  /**
   * 状态
   */
  status: "pending" | "analyzing" | "testing" | "needs_review" | "approved" | "rejected" | "rolled_back";
  /**
   * 决策
   */
  decision?: "auto_adopt" | "manual_adopt" | "manual_reject" | "auto_reject" | "auto_rollback";
  /**
   * 审核备注
   */
  reviewNote?: Record<string, any>;
  /**
   * 审核时间
   */
  reviewedAt?: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
}

/**
 * @description: Prompt 优化记录 响应
 * @url: /api/ai/report/prompt/optimizations
 * @name: PromptOptimizationListResponseVO
 */
export type PromptOptimizationListResponseVO = PromptOptimizationVO[];

export interface FailedQueryItemVO {
  /**
   * ID
   */
  id: string;
  /**
   * 追踪 ID
   */
  traceId?: Record<string, any>;
  /**
   * 用户查询
   */
  query: string;
  /**
   * 意图
   */
  intent?: Record<string, any>;
  /**
   * 知识库
   */
  knowledgeBase?: Record<string, any>;
  /**
   * 失败类型
   */
  failureType: "no_results" | "low_relevance" | "timeout" | "model_error" | "kb_unavailable" | "rate_limit" | "invalid_input" | "unknown";
  /**
   * 失败原因
   */
  reason: string;
  /**
   * 状态
   */
  status: "pending" | "resolved" | "ignored";
  /**
   * 重试次数
   */
  retryCount: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 解决时间
   */
  resolvedAt?: Record<string, any>;
  /**
   * 解决方案
   */
  resolution?: Record<string, any>;
}

export interface FailedQuerySummaryVO {
  /**
   * 总数
   */
  total: number;
  /**
   * 失败率 (%)
   */
  failureRate: number;
  /**
   * 已解决数量
   */
  resolvedCount: number;
  /**
   * 待处理数量
   */
  pendingCount: number;
}

export interface FailureTypeDistributionVO {
  /**
   * 类型
   */
  type: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 百分比
   */
  percentage: number;
}

export interface FailureTrendPointVO {
  /**
   * 展示标签
   */
  label: string;
  /**
   * 失败数量
   */
  count: number;
  /**
   * 失败率 (%)
   */
  rate: number;
}

/**
 * @description: 获取失败查询列表 响应
 * @url: /api/ai/report/failed-queries
 * @name: FailedQueryListDataVO
 */
export interface FailedQueryListDataVO {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 失败查询列表
   */
  list: FailedQueryItemVO[];
  /**
   * 汇总信息
   */
  summary: FailedQuerySummaryVO;
  /**
   * 按类型分布
   */
  byType: FailureTypeDistributionVO[];
  /**
   * 失败趋势
   */
  trend: FailureTrendPointVO[];
}

export type FailedQueryListResponseVO = FailedQueryListDataVO;

/**
 * @description: 暂无描述 请求
 * @url: /api/ai/metrics
 * @name: MetricsQueryDto
 */
export interface MetricsQueryDto {
  /**
   * 
   */
  format: string;
}

/**
 * @description: 会话列表 请求
 * @url: /api/ai/chat/sessions
 * @name: ChatSessionsQueryDto
 */
export interface ChatSessionsQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 用户ID
   */
  userId?: string;
}

/**
 * @description: 获取历史消息 请求
 * @url: /api/ai/chat/sessions/{sessionId}/messages
 * @name: MessagesQueryDto
 */
export interface MessagesQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 是否优先返回最新一页消息
   */
  latest?: boolean;
}

/**
 * @description: 获取 AI 助手配置 请求
 * @url: /api/ai/chat/config
 * @name: ChatConfigQueryDto
 */
export interface ChatConfigQueryDto {
  /**
   * 当前页面路径
   */
  pagePath?: string;
  /**
   * 当前页面标题
   */
  pageTitle?: string;
}

/**
 * @description: 转人工工单列表 请求
 * @url: /api/ai/admin/escalation
 * @name: EscalationQueryDto
 */
export interface EscalationQueryDto {
  /**
   * 状态过滤: pending/assigned/resolved/cancelled
   */
  status?: string;
  /**
   * 原因过滤
   */
  reason?: string;
  /**
   * 
   */
  page?: number;
  /**
   * 
   */
  pageSize?: number;
}

/**
 * @description: 获取知识文档列表 请求
 * @url: /api/ai/knowledge/documents
 * @name: KnowledgeDocumentsQueryDto
 */
export interface KnowledgeDocumentsQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 模块
   */
  module?: string;
  /**
   * 文档类型
   */
  type?: "page" | "feature" | "api" | "faq" | "guide" | "glossary" | "component";
  /**
   * 是否激活
   */
  isActive?: boolean;
  /**
   * 关键词搜索
   */
  keyword?: string;
}

/**
 * @description: 同步日志 请求
 * @url: /api/ai/sync/logs
 * @name: SyncLogsQueryDto
 */
export interface SyncLogsQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 同步类型
   */
  syncType?: "full" | "incremental" | "single";
  /**
   * 状态
   */
  status?: "success" | "partial" | "failed";
}

/**
 * @description: 内容生成操作日志 请求
 * @url: /api/ai/content-gen/logs
 * @name: ContentGenLogsQueryDto
 */
export interface ContentGenLogsQueryDto {
  /**
   * 按操作类型筛选
   */
  action?: "generate" | "rewrite" | "expand" | "shorten" | "continue" | "translate" | "polish";
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
}

/**
 * @description: 获取 RAG 看板快照 请求
 * @url: /api/ai/report/dashboard/snapshot
 * @name: SnapshotQueryDto
 */
export interface SnapshotQueryDto {
  /**
   * 时间范围
   */
  timeRange?: "1h" | "24h" | "7d" | "30d";
  /**
   * 自定义开始时间 (ISO 格式)
   */
  startTime?: string;
  /**
   * 自定义结束时间 (ISO 格式)
   */
  endTime?: string;
}

/**
 * @description: 获取 planner 聚合统计 请求
 * @url: /api/ai/report/planner/stats
 * @name: PlannerStatsQueryDto
 */
export interface PlannerStatsQueryDto {
  /**
   * 时间范围
   */
  timeRange?: "1h" | "24h" | "7d" | "30d";
  /**
   * 自定义开始时间 (ISO 格式)
   */
  startTime?: string;
  /**
   * 自定义结束时间 (ISO 格式)
   */
  endTime?: string;
}

/**
 * @description: 获取会话分析列表 请求
 * @url: /api/ai/report/sessions
 * @name: ReportSessionsQueryDto
 */
export interface ReportSessionsQueryDto {
  /**
   * 时间范围
   */
  timeRange?: "1h" | "24h" | "7d" | "30d";
  /**
   * 自定义开始时间 (ISO 格式)
   */
  startTime?: string;
  /**
   * 自定义结束时间 (ISO 格式)
   */
  endTime?: string;
  /**
   * 页码
   */
  pageNo?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
}

/**
 * @description: 六维评估统计 请求
 * @url: /api/ai/report/evaluation/six-dimensions
 * @name: SixDimensionsQueryDto
 */
export interface SixDimensionsQueryDto {
  /**
   * 
   */
  timeRange: string;
}

/**
 * @description: 对抗验证统计 请求
 * @url: /api/ai/report/evaluation/contest-stats
 * @name: ContestStatsQueryDto
 */
export interface ContestStatsQueryDto {
  /**
   * 
   */
  timeRange: string;
}

/**
 * @description: Prompt 版本列表 请求
 * @url: /api/ai/report/prompt/versions
 * @name: VersionsQueryDto
 */
export interface VersionsQueryDto {
  /**
   * 
   */
  templateKey: string;
  /**
   * 
   */
  status: string;
  /**
   * 
   */
  page: string;
  /**
   * 
   */
  pageSize: string;
}

/**
 * @description: Prompt 优化记录 请求
 * @url: /api/ai/report/prompt/optimizations
 * @name: OptimizationsQueryDto
 */
export interface OptimizationsQueryDto {
  /**
   * 
   */
  templateKey: string;
  /**
   * 
   */
  status: string;
}

/**
 * @description: 获取失败查询列表 请求
 * @url: /api/ai/report/failed-queries
 * @name: FailedQueriesQueryDto
 */
export interface FailedQueriesQueryDto {
  /**
   * 时间范围
   */
  timeRange?: "1h" | "24h" | "7d" | "30d";
  /**
   * 自定义开始时间 (ISO 格式)
   */
  startTime?: string;
  /**
   * 自定义结束时间 (ISO 格式)
   */
  endTime?: string;
  /**
   * 页码
   */
  pageNo?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 失败类型
   */
  failureType?: "no_results" | "low_relevance" | "timeout" | "model_error" | "kb_unavailable" | "rate_limit" | "invalid_input" | "unknown";
  /**
   * 状态过滤
   */
  status?: "pending" | "resolved" | "ignored";
  /**
   * 关键词搜索
   */
  keyword?: string;
}

