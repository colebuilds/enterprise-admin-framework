import type {
  AlertConfigDataVO,
  AssistantConfigVO,
  ChatConfigQueryDto,
  ChatRequestDto,
  ChatSessionsQueryDto,
  ContentGenLogsQueryDto,
  ContentGenTextDto,
  ContestStatsDataVO,
  ContestStatsQueryDto,
  CreateFeedbackDto,
  DashboardSnapshotDataVO,
  DocumentResponseDto,
  EscalationQueryDto,
  ExecuteSyncDataVO,
  ExecuteSyncDto,
  FailedQueriesQueryDto,
  FailedQueryListDataVO,
  FeedbackStatsDataVO,
  IntentFeedbackStatsVO,
  IntentListResponseVO,
  KnowledgeDocumentsQueryDto,
  MessageFeedbackVO,
  MessageIntentFeedbackDto,
  MessagesQueryDto,
  MetricsQueryDto,
  OptimizationsQueryDto,
  PaginatedDocumentDataDto,
  PaginatedMessageDataVO,
  PaginatedSessionDataVO,
  PaginatedSyncLogDataVO,
  PlannerStatsDataVO,
  PlannerStatsQueryDto,
  PromptOptimizationListResponseVO,
  PromptVersionListResponseVO,
  RebuildKnowledgeIndexDataVO,
  ReportSessionsQueryDto,
  ResolveEscalationDto,
  RuntimeRunVO,
  SearchRequestDto,
  SearchResponseDto,
  SessionDetailDataVO,
  SixDimensionEvaluationDataVO,
  SixDimensionsQueryDto,
  SnapshotQueryDto,
  SSEEventVO,
  SyncLogsQueryDto,
  TranslateRequestDto,
  TranslateResponseDto,
  UpdateAlertConfigDto,
  VersionsQueryDto,
} from './types';

import { requestClient } from '#/api/request';

// 导出类型
export * from './types';

// ==================== MetricsController$1 ====================

/**
 * @description: 暂无描述
 * @param {MetricsQueryDto} params
 * @url: /api/ai/metrics
 */
export const metrics = (params: MetricsQueryDto) => {
  return requestClient.get<any>('/ai/metrics', { params });
};

// ==================== Feedback ====================

/**
 * @description: 提交反馈
 * @param {CreateFeedbackDto} params
 * @url: /api/ai/feedback
 */
export const feedback = (params: CreateFeedbackDto) => {
  return requestClient.post<MessageFeedbackVO>('/ai/feedback', params);
};

/**
 * @description: 获取支持的意图列表
 * @url: /api/ai/feedback/intents
 */
export const intents = () => {
  return requestClient.get<IntentListResponseVO>('/ai/feedback/intents');
};

// ==================== Chat - 对话服务 ====================

/**
 * @description: 发送消息（SSE 流式）
 * @param {ChatRequestDto} params
 * @url: /api/ai/chat
 */
export const chat = (params: ChatRequestDto) => {
  return requestClient.post<SSEEventVO>('/ai/chat', params);
};

/**
 * @description: 会话列表
 * @param {ChatSessionsQueryDto} params
 * @url: /api/ai/chat/sessions
 */
export const chatSessions = (params?: ChatSessionsQueryDto) => {
  return requestClient.get<PaginatedSessionDataVO>('/ai/chat/sessions', {
    params,
  });
};

/**
 * @description: 删除会话
 * @param id 路径参数
 * @url: /api/ai/chat/sessions/{id}
 */
export const chatSessionsDelete = (id: string) => {
  return requestClient.delete<any>(`/ai/chat/sessions/${id}`);
};

/**
 * @description: 获取历史消息
 * @param sessionId 路径参数
 * @param {MessagesQueryDto} params
 * @url: /api/ai/chat/sessions/{sessionId}/messages
 */
export const messages = (sessionId: string, params?: MessagesQueryDto) => {
  return requestClient.get<PaginatedMessageDataVO>(
    `/ai/chat/sessions/${sessionId}/messages`,
    { params },
  );
};

