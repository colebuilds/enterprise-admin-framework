import { requestClient } from '#/api/request';
import {
  PaymentReportOverviewReq,
  PaymentReportOverviewRsp,
  PaymentTenantReportPageReq,
  PaymentTenantReportRowRspPageBaseResponseWithSum,
  PaymentChannelReportPageReq,
  PaymentChannelReportRowRspListPageBaseResponse,
  PaymentThirdPayMerchantReportPageReq,
  PaymentThirdPayMerchantReportRowRspListPageBaseResponse,
  PaymentRealtime24HourSummaryReq,
  PaymentRealtime24HourSummaryRsp,
  PaymentMultiTenantTrendReq,
  PaymentMultiTenantTrendRsp,
  PaymentMultiPeriodTrendReq,
  PaymentMultiPeriodTrendRsp,
  ThirdPayChannelWarningSummaryReq,
  ThirdPayChannelWarningSummaryRsp,
  ThirdPayChannelWarningPageListReq,
  ThirdPayChannelWarningPageListRspListPageBaseResponse,
  ThirdPayChannelWarningIdReq,
  ThirdPayChannelWarningDetailRsp,
  ThirdPayChannelWarningRuleConfigRsp,
  SaveThirdPayChannelWarningRuleConfigReq,
  ThirdPayChannelWarningOperateReq,
  ThirdPayChannelWarningBatchOperateReq,
  ThirdPayChannelWarningBatchOperateRsp
} from './types';

// 导出类型
export * from './types';

// ==================== PaymentReport ====================

/**
 * @description: 数据概况：充提差 + 代收/代付汇总 + 按天趋势 + 各商户对比 (Auth)
 * @param {PaymentReportOverviewReq} params
 * @url: /api/PaymentReport/GetPageList
 */
export const paymentReportGetPageList = (params: PaymentReportOverviewReq) => {
  return requestClient.post<PaymentReportOverviewRsp>('/PaymentReport/GetPageList', params);
}

/**
 * @description: 商户报表分页：每个 (TenantId, SysCurrency) 一行 + 跨全部页的总计。
同一接口被两个页面复用：商户报表页、三方商户号报表-产生数据的商户-查看详情弹窗。
多个 [CustomAuthCode] 取 OR：任意一个权限即可访问 (Auth)
 * @param {PaymentTenantReportPageReq} params
 * @url: /api/PaymentReport/GetTenantPageList
 */
export const getTenantPageList = (params: PaymentTenantReportPageReq) => {
  return requestClient.post<PaymentTenantReportRowRspPageBaseResponseWithSum>('/PaymentReport/GetTenantPageList', params);
}
/**
 * @description: 商户报表分页：每个 (TenantId, SysCurrency) 一行 + 跨全部页的总计。
同一接口被两个页面复用：商户报表页、三方商户号报表-产生数据的商户-查看详情弹窗。
多个 [CustomAuthCode] 取 OR：任意一个权限即可访问 (Auth)（导出，返回原生 blob 响应）
 * @param {PaymentTenantReportPageReq} params
 * @url: /api/PaymentReport/GetTenantPageList
 */
export const getTenantPageListExport = (params: PaymentTenantReportPageReq) => {
  return requestClient.post<Blob>('/PaymentReport/GetTenantPageList', params, { responseType: 'blob' });
}

/**
 * @description: 通道报表 / 商户通道明细 / 三方商户号产生数据的通道明细 共用接口，按 ChannelKind + ThirdPayMerchantIds + TenantIds 区分调用方。
多个 [CustomAuthCode] 取 OR (Auth)
 * @param {PaymentChannelReportPageReq} params
 * @url: /api/PaymentReport/GetChannelPageList
 */
export const getChannelPageList = (params: PaymentChannelReportPageReq) => {
  return requestClient.post<PaymentChannelReportRowRspListPageBaseResponse>('/PaymentReport/GetChannelPageList', params);
}
/**
 * @description: 通道报表 / 商户通道明细 / 三方商户号产生数据的通道明细 共用接口，按 ChannelKind + ThirdPayMerchantIds + TenantIds 区分调用方。
多个 [CustomAuthCode] 取 OR (Auth)（导出，返回原生 blob 响应）
 * @param {PaymentChannelReportPageReq} params
 * @url: /api/PaymentReport/GetChannelPageList
 */
export const getChannelPageListExport = (params: PaymentChannelReportPageReq) => {
  return requestClient.post<Blob>('/PaymentReport/GetChannelPageList', params, { responseType: 'blob' });
}

/**
 * @description: 三方商户号报表分页：每个 (ThirdPayMerchantId, SysCurrency) 一行 (Auth)
 * @param {PaymentThirdPayMerchantReportPageReq} params
 * @url: /api/PaymentReport/GetThirdPayMerchantPageList
 */
export const getThirdPayMerchantPageList = (params: PaymentThirdPayMerchantReportPageReq) => {
  return requestClient.post<PaymentThirdPayMerchantReportRowRspListPageBaseResponse>('/PaymentReport/GetThirdPayMerchantPageList', params);
}
/**
 * @description: 三方商户号报表分页：每个 (ThirdPayMerchantId, SysCurrency) 一行 (Auth)（导出，返回原生 blob 响应）
 * @param {PaymentThirdPayMerchantReportPageReq} params
 * @url: /api/PaymentReport/GetThirdPayMerchantPageList
 */
