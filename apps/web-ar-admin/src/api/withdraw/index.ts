import { requestClient, uploadFile } from '#/api/request';
import {
  IdNameRspListApiResponse,
  ChannelDictionaryCategoryEnumListReq,
  MasterApiRequest,
  WithdrawCategoryWithCountRsp,
  WithdrawCategoryWithCountSetReq,
  WithdrawCategoryListReq,
  WithdrawCategoryListRspListPageBaseResponse,
  WithdrawCategoryGetReq,
  WithdrawCategoryDetailRsp,
  WithdrawCategoryUpdateReq,
  WithdrawCategoryStateReq,
  WithdrawChannelBatchAddReq,
  WithdrawChannelModelReq,
  UpdateStateReq,
  IdReq,
  TestCreateWithdrawOrderReq,
  WithdrawChannelTestRsp,
  TestWithdrawNotifyReq,
  MerchantChannelTreeReq,
  MerchantChannelTreeWrapperRsp,
  WithdrawChannelDetailRsp,
  WithdrawChannelListReq,
  WithdrawChannelRspListPageBaseResponse,
  GetTestCurrencyWithdrawTypeReq,
  GetTestWithdrawCategoryReq,
  WithdrawChannelTestBankInfoRspListApiResponse,
  GetTestWithdrawBankCategoryInfoReq,
  TestQueryThirdChannelBalanceReq,
  TestCheckWithdrawOrderReq,
  WithdrawChannelDictionaryModelReq,
  WithdrawChannelDictionaryDetailRsp,
  WithdrawChannelDictionaryListReq,
  WithdrawChannelDictionaryRspListPageBaseResponse,
  WithdrawChannelGroupRspListApiResponse,
  WithdrawBankMappingPageReq,
  WithdrawBankMappingPageRspListPageBaseResponse,
  BatchImportBankMappingFormDto,
  WithdrawBankMappingImportRspListApiResponse,
  WithdrawBankMappingAddReq,
  WithdrawBankMappingEditReq,
  WithdrawBankMappingDeleteReq,
  WithdrawConfigGroupModelReq,
  WithdrawConfigGroupDetailRsp,
  WithdrawConfigGroupListReq,
  WithdrawConfigGroupRspListPageBaseResponse,
  WithdrawConfigGroupUserRspListApiResponse,
  MyAuditOrderPageReq,
  MyAuditOrderListRspListPageBaseObjResponse,
  WithdrawWorkStaffRealTimeStatePageReq,
  WithdrawWorkStaffRealTimeStateRspListPageBaseResponse,
  WithdrawProcessingOrderPageReq,
  WithdrawOrderListRspListWithdrawOrderSummaryRspPageBaseResponse,
  WithdrawWorkCurrentOrderPageReq,
  WithdrawWorkCurrentOrderListRspListPageBaseResponse,
  WithdrawAuditOrderDetailReq,
  WithdrawAuditOrderDetailRsp,
  WithdrawSubmitThirdPayReq,
  WithdrawManualConfirmReq,
  WithdrawManualCancelReq,
  RefreshWithdrawStateReq,
  WithdrawClearExceptionReq,
  WithdrawResetOrderReq,
  WithdrawOrderPageReq,
  WithdrawOrderAuditPageReq,
  WithdrawOrderAuditPageListRspListWithdrawOrderSummaryRspPageBaseResponse,
  WithdrawOrderAuditRecordListReq,
  WithdrawOrderAuditRecordRspListApiResponse,
  WithdrawOrderThirdPartyRecordListReq,
  WithdrawOrderThirdPartyRecordListRsp,
  WithdrawRecordPageReq,
  WithdrawRecordListRspListWithdrawRecordSummaryRspPageBaseResponse,
  WithdrawRecordUpdateRemarkReq,
  WithdrawStaticdayPageReq,
  WithdrawStaticdayListRspListPageBaseResponse,
  SearchTenantIdsRequest,
  WithdrawStaticdayDashboardRsp,
  WithdrawWarningPageReq,
  WithdrawWarningPageListRspListPageBaseResponse,
  OrderPoolWarningConfigRsp,
  SaveOrderPoolWarningConfigReq,
  WithdrawWarningRecordOperateReq,
  WithdrawStaticdayDetailReq,
  WithdrawStaticdayDetailRsp,
  WithdrawStaticdayCorrectWorkTimeReq,
  WithdrawUserActionReq,
  WithdrawAdminActionReq,
  WithdrawStartAuditReq,
  WithdrawTenantUserRspListApiResponse,
  WithdrawUserSelectListReq,
  WithdrawUserSelectItemRspListApiResponse,
  WithdrawAssignOrderReq,
  SysUserWorkDetailRsp
} from './types';

// 导出类型
export * from './types';

// ==================== WithdrawCategory ====================

/**
 * @description: 获取系统提现大类枚举列表(供新增/编辑下拉选择) (Auth)
 * @url: /api/WithdrawCategory/GetWithdrawCategoryEnumList
 */
