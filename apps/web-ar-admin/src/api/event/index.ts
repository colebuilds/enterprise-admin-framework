import type {
  AdminAlarmGetQueryDto,
  AdminCardGetQueryDto,
  AdminCardPageGetQueryDto,
  AdminProjectGetQueryDto,
  AggregatedMetricsVO,
  AlarmMessageListResponseVO,
  AlarmMessageVO,
  AlarmRuleListResponseVO,
  AlarmRuleVO,
  AlarmStatsQueryDto,
  AlarmStatsVO,
  AttributionVO,
  BindIdentityDto,
  BindResultVO,
  CardDataQueryDto,
  CardDataVO,
  CardListResponseVO,
  CardListWithDataQueryDto,
  CardListWithDataResponseVO,
  CardPageListResponseVO,
  CardPageTreeResponseVO,
  CardPageVO,
  CardVO,
  CohortAnalysisListResponseVO,
  CohortQueryDto,
  ConversionAttributionDto,
  CreateAlarmDto,
  CreateCardDto,
  CreateCardPageDto,
  CreateProjectDto,
  CrossDeviceQueryDto,
  CrossDeviceVO,
  EventBatchDto,
  EventMetricsQueryDto,
  EventTrendListResponseVO,
  EventTrendQueryDto,
  FlowDataVO,
  GroupByQueryDto,
  GroupByResultListResponseVO,
  HealthSummaryVO,
  HeatmapDataVO,
  HeatmapQueryDto,
  MergeResultVO,
  MergeUsersDto,
  MessagesQueryDto,
  NodeInfoListResponseVO,
  OptionsResponseVO,
  OverviewQueryDto,
  OverviewStatsVO,
  PagePathListResponseVO,
  PagePathQueryDto,
  PageViewDto,
  PathAnalysisVO,
  PathQueryDto,
  ProjectListResponseVO,
  ProjectVO,
  PvUvQueryDto,
  PvUvResultListResponseVO,
  QuickRetentionVO,
  RealtimeQueryDto,
  RealtimeStatsVO,
  RelationsQueryDto,
  RelationStatsVO,
  RetentionAnalysisListResponseVO,
  RetentionMatrixQueryDto,
  RetentionMatrixResponseVO,
  RetentionQueryDto,
  ServiceSummaryVO,
  SessionPathEventListResponseVO,
  SessionPathQueryDto,
  SingleEventDto,
  SortCardsDto,
  SortResultVO,
  SourceValueListResponseVO,
  SourceValuesQueryDto,
  StatusQueryDto,
  TestAlarmResultVO,
  TopPageListResponseVO,
  TopPagesQueryDto,
  TopPathListResponseVO,
  TopPathsQueryDto,
  TrafficTrendListResponseVO,
  TreeQueryDto,
  TrendQueryDto,
  UnbindIdentityDto,
  UnbindResultVO,
  UpdateAlarmDto,
  UpdateCardDto,
  UpdateCardPageDto,
  UpdateProjectDto,
  UserIdentityDto,
  UserIdentityVO,
  UserJourneyEventListResponseVO,
  UserJourneyQueryDto,
  UserPathEventListResponseVO,
  UserPathQueryDto,
  UserRelationListResponseVO,
} from './types';

import { requestClient } from '#/api/request';

// 导出类型
export * from './types';

// ==================== MetricsController$1 ====================

/**
 * @description: 暂无描述
 * @param {EventMetricsQueryDto} params
 * @url: /api/event/metrics
 */
export const eventMetrics = (params: EventMetricsQueryDto) => {
  return requestClient.get<any>('/event/metrics', { params });
};

// ==================== 流量监控 ====================

/**
 * @description: 获取活跃节点列表
 * @url: /api/event/traffic/nodes
 */
export const nodes = () => {
  return requestClient.get<NodeInfoListResponseVO>('/event/traffic/nodes');
};

/**
 * @description: 获取汇总指标
 * @url: /api/event/traffic/metrics
 */
export const trafficMetrics = () => {
  return requestClient.get<AggregatedMetricsVO>('/event/traffic/metrics');
};