/**
 * @description: 提交消息意图反馈
 * @param messageId 路径参数
 * @param {MessageIntentFeedbackDto} params
 * @url: /api/ai/chat/messages/{messageId}/intent-feedback
 */
export const intentFeedback = (
  messageId: string,
  params: MessageIntentFeedbackDto,
) => {
  return requestClient.post<any>(
    `/ai/chat/messages/${messageId}/intent-feedback`,
    params,
  );
};

/**
 * @description: 获取 AI 助手配置
 * @param {ChatConfigQueryDto} params
 * @url: /api/ai/chat/config
 */
export const chatConfig = (params?: ChatConfigQueryDto) => {
  return requestClient.get<AssistantConfigVO>('/ai/chat/config', { params });
};

/**
 * @description: 获取任务运行详情
 * @param runId 路径参数
 * @url: /api/ai/chat/runs/{runId}
 */
export const runs = (runId: string) => {
  return requestClient.get<RuntimeRunVO>(`/ai/chat/runs/${runId}`);
};

// ==================== Translate ====================

/**
 * @description: 多语言翻译
 * @param {TranslateRequestDto} params
 * @url: /api/ai/admin/translate
 */
export const translate = (params: TranslateRequestDto) => {
  return requestClient.post<TranslateResponseDto>(
    '/ai/admin/translate',
    params,
  );
};

// ==================== Feedback Admin ====================

/**
 * @description: 反馈统计
 * @url: /api/ai/admin/feedback/stats
 */
export const feedbackStats = () => {
  return requestClient.get<FeedbackStatsDataVO>('/ai/admin/feedback/stats');
};

/**
 * @description: 意图识别统计
 * @url: /api/ai/admin/feedback/intents/stats
 */
export const intentsStats = () => {
  return requestClient.get<IntentFeedbackStatsVO>(
    '/ai/admin/feedback/intents/stats',
  );
};

/**
 * @description: 按会话校正意图
 * @param sessionId 路径参数
 * @url: /api/ai/admin/feedback/intents/correct/session/{sessionId}
 */
export const session = (sessionId: string) => {
  return requestClient.post<any>(
    `/ai/admin/feedback/intents/correct/session/${sessionId}`,
  );
};

/**
 * @description: 按消息校正意图
 * @param messageId 路径参数
 * @url: /api/ai/admin/feedback/intents/correct/message/{messageId}
 */
export const message = (messageId: string) => {
  return requestClient.post<any>(
    `/ai/admin/feedback/intents/correct/message/${messageId}`,
  );
};

// ==================== Escalation Admin ====================

/**
 * @description: 转人工工单列表
 * @param {EscalationQueryDto} params
 * @url: /api/ai/admin/escalation
 */
export const escalation = (params?: EscalationQueryDto) => {
  return requestClient.get<any>('/ai/admin/escalation', { params });
};

/**
 * @description: 标记工单已解决
 * @param id 路径参数
 * @param {ResolveEscalationDto} params
 * @url: /api/ai/admin/escalation/{id}/resolve
 */
export const resolve = (id: string, params: ResolveEscalationDto) => {
  return requestClient.request<any>(`/ai/admin/escalation/${id}/resolve`, {
    method: 'PATCH',
    data: params,
  });
};

/**
 * @description: 转人工统计
 * @url: /api/ai/admin/escalation/stats
 */
export const escalationStats = () => {
  return requestClient.get<any>('/ai/admin/escalation/stats');
};

// ==================== Knowledge - 知识库管理 ====================

/**
 * @description: 获取知识文档列表
 * @param {KnowledgeDocumentsQueryDto} params
 * @url: /api/ai/knowledge/documents
 */
export const knowledgeDocuments = (params?: KnowledgeDocumentsQueryDto) => {
  return requestClient.get<PaginatedDocumentDataDto>(
    '/ai/knowledge/documents',
    { params },
  );
};

/**
 * @description: 获取知识文档详情
 * @param id 路径参数
 * @url: /api/ai/knowledge/documents/{id}
 */