export const getWithdrawCategoryEnumList = () => {
  return requestClient.post<IdNameRspListApiResponse>('/WithdrawCategory/GetWithdrawCategoryEnumList');
}

/**
 * @description: 获取通道字典可选的系统提现大类枚举列表 (Auth)
 * @param {ChannelDictionaryCategoryEnumListReq} params
 * @url: /api/WithdrawCategory/GetChannelWithdrawCategoryEnumList
 */
export const getChannelWithdrawCategoryEnumList = (params: ChannelDictionaryCategoryEnumListReq) => {
  return requestClient.post<IdNameRspListApiResponse>('/WithdrawCategory/GetChannelWithdrawCategoryEnumList', params);
}

/**
 * @description: 获取提现大类下拉列表(供搜索栏下拉选择) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/WithdrawCategory/GetSelectList
 */
export const getSelectList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/WithdrawCategory/GetSelectList', params);
}

/**
 * @description: 获取今日提现总次数配置(优先读V3，降级V1) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/WithdrawCategory/GetWithCount
 */
export const getWithCount = (params: MasterApiRequest) => {
  return requestClient.post<WithdrawCategoryWithCountRsp>('/WithdrawCategory/GetWithCount', params);
}

/**
 * @description: 设置今日提现总次数配置(双写V1+V3，刷新V1缓存) (Auth)
 * @param {WithdrawCategoryWithCountSetReq} params
 * @url: /api/WithdrawCategory/SetWithCount
 */
export const setWithCount = (params: WithdrawCategoryWithCountSetReq) => {
  return requestClient.post<any>('/WithdrawCategory/SetWithCount', params);
}

/**
 * @description: 分页查询提现大类列表(如果V3无数据则先从V1同步) (Auth)
 * @param {WithdrawCategoryListReq} params
 * @url: /api/WithdrawCategory/GetPageList
 */
export const withdrawCategoryGetPageList = (params: WithdrawCategoryListReq) => {
  return requestClient.post<WithdrawCategoryListRspListPageBaseResponse>('/WithdrawCategory/GetPageList', params);
}
/**
 * @description: 分页查询提现大类列表(如果V3无数据则先从V1同步) (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawCategoryListReq} params
 * @url: /api/WithdrawCategory/GetPageList
 */