export const getThirdPayMerchantPageListExport = (params: PaymentThirdPayMerchantReportPageReq) => {
  return requestClient.post<Blob>('/PaymentReport/GetThirdPayMerchantPageList', params, { responseType: 'blob' });
}

/**
 * @description: 24小时报表-顶部实时汇总（充提差 / 代收 / 代付 + 同比对比） (Auth)
 * @param {PaymentRealtime24HourSummaryReq} params
 * @url: /api/PaymentReport/GetRealtimeSummary
 */
export const getRealtimeSummary = (params: PaymentRealtime24HourSummaryReq) => {
  return requestClient.post<PaymentRealtime24HourSummaryRsp>('/PaymentReport/GetRealtimeSummary', params);
}

/**
 * @description: 24小时报表-多商户走势（每商户一条线，无对比） (Auth)
 * @param {PaymentMultiTenantTrendReq} params
 * @url: /api/PaymentReport/GetMultiTenantTrend
 */
export const getMultiTenantTrend = (params: PaymentMultiTenantTrendReq) => {
  return requestClient.post<PaymentMultiTenantTrendRsp>('/PaymentReport/GetMultiTenantTrend', params);
}

/**
 * @description: 24小时报表-多周期聚合走势（每个 Period 一条线，跨选中商户聚合） (Auth)
 * @param {PaymentMultiPeriodTrendReq} params
 * @url: /api/PaymentReport/GetMultiPeriodTrend
 */
export const getMultiPeriodTrend = (params: PaymentMultiPeriodTrendReq) => {
  return requestClient.post<PaymentMultiPeriodTrendRsp>('/PaymentReport/GetMultiPeriodTrend', params);
}

// ==================== ThirdPayChannelWarning ====================

/**
 * @description: 查询汇总 (Auth)
 * @param {ThirdPayChannelWarningSummaryReq} params
 * @url: /api/ThirdPayChannelWarning/GetSummary
 */
export const getSummary = (params: ThirdPayChannelWarningSummaryReq) => {
  return requestClient.post<ThirdPayChannelWarningSummaryRsp>('/ThirdPayChannelWarning/GetSummary', params);
}

/**
 * @description: 分页查询 (Auth)
 * @param {ThirdPayChannelWarningPageListReq} params
 * @url: /api/ThirdPayChannelWarning/GetPageList
 */
export const thirdPayChannelWarningGetPageList = (params: ThirdPayChannelWarningPageListReq) => {
  return requestClient.post<ThirdPayChannelWarningPageListRspListPageBaseResponse>('/ThirdPayChannelWarning/GetPageList', params);
}
/**
 * @description: 分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {ThirdPayChannelWarningPageListReq} params
 * @url: /api/ThirdPayChannelWarning/GetPageList
 */
export const thirdPayChannelWarningGetPageListExport = (params: ThirdPayChannelWarningPageListReq) => {
  return requestClient.post<Blob>('/ThirdPayChannelWarning/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 查询详情 (Auth)
 * @param {ThirdPayChannelWarningIdReq} params
 * @url: /api/ThirdPayChannelWarning/Get
 */
export const get = (params: ThirdPayChannelWarningIdReq) => {
  return requestClient.post<ThirdPayChannelWarningDetailRsp>('/ThirdPayChannelWarning/Get', params);
}

/**
 * @description: 查询规则配置 (Auth)
 * @url: /api/ThirdPayChannelWarning/GetRuleConfig
 */
export const getRuleConfig = () => {
  return requestClient.post<ThirdPayChannelWarningRuleConfigRsp>('/ThirdPayChannelWarning/GetRuleConfig');
}

/**
 * @description: 保存规则配置 (Auth)
 * @param {SaveThirdPayChannelWarningRuleConfigReq} params
 * @url: /api/ThirdPayChannelWarning/SaveRuleConfig
 */
export const saveRuleConfig = (params: SaveThirdPayChannelWarningRuleConfigReq) => {
  return requestClient.post<any>('/ThirdPayChannelWarning/SaveRuleConfig', params);
}

/**
 * @description: 标记已处理 (Auth)
 * @param {ThirdPayChannelWarningOperateReq} params
 * @url: /api/ThirdPayChannelWarning/Handle
 */
export const handle = (params: ThirdPayChannelWarningOperateReq) => {
  return requestClient.post<any>('/ThirdPayChannelWarning/Handle', params);
}

/**
 * @description: 忽略 (Auth)
 * @param {ThirdPayChannelWarningOperateReq} params
 * @url: /api/ThirdPayChannelWarning/Ignore
 */
export const ignore = (params: ThirdPayChannelWarningOperateReq) => {
  return requestClient.post<any>('/ThirdPayChannelWarning/Ignore', params);
}

/**
 * @description: 批量标记已处理 (Auth)
 * @param {ThirdPayChannelWarningBatchOperateReq} params
 * @url: /api/ThirdPayChannelWarning/BatchHandle
 */
export const batchHandle = (params: ThirdPayChannelWarningBatchOperateReq) => {
  return requestClient.post<ThirdPayChannelWarningBatchOperateRsp>('/ThirdPayChannelWarning/BatchHandle', params);
}

/**
 * @description: 批量忽略 (Auth)
 * @param {ThirdPayChannelWarningBatchOperateReq} params
 * @url: /api/ThirdPayChannelWarning/BatchIgnore
 */
export const batchIgnore = (params: ThirdPayChannelWarningBatchOperateReq) => {
  return requestClient.post<ThirdPayChannelWarningBatchOperateRsp>('/ThirdPayChannelWarning/BatchIgnore', params);
}