export const knowledgeDocumentsGet = (id: string) => {
  return requestClient.get<DocumentResponseDto>(
    `/ai/knowledge/documents/${id}`,
  );
};

/**
 * @description: 根据 docId 获取知识文档
 * @param docId 路径参数
 * @url: /api/ai/knowledge/documents/by-doc-id/{docId}
 */
export const byDocId = (docId: string) => {
  return requestClient.get<DocumentResponseDto>(
    `/ai/knowledge/documents/by-doc-id/${docId}`,
  );
};

/**
 * @description: 混合检索知识库
 * @param {SearchRequestDto} params
 * @url: /api/ai/knowledge/search
 */
export const search = (params: SearchRequestDto) => {
  return requestClient.post<SearchResponseDto>('/ai/knowledge/search', params);
};

/**
 * @description: 获取向量化队列状态
 * @url: /api/ai/knowledge/queue/stats
 */
export const queueStats = () => {
  return requestClient.get<any>('/ai/knowledge/queue/stats');
};

/**
 * @description: 清理失败的向量化任务
 * @url: /api/ai/knowledge/queue/clean-failed
 */
export const cleanFailed = () => {
  return requestClient.post<any>('/ai/knowledge/queue/clean-failed');
};

// ==================== Sync ====================

/**
 * @description: 执行知识库同步
 * @param {ExecuteSyncDto} params
 * @url: /api/ai/sync
 */
export const sync = (params: ExecuteSyncDto) => {
  return requestClient.post<ExecuteSyncDataVO>('/ai/sync', params);
};

/**
 * @description: 同步日志
 * @param {SyncLogsQueryDto} params
 * @url: /api/ai/sync/logs
 */
export const syncLogs = (params?: SyncLogsQueryDto) => {
  return requestClient.get<PaginatedSyncLogDataVO>('/ai/sync/logs', { params });
};

/**
 * @description: 重建知识索引并重新入队向量化
 * @url: /api/ai/sync/rebuild-index
 */
export const rebuildIndex = () => {
  return requestClient.post<RebuildKnowledgeIndexDataVO>(
    '/ai/sync/rebuild-index',
  );
};

// ==================== Health ====================

/**
 * @description: 健康检查
 * @url: /api/ai/health
 */
export const health = () => {
  return requestClient.get<any>('/ai/health');
};

// ==================== User ====================

/**
 * @description: 查看当前认证用户上下文
 * @url: /api/ai/user/test/context
 */
export const context = () => {
  return requestClient.get<any>('/ai/user/test/context');
};

// ==================== ContentGen - 运营内容生成 ====================

/**
 * @description: 文案 AI 生成（SSE 流式）
 * @param {ContentGenTextDto} params
 * @url: /api/ai/content-gen/text
 */
export const text = (params: ContentGenTextDto) => {
  return requestClient.post<any>('/ai/content-gen/text', params);
};

/**
 * @description: 内容生成操作日志
 * @param {ContentGenLogsQueryDto} params
 * @url: /api/ai/content-gen/logs
 */
export const contentGenLogs = (params?: ContentGenLogsQueryDto) => {
  return requestClient.get<any>('/ai/content-gen/logs', { params });
};

// ==================== Report - 报表统计 ====================

/**
 * @description: 获取 RAG 看板快照
 * @param {SnapshotQueryDto} params
 * @url: /api/ai/report/dashboard/snapshot
 */
export const snapshot = (params?: SnapshotQueryDto) => {
  return requestClient.get<DashboardSnapshotDataVO>(
    '/ai/report/dashboard/snapshot',
    { params },
  );
};

/**
 * @description: 获取 planner 聚合统计
 * @param {PlannerStatsQueryDto} params
 * @url: /api/ai/report/planner/stats
 */
export const plannerStats = (params?: PlannerStatsQueryDto) => {
  return requestClient.get<PlannerStatsDataVO>('/ai/report/planner/stats', {
    params,
  });
};

/**
 * @description: 获取告警配置
 * @url: /api/ai/report/alerts/config
 */