export const withdrawCategoryGetPageListExport = (params: WithdrawCategoryListReq) => {
  return requestClient.post<Blob>('/WithdrawCategory/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取提现大类详情 (Auth)
 * @param {WithdrawCategoryGetReq} params
 * @url: /api/WithdrawCategory/Get
 */
export const withdrawCategoryGet = (params: WithdrawCategoryGetReq) => {
  return requestClient.post<WithdrawCategoryDetailRsp>('/WithdrawCategory/Get', params);
}

/**
 * @description: 编辑提现大类(双写V1+V3) (Auth)
 * @param {WithdrawCategoryUpdateReq} params
 * @url: /api/WithdrawCategory/Update
 */
export const withdrawCategoryUpdate = (params: WithdrawCategoryUpdateReq) => {
  return requestClient.post<any>('/WithdrawCategory/Update', params);
}

/**
 * @description: 变更状态(双写V1+V3) (Auth)
 * @param {WithdrawCategoryStateReq} params
 * @url: /api/WithdrawCategory/UpdateState
 */
export const withdrawCategoryUpdateState = (params: WithdrawCategoryStateReq) => {
  return requestClient.post<any>('/WithdrawCategory/UpdateState', params);
}

// ==================== WithdrawChannel ====================

/**
 * @description: 批量新增提现通道 (Auth)
 * @param {WithdrawChannelBatchAddReq} params
 * @url: /api/WithdrawChannel/BatchAdd
 */
export const batchAdd = (params: WithdrawChannelBatchAddReq) => {
  return requestClient.post<any>('/WithdrawChannel/BatchAdd', params);
}

/**
 * @description: 修改提现通道 (Auth)
 * @param {WithdrawChannelModelReq} params
 * @url: /api/WithdrawChannel/Update
 */
export const withdrawChannelUpdate = (params: WithdrawChannelModelReq) => {
  return requestClient.post<any>('/WithdrawChannel/Update', params);
}

/**
 * @description: 修改提现通道状态 (Auth)
 * @param {UpdateStateReq} params
 * @url: /api/WithdrawChannel/UpdateState
 */
export const withdrawChannelUpdateState = (params: UpdateStateReq) => {
  return requestClient.post<any>('/WithdrawChannel/UpdateState', params);
}

/**
 * @description: 删除提现通道 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawChannel/Delete
 */
export const withdrawChannelDelete = (params: IdReq) => {
  return requestClient.post<any>('/WithdrawChannel/Delete', params);
}

/**
 * @description: 代付测试拉单 (Auth)
 * @param {TestCreateWithdrawOrderReq} params
 * @url: /api/WithdrawChannel/TestCreateWithdrawOrder
 */
export const testCreateWithdrawOrder = (params: TestCreateWithdrawOrderReq) => {
  return requestClient.post<WithdrawChannelTestRsp>('/WithdrawChannel/TestCreateWithdrawOrder', params);
}

/**
 * @description: 代付测试回调 (Auth)
 * @param {TestWithdrawNotifyReq} params
 * @url: /api/WithdrawChannel/TestWithdrawNotify
 */
export const testWithdrawNotify = (params: TestWithdrawNotifyReq) => {
  return requestClient.post<WithdrawChannelTestRsp>('/WithdrawChannel/TestWithdrawNotify', params);
}

/**
 * @description: 获取提现通道新增场景的商户通道树形数据 (Auth)
 * @param {MerchantChannelTreeReq} params
 * @url: /api/WithdrawChannel/GetMerchantChannelTree
 */
export const getMerchantChannelTree = (params: MerchantChannelTreeReq) => {
  return requestClient.post<MerchantChannelTreeWrapperRsp>('/WithdrawChannel/GetMerchantChannelTree', params);
}

/**
 * @description: 获取提现通道详情 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawChannel/Get
 */
export const withdrawChannelGet = (params: IdReq) => {
  return requestClient.post<WithdrawChannelDetailRsp>('/WithdrawChannel/Get', params);
}

/**
 * @description: 提现通道分页查询 (Auth)
 * @param {WithdrawChannelListReq} params
 * @url: /api/WithdrawChannel/GetPageList
 */
export const withdrawChannelGetPageList = (params: WithdrawChannelListReq) => {
  return requestClient.post<WithdrawChannelRspListPageBaseResponse>('/WithdrawChannel/GetPageList', params);
}
/**
 * @description: 提现通道分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawChannelListReq} params
 * @url: /api/WithdrawChannel/GetPageList
 */
export const withdrawChannelGetPageListExport = (params: WithdrawChannelListReq) => {
  return requestClient.post<Blob>('/WithdrawChannel/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取测试币种对应提现类型列表 (Auth)
 * @param {GetTestCurrencyWithdrawTypeReq} params
 * @url: /api/WithdrawChannel/GetTestCurrencyWithdrawType
 */
export const getTestCurrencyWithdrawType = (params: GetTestCurrencyWithdrawTypeReq) => {
  return requestClient.post<IdNameRspListApiResponse>('/WithdrawChannel/GetTestCurrencyWithdrawType', params);
}

/**
 * @description: 获取测试提现资料 (Auth)
 * @param {GetTestWithdrawCategoryReq} params
 * @url: /api/WithdrawChannel/GetTestWithdrawCategory
 */
export const getTestWithdrawCategory = (params: GetTestWithdrawCategoryReq) => {
  return requestClient.post<WithdrawChannelTestBankInfoRspListApiResponse>('/WithdrawChannel/GetTestWithdrawCategory', params);
}

/**
 * @description: 获取测试提现资料联动信息 (Auth)
 * @param {GetTestWithdrawBankCategoryInfoReq} params
 * @url: /api/WithdrawChannel/GetTestWithdrawBankCategoryInfo
 */
export const getTestWithdrawBankCategoryInfo = (params: GetTestWithdrawBankCategoryInfoReq) => {
  return requestClient.post<WithdrawChannelTestBankInfoRspListApiResponse>('/WithdrawChannel/GetTestWithdrawBankCategoryInfo', params);
}

/**
 * @description: 代付测试查询三方通道余额 (Auth)
 * @param {TestQueryThirdChannelBalanceReq} params
 * @url: /api/WithdrawChannel/TestQueryThirdChannelBalance
 */
export const testQueryThirdChannelBalance = (params: TestQueryThirdChannelBalanceReq) => {
  return requestClient.post<WithdrawChannelTestRsp>('/WithdrawChannel/TestQueryThirdChannelBalance', params);
}

/**
 * @description: 代付测试查询订单 (Auth)
 * @param {TestCheckWithdrawOrderReq} params
 * @url: /api/WithdrawChannel/TestCheckWithdrawOrder
 */
export const testCheckWithdrawOrder = (params: TestCheckWithdrawOrderReq) => {
  return requestClient.post<WithdrawChannelTestRsp>('/WithdrawChannel/TestCheckWithdrawOrder', params);
}

// ==================== WithdrawChannelDictionary ====================

/**
 * @description: 修改提现通道字典 (Auth)
 * @param {WithdrawChannelDictionaryModelReq} params
 * @url: /api/WithdrawChannelDictionary/Update
 */
export const withdrawChannelDictionaryUpdate = (params: WithdrawChannelDictionaryModelReq) => {
  return requestClient.post<any>('/WithdrawChannelDictionary/Update', params);
}

/**
 * @description: 修改提现通道字典状态 (Auth)
 * @param {UpdateStateReq} params
 * @url: /api/WithdrawChannelDictionary/UpdateState
 */
export const withdrawChannelDictionaryUpdateState = (params: UpdateStateReq) => {
  return requestClient.post<any>('/WithdrawChannelDictionary/UpdateState', params);
}

/**
 * @description: 删除提现通道字典 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawChannelDictionary/Delete
 */
export const withdrawChannelDictionaryDelete = (params: IdReq) => {
  return requestClient.post<any>('/WithdrawChannelDictionary/Delete', params);
}

/**
 * @description: 获取提现通道字典详情 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawChannelDictionary/Get
 */
export const withdrawChannelDictionaryGet = (params: IdReq) => {
  return requestClient.post<WithdrawChannelDictionaryDetailRsp>('/WithdrawChannelDictionary/Get', params);
}

/**
 * @description: 提现通道字典分页查询 (Auth)
 * @param {WithdrawChannelDictionaryListReq} params
 * @url: /api/WithdrawChannelDictionary/GetPageList
 */
export const withdrawChannelDictionaryGetPageList = (params: WithdrawChannelDictionaryListReq) => {
  return requestClient.post<WithdrawChannelDictionaryRspListPageBaseResponse>('/WithdrawChannelDictionary/GetPageList', params);
}
/**
 * @description: 提现通道字典分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawChannelDictionaryListReq} params
 * @url: /api/WithdrawChannelDictionary/GetPageList
 */
export const withdrawChannelDictionaryGetPageListExport = (params: WithdrawChannelDictionaryListReq) => {
  return requestClient.post<Blob>('/WithdrawChannelDictionary/GetPageList', params, { responseType: 'blob' });
}

// ==================== WithdrawConfig ====================

/**
 * @description: 获取代付通道信息（PayCode → List<Id, Name>，无需权限） (Auth)
 * @url: /api/WithdrawConfig/GetWithdrawChannelGroupList
 */
export const getWithdrawChannelGroupList = () => {
  return requestClient.post<WithdrawChannelGroupRspListApiResponse>('/WithdrawConfig/GetWithdrawChannelGroupList');
}

/**
 * @description: 分页查询三方银行映射数据 (Auth)
 * @param {WithdrawBankMappingPageReq} params
 * @url: /api/WithdrawConfig/GetBankMappingPageList
 */
export const getBankMappingPageList = (params: WithdrawBankMappingPageReq) => {
  return requestClient.post<WithdrawBankMappingPageRspListPageBaseResponse>('/WithdrawConfig/GetBankMappingPageList', params);
}
/**
 * @description: 分页查询三方银行映射数据 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawBankMappingPageReq} params
 * @url: /api/WithdrawConfig/GetBankMappingPageList
 */
export const getBankMappingPageListExport = (params: WithdrawBankMappingPageReq) => {
  return requestClient.post<Blob>('/WithdrawConfig/GetBankMappingPageList', params, { responseType: 'blob' });
}

/**
 * @description: 批量导入CSV（格式：ChannelId,BankName,ThirdCode，第一行为表头） (Auth)
 * @param file 上传文件
 * @param {BatchImportBankMappingFormDto} params
 * @url: /api/WithdrawConfig/BatchImportBankMapping
 */
export const batchImportBankMapping = (file: File, params: Omit<BatchImportBankMappingFormDto, 'file'>) => {
  return uploadFile<WithdrawBankMappingImportRspListApiResponse>({ url: '/WithdrawConfig/BatchImportBankMapping' }, { files: [file], ...params }, 'file');
}

/**
 * @description: 新增三方银行映射记录 (Auth)
 * @param {WithdrawBankMappingAddReq} params
 * @url: /api/WithdrawConfig/AddBankMapping
 */
export const addBankMapping = (params: WithdrawBankMappingAddReq) => {
  return requestClient.post<any>('/WithdrawConfig/AddBankMapping', params);
}

/**
 * @description: 编辑三方银行映射记录 (Auth)
 * @param {WithdrawBankMappingEditReq} params
 * @url: /api/WithdrawConfig/EditBankMapping
 */
export const editBankMapping = (params: WithdrawBankMappingEditReq) => {
  return requestClient.post<any>('/WithdrawConfig/EditBankMapping', params);
}

/**
 * @description: 软删除三方银行映射记录 (Auth)
 * @param {WithdrawBankMappingDeleteReq} params
 * @url: /api/WithdrawConfig/DeleteBankMapping
 */
export const deleteBankMapping = (params: WithdrawBankMappingDeleteReq) => {
  return requestClient.post<any>('/WithdrawConfig/DeleteBankMapping', params);
}

// ==================== WithdrawConfigGroup ====================

/**
 * @description: 新增出款派单配置组别 (Auth)
 * @param {WithdrawConfigGroupModelReq} params
 * @url: /api/WithdrawConfigGroup/Add
 */
export const add = (params: WithdrawConfigGroupModelReq) => {
  return requestClient.post<any>('/WithdrawConfigGroup/Add', params);
}

/**
 * @description: 编辑出款派单配置组别 (Auth)
 * @param {WithdrawConfigGroupModelReq} params
 * @url: /api/WithdrawConfigGroup/Update
 */
export const withdrawConfigGroupUpdate = (params: WithdrawConfigGroupModelReq) => {
  return requestClient.post<any>('/WithdrawConfigGroup/Update', params);
}

/**
 * @description: 删除出款派单配置组别 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawConfigGroup/Delete
 */
export const withdrawConfigGroupDelete = (params: IdReq) => {
  return requestClient.post<any>('/WithdrawConfigGroup/Delete', params);
}

/**
 * @description: 获取出款派单配置组别详情 
出款员工操作台也使用了该地址 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawConfigGroup/Get
 */
export const withdrawConfigGroupGet = (params: IdReq) => {
  return requestClient.post<WithdrawConfigGroupDetailRsp>('/WithdrawConfigGroup/Get', params);
}

/**
 * @description: 获取出款派单配置组别列表（分页） (Auth)
 * @param {WithdrawConfigGroupListReq} params
 * @url: /api/WithdrawConfigGroup/GetPageList
 */
export const withdrawConfigGroupGetPageList = (params: WithdrawConfigGroupListReq) => {
  return requestClient.post<WithdrawConfigGroupRspListPageBaseResponse>('/WithdrawConfigGroup/GetPageList', params);
}
/**
 * @description: 获取出款派单配置组别列表（分页） (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawConfigGroupListReq} params
 * @url: /api/WithdrawConfigGroup/GetPageList
 */
export const withdrawConfigGroupGetPageListExport = (params: WithdrawConfigGroupListReq) => {
  return requestClient.post<Blob>('/WithdrawConfigGroup/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 按组别ID获取组内用户列表 (Auth)
 * @param {IdReq} params
 * @url: /api/WithdrawConfigGroup/GetUsersByGroupId
 */
export const getUsersByGroupId = (params: IdReq) => {
  return requestClient.post<WithdrawConfigGroupUserRspListApiResponse>('/WithdrawConfigGroup/GetUsersByGroupId', params);
}

/**
 * @description: 获取出款派单配置组别下拉 (Auth)
 * @url: /api/WithdrawConfigGroup/GetAll
 */
export const getAll = () => {
  return requestClient.post<IdNameRspListApiResponse>('/WithdrawConfigGroup/GetAll');
}

/**
 * @description: 获取派单模式枚举列表 (Auth)
 * @url: /api/WithdrawConfigGroup/GetOrderDispatchModeEnumList
 */
export const getOrderDispatchModeEnumList = () => {
  return requestClient.post<IdNameRspListApiResponse>('/WithdrawConfigGroup/GetOrderDispatchModeEnumList');
}

// ==================== WithdrawOrder ====================

/**
 * @description: 获取我的待审核订单分页列表 (Auth)
 * @param {MyAuditOrderPageReq} params
 * @url: /api/WithdrawOrder/GetMyAuditOrderList
 */
export const getMyAuditOrderList = (params: MyAuditOrderPageReq) => {
  return requestClient.post<MyAuditOrderListRspListPageBaseObjResponse>('/WithdrawOrder/GetMyAuditOrderList', params);
}
/**
 * @description: 获取我的待审核订单分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {MyAuditOrderPageReq} params
 * @url: /api/WithdrawOrder/GetMyAuditOrderList
 */
export const getMyAuditOrderListExport = (params: MyAuditOrderPageReq) => {
  return requestClient.post<Blob>('/WithdrawOrder/GetMyAuditOrderList', params, { responseType: 'blob' });
}

/**
 * @description: 获取员工实时状态分页列表 (Auth)
 * @param {WithdrawWorkStaffRealTimeStatePageReq} params
 * @url: /api/WithdrawOrder/GetStaffRealTimeStateList
 */
export const getStaffRealTimeStateList = (params: WithdrawWorkStaffRealTimeStatePageReq) => {
  return requestClient.post<WithdrawWorkStaffRealTimeStateRspListPageBaseResponse>('/WithdrawOrder/GetStaffRealTimeStateList', params);
}
/**
 * @description: 获取员工实时状态分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawWorkStaffRealTimeStatePageReq} params
 * @url: /api/WithdrawOrder/GetStaffRealTimeStateList
 */
export const getStaffRealTimeStateListExport = (params: WithdrawWorkStaffRealTimeStatePageReq) => {
  return requestClient.post<Blob>('/WithdrawOrder/GetStaffRealTimeStateList', params, { responseType: 'blob' });
}

/**
 * @description: 获取处理中订单分页列表 (Auth)
 * @param {WithdrawProcessingOrderPageReq} params
 * @url: /api/WithdrawOrder/GetProcessingOrderPageList
 */
export const getProcessingOrderPageList = (params: WithdrawProcessingOrderPageReq) => {
  return requestClient.post<WithdrawOrderListRspListWithdrawOrderSummaryRspPageBaseResponse>('/WithdrawOrder/GetProcessingOrderPageList', params);
}
/**
 * @description: 获取处理中订单分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawProcessingOrderPageReq} params
 * @url: /api/WithdrawOrder/GetProcessingOrderPageList
 */
export const getProcessingOrderPageListExport = (params: WithdrawProcessingOrderPageReq) => {
  return requestClient.post<Blob>('/WithdrawOrder/GetProcessingOrderPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取当前提现订单分页列表 (Auth)
 * @param {WithdrawWorkCurrentOrderPageReq} params
 * @url: /api/WithdrawOrder/GetCurrentWithdrawOrderList
 */
export const getCurrentWithdrawOrderList = (params: WithdrawWorkCurrentOrderPageReq) => {
  return requestClient.post<WithdrawWorkCurrentOrderListRspListPageBaseResponse>('/WithdrawOrder/GetCurrentWithdrawOrderList', params);
}
/**
 * @description: 获取当前提现订单分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawWorkCurrentOrderPageReq} params
 * @url: /api/WithdrawOrder/GetCurrentWithdrawOrderList
 */
export const getCurrentWithdrawOrderListExport = (params: WithdrawWorkCurrentOrderPageReq) => {
  return requestClient.post<Blob>('/WithdrawOrder/GetCurrentWithdrawOrderList', params, { responseType: 'blob' });
}

/**
 * @description: 获取提现订单审核详情 (Auth)
 * @param {WithdrawAuditOrderDetailReq} params
 * @url: /api/WithdrawOrder/GetAuditOrderDetail
 */
export const getAuditOrderDetail = (params: WithdrawAuditOrderDetailReq) => {
  return requestClient.post<WithdrawAuditOrderDetailRsp>('/WithdrawOrder/GetAuditOrderDetail', params);
}

/**
 * @description: 提交三方出款 (Auth)
 * @param {WithdrawSubmitThirdPayReq} params
 * @url: /api/WithdrawOrder/SubmitThirdPay
 */
export const submitThirdPay = (params: WithdrawSubmitThirdPayReq) => {
  return requestClient.post<any>('/WithdrawOrder/SubmitThirdPay', params);
}

/**
 * @description: 人工确认出款 (Auth)
 * @param {WithdrawManualConfirmReq} params
 * @url: /api/WithdrawOrder/ManualConfirm
 */
export const manualConfirm = (params: WithdrawManualConfirmReq) => {
  return requestClient.post<any>('/WithdrawOrder/ManualConfirm', params);
}

/**
 * @description: 人工取消出款 (Auth)
 * @param {WithdrawManualCancelReq} params
 * @url: /api/WithdrawOrder/ManualCancel
 */
export const manualCancel = (params: WithdrawManualCancelReq) => {
  return requestClient.post<any>('/WithdrawOrder/ManualCancel', params);
}

/**
 * @description: 刷新出款单状态（主动查询三方订单最新状态） (Auth)
 * @param {RefreshWithdrawStateReq} params
 * @url: /api/WithdrawOrder/RefreshWithdrawState
 */
export const refreshWithdrawState = (params: RefreshWithdrawStateReq) => {
  return requestClient.post<any>('/WithdrawOrder/RefreshWithdrawState', params);
}

/**
 * @description: 提现订单异常消除（重置异常/提交中的三方状态） (Auth)
 * @param {WithdrawClearExceptionReq} params
 * @url: /api/WithdrawOrder/ClearException
 */
export const clearException = (params: WithdrawClearExceptionReq) => {
  return requestClient.post<any>('/WithdrawOrder/ClearException', params);
}

/**
 * @description: 提现订单重审（重置已提交订单回到待审核状态） (Auth)
 * @param {WithdrawResetOrderReq} params
 * @url: /api/WithdrawOrder/ResetOrderToWait
 */
export const resetOrderToWait = (params: WithdrawResetOrderReq) => {
  return requestClient.post<any>('/WithdrawOrder/ResetOrderToWait', params);
}

/**
 * @description: 获取已处理订单明细分页列表 (Auth)
 * @param {WithdrawOrderPageReq} params
 * @url: /api/WithdrawOrder/GetPageList
 */
export const withdrawOrderGetPageList = (params: WithdrawOrderPageReq) => {
  return requestClient.post<WithdrawOrderListRspListWithdrawOrderSummaryRspPageBaseResponse>('/WithdrawOrder/GetPageList', params);
}
/**
 * @description: 获取已处理订单明细分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawOrderPageReq} params
 * @url: /api/WithdrawOrder/GetPageList
 */
export const withdrawOrderGetPageListExport = (params: WithdrawOrderPageReq) => {
  return requestClient.post<Blob>('/WithdrawOrder/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取已操作的订单明细 (Auth)
 * @param {WithdrawOrderAuditPageReq} params
 * @url: /api/WithdrawOrder/GetAuditPageList
 */
export const getAuditPageList = (params: WithdrawOrderAuditPageReq) => {
  return requestClient.post<WithdrawOrderAuditPageListRspListWithdrawOrderSummaryRspPageBaseResponse>('/WithdrawOrder/GetAuditPageList', params);
}
/**
 * @description: 获取已操作的订单明细 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawOrderAuditPageReq} params
 * @url: /api/WithdrawOrder/GetAuditPageList
 */
export const getAuditPageListExport = (params: WithdrawOrderAuditPageReq) => {
  return requestClient.post<Blob>('/WithdrawOrder/GetAuditPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取已处理订单审核记录列表 (Auth)
 * @param {WithdrawOrderAuditRecordListReq} params
 * @url: /api/WithdrawOrder/GetAuditRecordList
 */
export const getAuditRecordList = (params: WithdrawOrderAuditRecordListReq) => {
  return requestClient.post<WithdrawOrderAuditRecordRspListApiResponse>('/WithdrawOrder/GetAuditRecordList', params);
}

/**
 * @description: 预留获取已处理订单第三方记录列表 (Auth)
 * @param {WithdrawOrderThirdPartyRecordListReq} params
 * @url: /api/WithdrawOrder/GetThirdPartyRecordList
 */
export const getThirdPartyRecordList = (params: WithdrawOrderThirdPartyRecordListReq) => {
  return requestClient.post<WithdrawOrderThirdPartyRecordListRsp>('/WithdrawOrder/GetThirdPartyRecordList', params);
}

// ==================== WithdrawRecord ====================

/**
 * @description: 获取提现记录分页列表 (Auth)
 * @param {WithdrawRecordPageReq} params
 * @url: /api/WithdrawRecord/GetPageList
 */
export const withdrawRecordGetPageList = (params: WithdrawRecordPageReq) => {
  return requestClient.post<WithdrawRecordListRspListWithdrawRecordSummaryRspPageBaseResponse>('/WithdrawRecord/GetPageList', params);
}
/**
 * @description: 获取提现记录分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawRecordPageReq} params
 * @url: /api/WithdrawRecord/GetPageList
 */
export const withdrawRecordGetPageListExport = (params: WithdrawRecordPageReq) => {
  return requestClient.post<Blob>('/WithdrawRecord/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 更新提现记录备注 (Auth)
 * @param {WithdrawRecordUpdateRemarkReq} params
 * @url: /api/WithdrawRecord/UpdateRemark
 */
export const updateRemark = (params: WithdrawRecordUpdateRemarkReq) => {
  return requestClient.post<any>('/WithdrawRecord/UpdateRemark', params);
}

// ==================== WithdrawStaticDay ====================

/**
 * @description: 获取出款员工报表列表 (Auth)
 * @param {WithdrawStaticdayPageReq} params
 * @url: /api/WithdrawStaticDay/GetPageList
 */
export const withdrawStaticDayGetPageList = (params: WithdrawStaticdayPageReq) => {
  return requestClient.post<WithdrawStaticdayListRspListPageBaseResponse>('/WithdrawStaticDay/GetPageList', params);
}
/**
 * @description: 获取出款员工报表列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawStaticdayPageReq} params
 * @url: /api/WithdrawStaticDay/GetPageList
 */
export const withdrawStaticDayGetPageListExport = (params: WithdrawStaticdayPageReq) => {
  return requestClient.post<Blob>('/WithdrawStaticDay/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取出款工作台看板数据 (Auth)
 * @param {SearchTenantIdsRequest} params
 * @url: /api/WithdrawStaticDay/GetDashboardData
 */
export const getDashboardData = (params: SearchTenantIdsRequest) => {
  return requestClient.post<WithdrawStaticdayDashboardRsp>('/WithdrawStaticDay/GetDashboardData', params);
}

/**
 * @description: 获取出款异常风控预警分页列表 (Auth)
 * @param {WithdrawWarningPageReq} params
 * @url: /api/WithdrawStaticDay/GetWithdrawWarningList
 */
export const getWithdrawWarningList = (params: WithdrawWarningPageReq) => {
  return requestClient.post<WithdrawWarningPageListRspListPageBaseResponse>('/WithdrawStaticDay/GetWithdrawWarningList', params);
}
/**
 * @description: 获取出款异常风控预警分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WithdrawWarningPageReq} params
 * @url: /api/WithdrawStaticDay/GetWithdrawWarningList
 */
export const getWithdrawWarningListExport = (params: WithdrawWarningPageReq) => {
  return requestClient.post<Blob>('/WithdrawStaticDay/GetWithdrawWarningList', params, { responseType: 'blob' });
}

/**
 * @description: 获取订单池预警配置 (Auth)
 * @url: /api/WithdrawStaticDay/GetOrderPoolWarningConfig
 */
export const getOrderPoolWarningConfig = () => {
  return requestClient.post<OrderPoolWarningConfigRsp>('/WithdrawStaticDay/GetOrderPoolWarningConfig');
}

/**
 * @description: 保存订单池预警配置（按币种设置待派发订单数预警阈值与推送频率） (Auth)
 * @param {SaveOrderPoolWarningConfigReq} params
 * @url: /api/WithdrawStaticDay/SaveOrderPoolWarningConfig
 */
export const saveOrderPoolWarningConfig = (params: SaveOrderPoolWarningConfigReq) => {
  return requestClient.post<any>('/WithdrawStaticDay/SaveOrderPoolWarningConfig', params);
}

/**
 * @description: 解除异常记录(异常风控预警列表的"解除异常"按钮：把指定预警记录置为已处理；如该员工还在因此异常状态中，顺带恢复) (Auth)
 * @param {WithdrawWarningRecordOperateReq} params
 * @url: /api/WithdrawStaticDay/RecoverExceptionRecord
 */
export const recoverExceptionRecord = (params: WithdrawWarningRecordOperateReq) => {
  return requestClient.post<any>('/WithdrawStaticDay/RecoverExceptionRecord', params);
}

/**
 * @description: 获取出款员工每日统计数据 (Auth)
 * @param {WithdrawStaticdayDetailReq} params
 * @url: /api/WithdrawStaticDay/GetDailyStatistics
 */
export const getDailyStatistics = (params: WithdrawStaticdayDetailReq) => {
  return requestClient.post<WithdrawStaticdayDetailRsp>('/WithdrawStaticDay/GetDailyStatistics', params);
}

/**
 * @description: 矫正员工上下班时间 (Auth)
 * @param {WithdrawStaticdayCorrectWorkTimeReq} params
 * @url: /api/WithdrawStaticDay/CorrectWorkTime
 */
export const correctWorkTime = (params: WithdrawStaticdayCorrectWorkTimeReq) => {
  return requestClient.post<any>('/WithdrawStaticDay/CorrectWorkTime', params);
}

// ==================== WithdrawUser ====================

/**
 * @description: 出款员工操作（上班/下班/开始接单/暂停/恢复） (Auth)
 * @param {WithdrawUserActionReq} params
 * @url: /api/WithdrawUser/WorkAction
 */
export const workAction = (params: WithdrawUserActionReq) => {
  return requestClient.post<any>('/WithdrawUser/WorkAction', params);
}

/**
 * @description: 开始派单（管理员） (Auth)
 * @param {WithdrawAdminActionReq} params
 * @url: /api/WithdrawUser/AdminStartDispatch
 */
export const adminStartDispatch = (params: WithdrawAdminActionReq) => {
  return requestClient.post<any>('/WithdrawUser/AdminStartDispatch', params);
}

/**
 * @description: 停止派单（管理员） (Auth)
 * @param {WithdrawAdminActionReq} params
 * @url: /api/WithdrawUser/AdminStopDispatch
 */
export const adminStopDispatch = (params: WithdrawAdminActionReq) => {
  return requestClient.post<any>('/WithdrawUser/AdminStopDispatch', params);
}

/**
 * @description: 解除用户异常 (Auth)
 * @param {WithdrawAdminActionReq} params
 * @url: /api/WithdrawUser/RecoverUserException
 */
export const recoverUserException = (params: WithdrawAdminActionReq) => {
  return requestClient.post<any>('/WithdrawUser/RecoverUserException', params);
}

/**
 * @description: 开始审核提现订单 (Auth)
 * @param {WithdrawStartAuditReq} params
 * @url: /api/WithdrawUser/WithdrawalStartAudit
 */
export const withdrawalStartAudit = (params: WithdrawStartAuditReq) => {
  return requestClient.post<any>('/WithdrawUser/WithdrawalStartAudit', params);
}

/**
 * @description: 获取当前用户可出款商户与用户关系 (Auth)
 * @url: /api/WithdrawUser/GetWithdrawTenantsWithUser
 */
export const getWithdrawTenantsWithUser = () => {
  return requestClient.post<WithdrawTenantUserRspListApiResponse>('/WithdrawUser/GetWithdrawTenantsWithUser');
}

/**
 * @description: 获取出款用户下拉列表（指派组长 / 转派订单） (Auth)
 * @param {WithdrawUserSelectListReq} params
 * @url: /api/WithdrawUser/GetStaffUserSelectList
 */
export const getStaffUserSelectList = (params: WithdrawUserSelectListReq) => {
  return requestClient.post<WithdrawUserSelectItemRspListApiResponse>('/WithdrawUser/GetStaffUserSelectList', params);
}

/**
 * @description: 转派提现订单（支持批量） (Auth)
 * @param {WithdrawAssignOrderReq} params
 * @url: /api/WithdrawUser/AssignOrder
 */
export const assignOrder = (params: WithdrawAssignOrderReq) => {
  return requestClient.post<any>('/WithdrawUser/AssignOrder', params);
}

/**
 * @description: 管理员转派提现订单（支持批量） (Auth)
 * @param {WithdrawAssignOrderReq} params
 * @url: /api/WithdrawUser/AdminAssignOrder
 */
export const adminAssignOrder = (params: WithdrawAssignOrderReq) => {
  return requestClient.post<any>('/WithdrawUser/AdminAssignOrder', params);
}

/**
 * @description: 获取当前系统用户出款工作详情 (Auth)
 * @url: /api/WithdrawUser/GetSysUserWorkDetail
 */
export const getSysUserWorkDetail = () => {
  return requestClient.post<SysUserWorkDetailRsp>('/WithdrawUser/GetSysUserWorkDetail');
}