/**
 * @description: 获取流量趋势
 * @param {TrendQueryDto} params
 * @url: /api/event/traffic/trend
 */
export const trend = (params?: TrendQueryDto) => {
  return requestClient.get<TrafficTrendListResponseVO>('/event/traffic/trend', {
    params,
  });
};

/**
 * @description: 获取实例健康状态
 * @url: /api/event/traffic/health
 */
export const health = () => {
  return requestClient.get<HealthSummaryVO>('/event/traffic/health');
};

/**
 * @description: 获取服务统计摘要
 * @url: /api/event/traffic/summary
 */
export const summary = () => {
  return requestClient.get<ServiceSummaryVO>('/event/traffic/summary');
};

/**
 * @description: 调试 - 获取 Redis 指标原始数据
 * @url: /api/event/traffic/debug
 */
export const debug = () => {
  return requestClient.get<any>('/event/traffic/debug');
};

// ==================== Options - 全局配置选项 ====================

/**
 * @description: 获取全局配置选项
 * @url: /api/event/options
 */
export const options = () => {
  return requestClient.get<OptionsResponseVO>('/event/options');
};

// ==================== Collect - 数据采集 ====================

/**
 * @description: 批量事件上报
 * @param {EventBatchDto} params
 * @url: /api/event/sdk/collect/batch
 */
export const batch = (params: EventBatchDto) => {
  return requestClient.post<any>('/event/sdk/collect/batch', params);
};

/**
 * @description: 单个事件上报
 * @param {SingleEventDto} params
 * @url: /api/event/sdk/collect/event
 */
export const event = (params: SingleEventDto) => {
  return requestClient.post<any>('/event/sdk/collect/event', params);
};

/**
 * @description: PV 上报
 * @param {PageViewDto} params
 * @url: /api/event/sdk/collect/pageview
 */
export const pageview = (params: PageViewDto) => {
  return requestClient.post<any>('/event/sdk/collect/pageview', params);
};

/**
 * @description: 心跳检测
 * @url: /api/event/sdk/collect/ping
 */
export const ping = () => {
  return requestClient.post<any>('/event/sdk/collect/ping');
};

// ==================== Project - 项目管理 ====================

/**
 * @description: 创建项目
 * @param {CreateProjectDto} params
 * @url: /api/event/admin/project
 */
export const adminProject = (params: CreateProjectDto) => {
  return requestClient.post<ProjectVO>('/event/admin/project', params);
};

/**
 * @description: 项目列表
 * @param {AdminProjectGetQueryDto} params
 * @url: /api/event/admin/project
 */
export const adminProjectGet = (params?: AdminProjectGetQueryDto) => {
  return requestClient.get<ProjectListResponseVO>('/event/admin/project', {
    params,
  });
};

/**
 * @description: 项目详情
 * @param id 路径参数
 * @url: /api/event/admin/project/{id}
 */
export const adminProjectGet2 = (id: string) => {
  return requestClient.get<ProjectVO>(`/event/admin/project/${id}`);
};

/**
 * @description: 更新项目
 * @param id 路径参数
 * @param {UpdateProjectDto} params
 * @url: /api/event/admin/project/{id}
 */
export const adminProjectPut = (id: string, params: UpdateProjectDto) => {
  return requestClient.put<ProjectVO>(`/event/admin/project/${id}`, params);
};

/**
 * @description: 归档项目
 * @param id 路径参数
 * @url: /api/event/admin/project/{id}
 */
export const adminProjectDelete = (id: string) => {
  return requestClient.delete<ProjectVO>(`/event/admin/project/${id}`);
};

// ==================== Alarm - 告警配置 ====================

/**
 * @description: 创建告警规则
 * @param {CreateAlarmDto} params
 * @url: /api/event/admin/alarm
 */
export const adminAlarm = (params: CreateAlarmDto) => {
  return requestClient.post<AlarmRuleVO>('/event/admin/alarm', params);
};

/**
 * @description: 告警规则列表
 * @param {AdminAlarmGetQueryDto} params
 * @url: /api/event/admin/alarm
 */