export const alertsConfig = () => {
  return requestClient.get<AlertConfigDataVO>('/ai/report/alerts/config');
};

/**
 * @description: 更新告警配置
 * @param {UpdateAlertConfigDto} params
 * @url: /api/ai/report/alerts/config
 */
export const alertsConfigPut = (params: UpdateAlertConfigDto) => {
  return requestClient.put<AlertConfigDataVO>(
    '/ai/report/alerts/config',
    params,
  );
};

/**
 * @description: 获取会话分析列表
 * @param {ReportSessionsQueryDto} params
 * @url: /api/ai/report/sessions
 */
export const reportSessions = (params?: ReportSessionsQueryDto) => {
  return requestClient.get<any>('/ai/report/sessions', { params });
};

/**
 * @description: 获取会话详情
 * @param sessionId 路径参数
 * @url: /api/ai/report/sessions/{sessionId}
 */
export const reportSessionsGet = (sessionId: string) => {
  return requestClient.get<SessionDetailDataVO>(
    `/ai/report/sessions/${sessionId}`,
  );
};

/**
 * @description: 六维评估统计
 * @param {SixDimensionsQueryDto} params
 * @url: /api/ai/report/evaluation/six-dimensions
 */
export const sixDimensions = (params: SixDimensionsQueryDto) => {
  return requestClient.get<SixDimensionEvaluationDataVO>(
    '/ai/report/evaluation/six-dimensions',
    { params },
  );
};

/**
 * @description: 对抗验证统计
 * @param {ContestStatsQueryDto} params
 * @url: /api/ai/report/evaluation/contest-stats
 */
export const contestStats = (params: ContestStatsQueryDto) => {
  return requestClient.get<ContestStatsDataVO>(
    '/ai/report/evaluation/contest-stats',
    { params },
  );
};

/**
 * @description: Prompt 版本列表
 * @param {VersionsQueryDto} params
 * @url: /api/ai/report/prompt/versions
 */
export const versions = (params: VersionsQueryDto) => {
  return requestClient.get<PromptVersionListResponseVO>(
    '/ai/report/prompt/versions',
    { params },
  );
};

/**
 * @description: Prompt 优化记录
 * @param {OptimizationsQueryDto} params
 * @url: /api/ai/report/prompt/optimizations
 */
export const optimizations = (params: OptimizationsQueryDto) => {
  return requestClient.get<PromptOptimizationListResponseVO>(
    '/ai/report/prompt/optimizations',
    { params },
  );
};

/**
 * @description: 激活指定 Prompt 版本
 * @param templateKey 路径参数
 * @url: /api/ai/report/prompt/versions/{templateKey}/activate
 */
export const activate = (templateKey: string) => {
  return requestClient.post<any>(
    `/ai/report/prompt/versions/${templateKey}/activate`,
  );
};

/**
 * @description: 回滚 Prompt 到上一个版本
 * @param templateKey 路径参数
 * @url: /api/ai/report/prompt/versions/{templateKey}/rollback
 */
export const rollback = (templateKey: string) => {
  return requestClient.post<any>(
    `/ai/report/prompt/versions/${templateKey}/rollback`,
  );
};

/**
 * @description: 审批通过优化记录
 * @param id 路径参数
 * @url: /api/ai/report/prompt/optimizations/{id}/approve
 */
export const approve = (id: string) => {
  return requestClient.post<any>(
    `/ai/report/prompt/optimizations/${id}/approve`,
  );
};

/**
 * @description: 拒绝优化记录
 * @param id 路径参数
 * @url: /api/ai/report/prompt/optimizations/{id}/reject
 */
export const reject = (id: string) => {
  return requestClient.post<any>(
    `/ai/report/prompt/optimizations/${id}/reject`,
  );
};

/**
 * @description: 获取失败查询列表
 * @param {FailedQueriesQueryDto} params
 * @url: /api/ai/report/failed-queries
 */
export const failedQueries = (params?: FailedQueriesQueryDto) => {
  return requestClient.get<FailedQueryListDataVO>('/ai/report/failed-queries', {
    params,
  });
};