export const adminAlarmGet = (params?: AdminAlarmGetQueryDto) => {
  return requestClient.get<AlarmRuleListResponseVO>('/event/admin/alarm', {
    params,
  });
};

/**
 * @description: 获取告警消息
 * @param {MessagesQueryDto} params
 * @url: /api/event/admin/alarm/messages
 */
export const messages = (params?: MessagesQueryDto) => {
  return requestClient.get<AlarmMessageListResponseVO>(
    '/event/admin/alarm/messages',
    { params },
  );
};

/**
 * @description: 告警统计
 * @param {AlarmStatsQueryDto} params
 * @url: /api/event/admin/alarm/stats
 */
export const alarmStats = (params?: AlarmStatsQueryDto) => {
  return requestClient.get<AlarmStatsVO>('/event/admin/alarm/stats', {
    params,
  });
};

/**
 * @description: 标记消息已读
 * @param messageId 路径参数
 * @url: /api/event/admin/alarm/messages/{messageId}/read
 */
export const read = (messageId: string) => {
  return requestClient.post<AlarmMessageVO>(
    `/event/admin/alarm/messages/${messageId}/read`,
  );
};

/**
 * @description: 告警规则详情
 * @param id 路径参数
 * @url: /api/event/admin/alarm/{id}
 */
export const adminAlarmGet2 = (id: string) => {
  return requestClient.get<AlarmRuleVO>(`/event/admin/alarm/${id}`);
};

/**
 * @description: 更新告警规则
 * @param id 路径参数
 * @param {UpdateAlarmDto} params
 * @url: /api/event/admin/alarm/{id}
 */
export const adminAlarmPut = (id: string, params: UpdateAlarmDto) => {
  return requestClient.put<AlarmRuleVO>(`/event/admin/alarm/${id}`, params);
};

/**
 * @description: 删除告警规则
 * @param id 路径参数
 * @url: /api/event/admin/alarm/{id}
 */
export const adminAlarmDelete = (id: string) => {
  return requestClient.delete<AlarmRuleVO>(`/event/admin/alarm/${id}`);
};

/**
 * @description: 启用告警规则
 * @param id 路径参数
 * @url: /api/event/admin/alarm/{id}/enable
 */
export const enable = (id: string) => {
  return requestClient.post<AlarmRuleVO>(`/event/admin/alarm/${id}/enable`);
};

/**
 * @description: 禁用告警规则
 * @param id 路径参数
 * @url: /api/event/admin/alarm/{id}/disable
 */
export const disable = (id: string) => {
  return requestClient.post<AlarmRuleVO>(`/event/admin/alarm/${id}/disable`);
};

/**
 * @description: 测试告警
 * @param id 路径参数
 * @url: /api/event/admin/alarm/{id}/test
 */
export const test = (id: string) => {
  return requestClient.post<TestAlarmResultVO>(`/event/admin/alarm/${id}/test`);
};

// ==================== Card - 数据卡片 ====================

/**
 * @description: 创建卡片
 * @param {CreateCardDto} params
 * @url: /api/event/admin/card
 */
export const adminCard = (params: CreateCardDto) => {
  return requestClient.post<CardVO>('/event/admin/card', params);
};

/**
 * @description: 卡片列表
 * @param {AdminCardGetQueryDto} params
 * @url: /api/event/admin/card
 */
export const adminCardGet = (params?: AdminCardGetQueryDto) => {
  return requestClient.get<CardListResponseVO>('/event/admin/card', { params });
};

/**
 * @description: 卡片列表含数据
 * @param {CardListWithDataQueryDto} params
 * @url: /api/event/admin/card/list-with-data
 */
export const listWithData = (params: CardListWithDataQueryDto) => {
  return requestClient.post<CardListWithDataResponseVO>(
    '/event/admin/card/list-with-data',
    params,
  );
};

/**
 * @description: 卡片详情
 * @param id 路径参数
 * @url: /api/event/admin/card/{id}
 */
export const adminCardGet2 = (id: string) => {
  return requestClient.get<CardVO>(`/event/admin/card/${id}`);
};

/**
 * @description: 更新卡片
 * @param id 路径参数
 * @param {UpdateCardDto} params
 * @url: /api/event/admin/card/{id}
 */
export const adminCardPut = (id: string, params: UpdateCardDto) => {
  return requestClient.put<CardVO>(`/event/admin/card/${id}`, params);
};

/**
 * @description: 删除卡片
 * @param id 路径参数
 * @url: /api/event/admin/card/{id}
 */
export const adminCardDelete = (id: string) => {
  return requestClient.delete<CardVO>(`/event/admin/card/${id}`);
};

/**
 * @description: 复制卡片
 * @param id 路径参数
 * @url: /api/event/admin/card/{id}/copy
 */
export const copy = (id: string) => {
  return requestClient.post<CardVO>(`/event/admin/card/${id}/copy`);
};

/**
 * @description: 卡片排序
 * @param {SortCardsDto} params
 * @url: /api/event/admin/card/sort
 */
export const sort = (params: SortCardsDto) => {
  return requestClient.post<SortResultVO>('/event/admin/card/sort', params);
};

/**
 * @description: 获取卡片数据
 * @param id 路径参数
 * @param {CardDataQueryDto} params
 * @url: /api/event/admin/card/{id}/data
 */
export const data = (id: string, params: CardDataQueryDto) => {
  return requestClient.post<CardDataVO>(`/event/admin/card/${id}/data`, params);
};

/**
 * @description: 分组查询
 * @param {GroupByQueryDto} params
 * @url: /api/event/admin/card/group-by
 */
export const groupBy = (params: GroupByQueryDto) => {
  return requestClient.post<GroupByResultListResponseVO>(
    '/event/admin/card/group-by',
    params,
  );
};

/**
 * @description: 热力图数据
 * @param {HeatmapQueryDto} params
 * @url: /api/event/admin/card/heatmap
 */
export const heatmap = (params: HeatmapQueryDto) => {
  return requestClient.post<HeatmapDataVO>('/event/admin/card/heatmap', params);
};

// ==================== CardPage - 卡片页面 ====================

/**
 * @description: 创建页面/分组
 * @param {CreateCardPageDto} params
 * @url: /api/event/admin/card-page
 */
export const adminCardPage = (params: CreateCardPageDto) => {
  return requestClient.post<CardPageVO>('/event/admin/card-page', params);
};

/**
 * @description: 页面列表
 * @param {AdminCardPageGetQueryDto} params
 * @url: /api/event/admin/card-page
 */
export const adminCardPageGet = (params?: AdminCardPageGetQueryDto) => {
  return requestClient.get<CardPageListResponseVO>('/event/admin/card-page', {
    params,
  });
};

/**
 * @description: 树形结构
 * @param {TreeQueryDto} params
 * @url: /api/event/admin/card-page/tree
 */
export const tree = (params?: TreeQueryDto) => {
  return requestClient.get<CardPageTreeResponseVO>(
    '/event/admin/card-page/tree',
    { params },
  );
};

/**
 * @description: 更新页面/分组
 * @param id 路径参数
 * @param {UpdateCardPageDto} params
 * @url: /api/event/admin/card-page/{id}
 */
export const adminCardPagePut = (id: string, params: UpdateCardPageDto) => {
  return requestClient.put<CardPageVO>(`/event/admin/card-page/${id}`, params);
};

/**
 * @description: 删除页面/分组
 * @param id 路径参数
 * @url: /api/event/admin/card-page/{id}
 */
export const adminCardPageDelete = (id: string) => {
  return requestClient.delete<CardPageVO>(`/event/admin/card-page/${id}`);
};

// ==================== SDK - 身份管理 ====================

/**
 * @description: 绑定用户身份
 * @param projectId 路径参数
 * @param {BindIdentityDto} params
 * @url: /api/event/admin/identity/{projectId}/bind
 */
export const bind = (projectId: string, params: BindIdentityDto) => {
  return requestClient.post<BindResultVO>(
    `/event/admin/identity/${projectId}/bind`,
    params,
  );
};

/**
 * @description: 解绑用户身份
 * @param projectId 路径参数
 * @param {UnbindIdentityDto} params
 * @url: /api/event/admin/identity/{projectId}/unbind
 */
export const unbind = (projectId: string, params: UnbindIdentityDto) => {
  return requestClient.delete<UnbindResultVO>(
    `/event/admin/identity/${projectId}/unbind`,
    { params },
  );
};

// ==================== init ====================

/**
 * @description: 初始化集团默认数据
 * @url: /api/event/admin/init
 */
export const init = () => {
  return requestClient.post<any>('/event/admin/init');
};

/**
 * @description: 获取集团初始化状态
 * @param {StatusQueryDto} params
 * @url: /api/event/admin/init/status
 */
export const status = (params?: StatusQueryDto) => {
  return requestClient.get<any>('/event/admin/init/status', { params });
};

// ==================== Analyze - 数据分析 ====================

/**
 * @description: PV/UV 统计
 * @param {PvUvQueryDto} params
 * @url: /api/event/analysis/event/pv-uv
 */
export const pvUv = (params: PvUvQueryDto) => {
  return requestClient.post<PvUvResultListResponseVO>(
    '/event/analysis/event/pv-uv',
    params,
  );
};

/**
 * @description: 事件趋势
 * @param {EventTrendQueryDto} params
 * @url: /api/event/analysis/event/event-trend
 */
export const eventTrend = (params: EventTrendQueryDto) => {
  return requestClient.post<EventTrendListResponseVO>(
    '/event/analysis/event/event-trend',
    params,
  );
};

/**
 * @description: 实时统计
 * @param {RealtimeQueryDto} params
 * @url: /api/event/analysis/event/realtime
 */
export const realtime = (params?: RealtimeQueryDto) => {
  return requestClient.get<RealtimeStatsVO>('/event/analysis/event/realtime', {
    params,
  });
};

/**
 * @description: 热门页面
 * @param {TopPagesQueryDto} params
 * @url: /api/event/analysis/event/top-pages
 */
export const topPages = (params: TopPagesQueryDto) => {
  return requestClient.post<TopPageListResponseVO>(
    '/event/analysis/event/top-pages',
    params,
  );
};

/**
 * @description: 概览统计
 * @param {OverviewQueryDto} params
 * @url: /api/event/analysis/event/overview
 */
export const overview = (params: OverviewQueryDto) => {
  return requestClient.post<OverviewStatsVO>(
    '/event/analysis/event/overview',
    params,
  );
};

// ==================== Retention - 留存分析 ====================

/**
 * @description: 留存分析
 * @param {RetentionQueryDto} params
 * @url: /api/event/analysis/retention/analyze
 */
export const retentionAnalyze = (params: RetentionQueryDto) => {
  return requestClient.post<RetentionAnalysisListResponseVO>(
    '/event/analysis/retention/analyze',
    params,
  );
};

/**
 * @description: 快速留存统计
 * @param {RetentionQueryDto} params
 * @url: /api/event/analysis/retention/quick
 */
export const quick = (params: RetentionQueryDto) => {
  return requestClient.post<QuickRetentionVO>(
    '/event/analysis/retention/quick',
    params,
  );
};

/**
 * @description: 留存矩阵
 * @param {RetentionMatrixQueryDto} params
 * @url: /api/event/analysis/retention/matrix
 */
export const matrix = (params: RetentionMatrixQueryDto) => {
  return requestClient.post<RetentionMatrixResponseVO>(
    '/event/analysis/retention/matrix',
    params,
  );
};

/**
 * @description: 分群留存分析
 * @param {CohortQueryDto} params
 * @url: /api/event/analysis/retention/cohort
 */
export const cohort = (params: CohortQueryDto) => {
  return requestClient.post<CohortAnalysisListResponseVO>(
    '/event/analysis/retention/cohort',
    params,
  );
};

// ==================== Path - 路径分析 ====================

/**
 * @description: 路径分析
 * @param {PathQueryDto} params
 * @url: /api/event/analysis/path/analyze
 */
export const pathAnalyze = (params: PathQueryDto) => {
  return requestClient.post<PathAnalysisVO>(
    '/event/analysis/path/analyze',
    params,
  );
};

/**
 * @description: 页面路径分析
 * @param {PagePathQueryDto} params
 * @url: /api/event/analysis/path/pages
 */
export const pages = (params: PagePathQueryDto) => {
  return requestClient.post<PagePathListResponseVO>(
    '/event/analysis/path/pages',
    params,
  );
};

/**
 * @description: 用户路径
 * @param {UserPathQueryDto} params
 * @url: /api/event/analysis/path/user
 */
export const user = (params: UserPathQueryDto) => {
  return requestClient.post<UserPathEventListResponseVO>(
    '/event/analysis/path/user',
    params,
  );
};

/**
 * @description: 会话路径
 * @param {SessionPathQueryDto} params
 * @url: /api/event/analysis/path/session
 */
export const session = (params: SessionPathQueryDto) => {
  return requestClient.post<SessionPathEventListResponseVO>(
    '/event/analysis/path/session',
    params,
  );
};

/**
 * @description: 热门路径
 * @param {TopPathsQueryDto} params
 * @url: /api/event/analysis/path/top
 */
export const top = (params: TopPathsQueryDto) => {
  return requestClient.post<TopPathListResponseVO>(
    '/event/analysis/path/top',
    params,
  );
};

/**
 * @description: 流向数据
 * @param {PathQueryDto} params
 * @url: /api/event/analysis/path/flow
 */
export const flow = (params: PathQueryDto) => {
  return requestClient.post<FlowDataVO>('/event/analysis/path/flow', params);
};

// ==================== Analysis - 用户分析 ====================

/**
 * @description: 查询用户关联
 * @param {RelationsQueryDto} params
 * @url: /api/event/analysis/user/relations
 */
export const relations = (params: RelationsQueryDto) => {
  return requestClient.get<UserRelationListResponseVO>(
    '/event/analysis/user/relations',
    { params },
  );
};

/**
 * @description: 获取用户身份
 * @param {UserIdentityDto} params
 * @url: /api/event/analysis/user/identities
 */
export const identities = (params: UserIdentityDto) => {
  return requestClient.post<UserIdentityVO>(
    '/event/analysis/user/identities',
    params,
  );
};

/**
 * @description: 用户完整旅程
 * @param {UserJourneyQueryDto} params
 * @url: /api/event/analysis/user/journey
 */
export const journey = (params: UserJourneyQueryDto) => {
  return requestClient.post<UserJourneyEventListResponseVO>(
    '/event/analysis/user/journey',
    params,
  );
};

/**
 * @description: 转化归因分析
 * @param {ConversionAttributionDto} params
 * @url: /api/event/analysis/user/attribution
 */
export const attribution = (params: ConversionAttributionDto) => {
  return requestClient.post<AttributionVO>(
    '/event/analysis/user/attribution',
    params,
  );
};

/**
 * @description: 跨设备行为
 * @param {CrossDeviceQueryDto} params
 * @url: /api/event/analysis/user/cross-device
 */
export const crossDevice = (params: CrossDeviceQueryDto) => {
  return requestClient.post<CrossDeviceVO>(
    '/event/analysis/user/cross-device',
    params,
  );
};

/**
 * @description: 合并用户身份
 * @param {MergeUsersDto} params
 * @url: /api/event/analysis/user/merge
 */
export const merge = (params: MergeUsersDto) => {
  return requestClient.post<MergeResultVO>(
    '/event/analysis/user/merge',
    params,
  );
};

/**
 * @description: 关联统计
 * @param projectId 路径参数
 * @url: /api/event/analysis/user/{projectId}/stats
 */
export const userStats = (projectId: string) => {
  return requestClient.get<RelationStatsVO>(
    `/event/analysis/user/${projectId}/stats`,
  );
};

/**
 * @description: 来源字段值
 * @param projectId 路径参数
 * @param {SourceValuesQueryDto} params
 * @url: /api/event/analysis/user/{projectId}/source-values
 */
export const sourceValues = (
  projectId: string,
  params: SourceValuesQueryDto,
) => {
  return requestClient.get<SourceValueListResponseVO>(
    `/event/analysis/user/${projectId}/source-values`,
    { params },
  );
};
