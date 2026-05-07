import { requestClient } from '#/api/request';
import {
  MasterApiRequest,
  IdNameRspListApiResponse,
  RechargeCategoryListReq,
  RechargeCategoryListRspListPageBaseResponse,
  RechargeCategoryGetReq,
  RechargeCategoryDetailRsp,
  RechargeCategoryAddReq,
  RechargeCategoryUpdateReq,
  RechargeCategoryStateReq,
  RechargeChannelBatchAddReq,
  RechargeChannelModelReq,
  UpdateStateReq,
  IdReq,
  TestRechargeSubmitReq,
  RechargeChannelTestSubmitRsp,
  TestUtrSubmitReq,
  RechargeChannelTestUtrRsp,
  TestRechargeNotifyReq,
  RechargeChannelTestNotifyRsp,
  MerchantChannelTreeReq,
  MerchantChannelTreeWrapperRsp,
  RechargeChannelDetailRsp,
  RechargeChannelListReq,
  RechargeChannelRspListPageBaseResponse,
  RechargeChannelDictionaryModelReq,
  ChannelDictionaryCategoryEnumListReq,
  RechargeChannelDictionaryDetailRsp,
  RechargeChannelDictionaryListReq,
  RechargeChannelDictionaryRspListPageBaseResponse,
  RechargeLocalBankCardSelectRspListApiResponse,
  RechargeLocalBankCardListReq,
  RechargeLocalBankCardListRspListPageBaseResponse,
  RechargeLocalBankCardGetReq,
  RechargeLocalBankCardDetailRsp,
  RechargeLocalBankCardAddReq,
  RechargeLocalBankCardUpdateReq,
  RechargeLocalBankCardStateReq,
  RechargeLocalBankCardDeleteReq,
  RechargeLocalUsdtAddReq,
  RechargeLocalUsdtUpdateReq,
  RechargeThirdPendingPageReq,
  RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse,
  RechargeLocalPendingPageReq,
  RechargeRecordPageReq,
  ConfirmRechargeOrderReq,
  CancelLocalRechargeOrderReq,
  BatchCancelLocalRechargeOrderReq,
  BatchCancelLocalRechargeOrderRsp,
  ThirdPayMerchantModelReq,
  PayCodeSelectDataReq,
  StringListApiResponse,
  PayCodeCurrencySelectRsp,
  ThirdPayMerchantReq,
  ThirdPayMerchantDetailRsp,
  ThirdPayMerchantListReq,
  ThirdPayMerchantRspListPageBaseResponse
} from './types';

// 导出类型
export * from './types';

// ==================== RechargeCategory ====================

/**
 * @description: 获取系统充值大类枚举全量列表(根据商户币种筛选，不过滤上限) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeCategory/GetRechargeCategoryEnumList
 */
export const rechargeCategoryGetRechargeCategoryEnumList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeCategory/GetRechargeCategoryEnumList', params);
}

/**
 * @description: 获取可新增的充值大类枚举列表(供新增下拉选择)
已达上限的类别不返回(ThirdCurrency最多8个，其它最多1个) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeCategory/GetAvailableCategoryEnumList
 */
export const getAvailableCategoryEnumList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeCategory/GetAvailableCategoryEnumList', params);
}

/**
 * @description: 获取充值大类下拉列表(供搜索栏下拉选择) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeCategory/GetSelectList
 */
export const getSelectList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeCategory/GetSelectList', params);
}

/**
 * @description: 分页查询充值大类列表
V3无数据时自动从V1同步 (Auth)
 * @param {RechargeCategoryListReq} params
 * @url: /api/RechargeCategory/GetPageList
 */
export const rechargeCategoryGetPageList = (params: RechargeCategoryListReq) => {
  return requestClient.post<RechargeCategoryListRspListPageBaseResponse>('/RechargeCategory/GetPageList', params);
}
/**
 * @description: 分页查询充值大类列表
V3无数据时自动从V1同步 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeCategoryListReq} params
 * @url: /api/RechargeCategory/GetPageList
 */
export const rechargeCategoryGetPageListExport = (params: RechargeCategoryListReq) => {
  return requestClient.post<Blob>('/RechargeCategory/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取充值大类详情 (Auth)
 * @param {RechargeCategoryGetReq} params
 * @url: /api/RechargeCategory/Get
 */
export const rechargeCategoryGet = (params: RechargeCategoryGetReq) => {
  return requestClient.post<RechargeCategoryDetailRsp>('/RechargeCategory/Get', params);
}

/**
 * @description: 新增充值大类(双写V1+V3)
ThirdCurrency可多次添加(只校验名称唯一)，其它大类每个商户只能添加一次
本地充值大类(LocalBank/LocalUPI/LocalEWallet/LocalUSDT)新增后自动绑定匹配通道 (Auth)
 * @param {RechargeCategoryAddReq} params
 * @url: /api/RechargeCategory/Add
 */
export const rechargeCategoryAdd = (params: RechargeCategoryAddReq) => {
  return requestClient.post<any>('/RechargeCategory/Add', params);
}

/**
 * @description: 编辑充值大类(双写V1+V3) (Auth)
 * @param {RechargeCategoryUpdateReq} params
 * @url: /api/RechargeCategory/Update
 */
export const rechargeCategoryUpdate = (params: RechargeCategoryUpdateReq) => {
  return requestClient.post<any>('/RechargeCategory/Update', params);
}

/**
 * @description: 变更状态(双写V1+V3) (Auth)
 * @param {RechargeCategoryStateReq} params
 * @url: /api/RechargeCategory/UpdateState
 */
export const rechargeCategoryUpdateState = (params: RechargeCategoryStateReq) => {
  return requestClient.post<any>('/RechargeCategory/UpdateState', params);
}

// ==================== RechargeChannel ====================

/**
 * @description: 批量新增充值通道 (Auth)
 * @param {RechargeChannelBatchAddReq} params
 * @url: /api/RechargeChannel/BatchAdd
 */
export const batchAdd = (params: RechargeChannelBatchAddReq) => {
  return requestClient.post<any>('/RechargeChannel/BatchAdd', params);
}

/**
 * @description: 修改充值通道 (Auth)
 * @param {RechargeChannelModelReq} params
 * @url: /api/RechargeChannel/Update
 */
export const rechargeChannelUpdate = (params: RechargeChannelModelReq) => {
  return requestClient.post<any>('/RechargeChannel/Update', params);
}

/**
 * @description: 修改充值通道状态 (Auth)
 * @param {UpdateStateReq} params
 * @url: /api/RechargeChannel/UpdateState
 */
export const rechargeChannelUpdateState = (params: UpdateStateReq) => {
  return requestClient.post<any>('/RechargeChannel/UpdateState', params);
}

/**
 * @description: 删除充值通道 (Auth)
 * @param {IdReq} params
 * @url: /api/RechargeChannel/Delete
 */
export const rechargeChannelDelete = (params: IdReq) => {
  return requestClient.post<any>('/RechargeChannel/Delete', params);
}

/**
 * @description: 代收测试拉单 (Auth)
 * @param {TestRechargeSubmitReq} params
 * @url: /api/RechargeChannel/TestRechargeSubmit
 */
export const testRechargeSubmit = (params: TestRechargeSubmitReq) => {
  return requestClient.post<RechargeChannelTestSubmitRsp>('/RechargeChannel/TestRechargeSubmit', params);
}

/**
 * @description: 代收测试提交UTR (Auth)
 * @param {TestUtrSubmitReq} params
 * @url: /api/RechargeChannel/TestUTRSubmit
 */
export const testUTRSubmit = (params: TestUtrSubmitReq) => {
  return requestClient.post<RechargeChannelTestUtrRsp>('/RechargeChannel/TestUTRSubmit', params);
}

/**
 * @description: 代收测试回调 (Auth)
 * @param {TestRechargeNotifyReq} params
 * @url: /api/RechargeChannel/TestRechargeNotify
 */
export const testRechargeNotify = (params: TestRechargeNotifyReq) => {
  return requestClient.post<RechargeChannelTestNotifyRsp>('/RechargeChannel/TestRechargeNotify', params);
}

/**
 * @description: 获取充值通道新增场景的商户通道树形数据 (Auth)
 * @param {MerchantChannelTreeReq} params
 * @url: /api/RechargeChannel/GetMerchantChannelTree
 */
export const getMerchantChannelTree = (params: MerchantChannelTreeReq) => {
  return requestClient.post<MerchantChannelTreeWrapperRsp>('/RechargeChannel/GetMerchantChannelTree', params);
}

/**
 * @description: 获取充值等级列表 (Auth)
 * @url: /api/RechargeChannel/GetRechargeLevelList
 */
export const getRechargeLevelList = () => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeChannel/GetRechargeLevelList');
}

/**
 * @description: 获取充值通道详情 (Auth)
 * @param {IdReq} params
 * @url: /api/RechargeChannel/Get
 */
export const rechargeChannelGet = (params: IdReq) => {
  return requestClient.post<RechargeChannelDetailRsp>('/RechargeChannel/Get', params);
}

/**
 * @description: 充值通道分页查询 (Auth)
 * @param {RechargeChannelListReq} params
 * @url: /api/RechargeChannel/GetPageList
 */
export const rechargeChannelGetPageList = (params: RechargeChannelListReq) => {
  return requestClient.post<RechargeChannelRspListPageBaseResponse>('/RechargeChannel/GetPageList', params);
}
/**
 * @description: 充值通道分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeChannelListReq} params
 * @url: /api/RechargeChannel/GetPageList
 */
export const rechargeChannelGetPageListExport = (params: RechargeChannelListReq) => {
  return requestClient.post<Blob>('/RechargeChannel/GetPageList', params, { responseType: 'blob' });
}

// ==================== RechargeChannelDictionary ====================

/**
 * @description: 修改充值通道字典 (Auth)
 * @param {RechargeChannelDictionaryModelReq} params
 * @url: /api/RechargeChannelDictionary/Update
 */
export const rechargeChannelDictionaryUpdate = (params: RechargeChannelDictionaryModelReq) => {
  return requestClient.post<any>('/RechargeChannelDictionary/Update', params);
}

/**
 * @description: 修改充值通道字典状态 (Auth)
 * @param {UpdateStateReq} params
 * @url: /api/RechargeChannelDictionary/UpdateState
 */
export const rechargeChannelDictionaryUpdateState = (params: UpdateStateReq) => {
  return requestClient.post<any>('/RechargeChannelDictionary/UpdateState', params);
}

/**
 * @description: 删除充值通道字典 (Auth)
 * @param {IdReq} params
 * @url: /api/RechargeChannelDictionary/Delete
 */
export const rechargeChannelDictionaryDelete = (params: IdReq) => {
  return requestClient.post<any>('/RechargeChannelDictionary/Delete', params);
}

/**
 * @description: 获取系统充值大类枚举列表 (Auth)
 * @param {ChannelDictionaryCategoryEnumListReq} params
 * @url: /api/RechargeChannelDictionary/GetRechargeCategoryEnumList
 */
export const rechargeChannelDictionaryGetRechargeCategoryEnumList = (params: ChannelDictionaryCategoryEnumListReq) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeChannelDictionary/GetRechargeCategoryEnumList', params);
}

/**
 * @description: 获取支付模式下拉列表 (Auth)
 * @url: /api/RechargeChannelDictionary/GetPayModeList
 */
export const getPayModeList = () => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeChannelDictionary/GetPayModeList');
}

/**
 * @description: 获取充值通道字典详情 (Auth)
 * @param {IdReq} params
 * @url: /api/RechargeChannelDictionary/Get
 */
export const rechargeChannelDictionaryGet = (params: IdReq) => {
  return requestClient.post<RechargeChannelDictionaryDetailRsp>('/RechargeChannelDictionary/Get', params);
}

/**
 * @description: 充值通道字典分页查询 (Auth)
 * @param {RechargeChannelDictionaryListReq} params
 * @url: /api/RechargeChannelDictionary/GetPageList
 */
export const rechargeChannelDictionaryGetPageList = (params: RechargeChannelDictionaryListReq) => {
  return requestClient.post<RechargeChannelDictionaryRspListPageBaseResponse>('/RechargeChannelDictionary/GetPageList', params);
}
/**
 * @description: 充值通道字典分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeChannelDictionaryListReq} params
 * @url: /api/RechargeChannelDictionary/GetPageList
 */
export const rechargeChannelDictionaryGetPageListExport = (params: RechargeChannelDictionaryListReq) => {
  return requestClient.post<Blob>('/RechargeChannelDictionary/GetPageList', params, { responseType: 'blob' });
}

// ==================== RechargeLocalBank ====================

/**
 * @description: 获取银行名称下拉列表(供新增/编辑选择银行) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeLocalBank/GetBankSelectList
 */
export const getBankSelectList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeLocalBank/GetBankSelectList', params);
}

/**
 * @description: 获取本地银行卡收款账户下拉列表 (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeLocalBank/GetRechargeLocalBankCardList
 */
export const getRechargeLocalBankCardList = (params: MasterApiRequest) => {
  return requestClient.post<RechargeLocalBankCardSelectRspListApiResponse>('/RechargeLocalBank/GetRechargeLocalBankCardList', params);
}

/**
 * @description: 分页查询本地银行卡收款账户列表 (Auth)
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalBank/GetPageList
 */
export const rechargeLocalBankGetPageList = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<RechargeLocalBankCardListRspListPageBaseResponse>('/RechargeLocalBank/GetPageList', params);
}
/**
 * @description: 分页查询本地银行卡收款账户列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalBank/GetPageList
 */
export const rechargeLocalBankGetPageListExport = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<Blob>('/RechargeLocalBank/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取本地银行卡收款账户详情 (Auth)
 * @param {RechargeLocalBankCardGetReq} params
 * @url: /api/RechargeLocalBank/Get
 */
export const rechargeLocalBankGet = (params: RechargeLocalBankCardGetReq) => {
  return requestClient.post<RechargeLocalBankCardDetailRsp>('/RechargeLocalBank/Get', params);
}

/**
 * @description: 新增本地银行卡收款账户 (Auth)
 * @param {RechargeLocalBankCardAddReq} params
 * @url: /api/RechargeLocalBank/Add
 */
export const rechargeLocalBankAdd = (params: RechargeLocalBankCardAddReq) => {
  return requestClient.post<any>('/RechargeLocalBank/Add', params);
}

/**
 * @description: 编辑本地银行卡收款账户 (Auth)
 * @param {RechargeLocalBankCardUpdateReq} params
 * @url: /api/RechargeLocalBank/Update
 */
export const rechargeLocalBankUpdate = (params: RechargeLocalBankCardUpdateReq) => {
  return requestClient.post<any>('/RechargeLocalBank/Update', params);
}

/**
 * @description: 变更本地银行卡收款账户状态 (Auth)
 * @param {RechargeLocalBankCardStateReq} params
 * @url: /api/RechargeLocalBank/UpdateState
 */
export const rechargeLocalBankUpdateState = (params: RechargeLocalBankCardStateReq) => {
  return requestClient.post<any>('/RechargeLocalBank/UpdateState', params);
}

/**
 * @description: 删除本地银行卡收款账户 (Auth)
 * @param {RechargeLocalBankCardDeleteReq} params
 * @url: /api/RechargeLocalBank/Delete
 */
export const rechargeLocalBankDelete = (params: RechargeLocalBankCardDeleteReq) => {
  return requestClient.post<any>('/RechargeLocalBank/Delete', params);
}

// ==================== RechargeLocalEWallet ====================

/**
 * @description: 获取钱包类型下拉列表(供搜索栏/新增/编辑选择钱包类型) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeLocalEWallet/GetEWalletTypeSelectList
 */
export const getEWalletTypeSelectList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeLocalEWallet/GetEWalletTypeSelectList', params);
}

/**
 * @description: 分页查询本地EWallet收款账户列表 (Auth)
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalEWallet/GetPageList
 */
export const rechargeLocalEWalletGetPageList = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<RechargeLocalBankCardListRspListPageBaseResponse>('/RechargeLocalEWallet/GetPageList', params);
}
/**
 * @description: 分页查询本地EWallet收款账户列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalEWallet/GetPageList
 */
export const rechargeLocalEWalletGetPageListExport = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<Blob>('/RechargeLocalEWallet/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取本地EWallet收款账户详情 (Auth)
 * @param {RechargeLocalBankCardGetReq} params
 * @url: /api/RechargeLocalEWallet/Get
 */
export const rechargeLocalEWalletGet = (params: RechargeLocalBankCardGetReq) => {
  return requestClient.post<RechargeLocalBankCardDetailRsp>('/RechargeLocalEWallet/Get', params);
}

/**
 * @description: 新增本地EWallet收款账户 (Auth)
 * @param {RechargeLocalBankCardAddReq} params
 * @url: /api/RechargeLocalEWallet/Add
 */
export const rechargeLocalEWalletAdd = (params: RechargeLocalBankCardAddReq) => {
  return requestClient.post<any>('/RechargeLocalEWallet/Add', params);
}

/**
 * @description: 编辑本地EWallet收款账户 (Auth)
 * @param {RechargeLocalBankCardUpdateReq} params
 * @url: /api/RechargeLocalEWallet/Update
 */
export const rechargeLocalEWalletUpdate = (params: RechargeLocalBankCardUpdateReq) => {
  return requestClient.post<any>('/RechargeLocalEWallet/Update', params);
}

/**
 * @description: 变更本地EWallet收款账户状态 (Auth)
 * @param {RechargeLocalBankCardStateReq} params
 * @url: /api/RechargeLocalEWallet/UpdateState
 */
export const rechargeLocalEWalletUpdateState = (params: RechargeLocalBankCardStateReq) => {
  return requestClient.post<any>('/RechargeLocalEWallet/UpdateState', params);
}

/**
 * @description: 删除本地EWallet收款账户 (Auth)
 * @param {RechargeLocalBankCardDeleteReq} params
 * @url: /api/RechargeLocalEWallet/Delete
 */
export const rechargeLocalEWalletDelete = (params: RechargeLocalBankCardDeleteReq) => {
  return requestClient.post<any>('/RechargeLocalEWallet/Delete', params);
}

// ==================== RechargeLocalUpi ====================

/**
 * @description: 分页查询本地UPI收款账户列表 (Auth)
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalUpi/GetPageList
 */
export const rechargeLocalUpiGetPageList = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<RechargeLocalBankCardListRspListPageBaseResponse>('/RechargeLocalUpi/GetPageList', params);
}
/**
 * @description: 分页查询本地UPI收款账户列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalUpi/GetPageList
 */
export const rechargeLocalUpiGetPageListExport = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<Blob>('/RechargeLocalUpi/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取本地UPI收款账户详情 (Auth)
 * @param {RechargeLocalBankCardGetReq} params
 * @url: /api/RechargeLocalUpi/Get
 */
export const rechargeLocalUpiGet = (params: RechargeLocalBankCardGetReq) => {
  return requestClient.post<RechargeLocalBankCardDetailRsp>('/RechargeLocalUpi/Get', params);
}

/**
 * @description: 新增本地UPI收款账户 (Auth)
 * @param {RechargeLocalBankCardAddReq} params
 * @url: /api/RechargeLocalUpi/Add
 */
export const rechargeLocalUpiAdd = (params: RechargeLocalBankCardAddReq) => {
  return requestClient.post<any>('/RechargeLocalUpi/Add', params);
}

/**
 * @description: 编辑本地UPI收款账户 (Auth)
 * @param {RechargeLocalBankCardUpdateReq} params
 * @url: /api/RechargeLocalUpi/Update
 */
export const rechargeLocalUpiUpdate = (params: RechargeLocalBankCardUpdateReq) => {
  return requestClient.post<any>('/RechargeLocalUpi/Update', params);
}

/**
 * @description: 变更本地UPI收款账户状态 (Auth)
 * @param {RechargeLocalBankCardStateReq} params
 * @url: /api/RechargeLocalUpi/UpdateState
 */
export const rechargeLocalUpiUpdateState = (params: RechargeLocalBankCardStateReq) => {
  return requestClient.post<any>('/RechargeLocalUpi/UpdateState', params);
}

/**
 * @description: 删除本地UPI收款账户 (Auth)
 * @param {RechargeLocalBankCardDeleteReq} params
 * @url: /api/RechargeLocalUpi/Delete
 */
export const rechargeLocalUpiDelete = (params: RechargeLocalBankCardDeleteReq) => {
  return requestClient.post<any>('/RechargeLocalUpi/Delete', params);
}

// ==================== RechargeLocalUsdt ====================

/**
 * @description: 获取USDT类型下拉列表(供新增/编辑选择USDT类型) (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/RechargeLocalUsdt/GetUsdtTypeSelectList
 */
export const getUsdtTypeSelectList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/RechargeLocalUsdt/GetUsdtTypeSelectList', params);
}

/**
 * @description: 分页查询本地USDT收款账户列表 (Auth)
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalUsdt/GetPageList
 */
export const rechargeLocalUsdtGetPageList = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<RechargeLocalBankCardListRspListPageBaseResponse>('/RechargeLocalUsdt/GetPageList', params);
}
/**
 * @description: 分页查询本地USDT收款账户列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeLocalBankCardListReq} params
 * @url: /api/RechargeLocalUsdt/GetPageList
 */
export const rechargeLocalUsdtGetPageListExport = (params: RechargeLocalBankCardListReq) => {
  return requestClient.post<Blob>('/RechargeLocalUsdt/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取本地USDT收款账户详情 (Auth)
 * @param {RechargeLocalBankCardGetReq} params
 * @url: /api/RechargeLocalUsdt/Get
 */
export const rechargeLocalUsdtGet = (params: RechargeLocalBankCardGetReq) => {
  return requestClient.post<RechargeLocalBankCardDetailRsp>('/RechargeLocalUsdt/Get', params);
}

/**
 * @description: 变更本地USDT收款账户状态 (Auth)
 * @param {RechargeLocalBankCardStateReq} params
 * @url: /api/RechargeLocalUsdt/UpdateState
 */
export const rechargeLocalUsdtUpdateState = (params: RechargeLocalBankCardStateReq) => {
  return requestClient.post<any>('/RechargeLocalUsdt/UpdateState', params);
}

/**
 * @description: 删除本地USDT收款账户 (Auth)
 * @param {RechargeLocalBankCardDeleteReq} params
 * @url: /api/RechargeLocalUsdt/Delete
 */
export const rechargeLocalUsdtDelete = (params: RechargeLocalBankCardDeleteReq) => {
  return requestClient.post<any>('/RechargeLocalUsdt/Delete', params);
}

/**
 * @description: 新增本地USDT收款账户(双写V1+V3)
USDT独立请求类，不含 minRechargeAmount/maxRechargeAmount/totalLimitAmount/totalLimitCount (Auth)
 * @param {RechargeLocalUsdtAddReq} params
 * @url: /api/RechargeLocalUsdt/Add
 */
export const rechargeLocalUsdtAdd = (params: RechargeLocalUsdtAddReq) => {
  return requestClient.post<any>('/RechargeLocalUsdt/Add', params);
}

/**
 * @description: 编辑本地USDT收款账户(双写V1+V3)
USDT独立请求类，不含 minRechargeAmount/maxRechargeAmount/totalLimitAmount/totalLimitCount (Auth)
 * @param {RechargeLocalUsdtUpdateReq} params
 * @url: /api/RechargeLocalUsdt/Update
 */
export const rechargeLocalUsdtUpdate = (params: RechargeLocalUsdtUpdateReq) => {
  return requestClient.post<any>('/RechargeLocalUsdt/Update', params);
}

// ==================== RechargeOrder ====================

/**
 * @description: 获取三方待入款分页列表 (Auth)
 * @param {RechargeThirdPendingPageReq} params
 * @url: /api/RechargeOrder/GetPageListThirdPending
 */
export const getPageListThirdPending = (params: RechargeThirdPendingPageReq) => {
  return requestClient.post<RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse>('/RechargeOrder/GetPageListThirdPending', params);
}
/**
 * @description: 获取三方待入款分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeThirdPendingPageReq} params
 * @url: /api/RechargeOrder/GetPageListThirdPending
 */
export const getPageListThirdPendingExport = (params: RechargeThirdPendingPageReq) => {
  return requestClient.post<Blob>('/RechargeOrder/GetPageListThirdPending', params, { responseType: 'blob' });
}

/**
 * @description: 获取本地待入款分页列表 (Auth)
 * @param {RechargeLocalPendingPageReq} params
 * @url: /api/RechargeOrder/GetPageListLocalPending
 */
export const getPageListLocalPending = (params: RechargeLocalPendingPageReq) => {
  return requestClient.post<RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse>('/RechargeOrder/GetPageListLocalPending', params);
}
/**
 * @description: 获取本地待入款分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeLocalPendingPageReq} params
 * @url: /api/RechargeOrder/GetPageListLocalPending
 */
export const getPageListLocalPendingExport = (params: RechargeLocalPendingPageReq) => {
  return requestClient.post<Blob>('/RechargeOrder/GetPageListLocalPending', params, { responseType: 'blob' });
}

/**
 * @description: 获取入款记录分页列表 (Auth)
 * @param {RechargeRecordPageReq} params
 * @url: /api/RechargeOrder/GetPageListRechargeRecord
 */
export const getPageListRechargeRecord = (params: RechargeRecordPageReq) => {
  return requestClient.post<RechargeOrderListRspListRechargeOrderSummaryRspPageBaseResponse>('/RechargeOrder/GetPageListRechargeRecord', params);
}
/**
 * @description: 获取入款记录分页列表 (Auth)（导出，返回原生 blob 响应）
 * @param {RechargeRecordPageReq} params
 * @url: /api/RechargeOrder/GetPageListRechargeRecord
 */
export const getPageListRechargeRecordExport = (params: RechargeRecordPageReq) => {
  return requestClient.post<Blob>('/RechargeOrder/GetPageListRechargeRecord', params, { responseType: 'blob' });
}

/**
 * @description: 三方待入款确认补单 (Auth)
 * @param {ConfirmRechargeOrderReq} params
 * @url: /api/RechargeOrder/ConfirmThirdPendingRechargeOrder
 */
export const confirmThirdPendingRechargeOrder = (params: ConfirmRechargeOrderReq) => {
  return requestClient.post<any>('/RechargeOrder/ConfirmThirdPendingRechargeOrder', params);
}

/**
 * @description: 本地待入款人工确认 (Auth)
 * @param {ConfirmRechargeOrderReq} params
 * @url: /api/RechargeOrder/ConfirmLocalRechargeOrder
 */
export const confirmLocalRechargeOrder = (params: ConfirmRechargeOrderReq) => {
  return requestClient.post<any>('/RechargeOrder/ConfirmLocalRechargeOrder', params);
}

/**
 * @description: 入款记录确认补单 (Auth)
 * @param {ConfirmRechargeOrderReq} params
 * @url: /api/RechargeOrder/ConfirmRecordRechargeOrder
 */
export const confirmRecordRechargeOrder = (params: ConfirmRechargeOrderReq) => {
  return requestClient.post<any>('/RechargeOrder/ConfirmRecordRechargeOrder', params);
}

/**
 * @description: 取消单笔本地充值订单 (Auth)
 * @param {CancelLocalRechargeOrderReq} params
 * @url: /api/RechargeOrder/CancelLocalRechargeOrder
 */
export const cancelLocalRechargeOrder = (params: CancelLocalRechargeOrderReq) => {
  return requestClient.post<any>('/RechargeOrder/CancelLocalRechargeOrder', params);
}

/**
 * @description: 批量取消本地充值订单 (Auth)
 * @param {BatchCancelLocalRechargeOrderReq} params
 * @url: /api/RechargeOrder/BatchCancelLocalRechargeOrder
 */
export const batchCancelLocalRechargeOrder = (params: BatchCancelLocalRechargeOrderReq) => {
  return requestClient.post<BatchCancelLocalRechargeOrderRsp>('/RechargeOrder/BatchCancelLocalRechargeOrder', params);
}

// ==================== ThirdPayMerchant ====================

/**
 * @description: 新增支代付三方商户 (Auth)
 * @param {ThirdPayMerchantModelReq} params
 * @url: /api/ThirdPayMerchant/Add
 */
export const thirdPayMerchantAdd = (params: ThirdPayMerchantModelReq) => {
  return requestClient.post<any>('/ThirdPayMerchant/Add', params);
}

/**
 * @description: 修改支代付三方商户 (Auth)
 * @param {ThirdPayMerchantModelReq} params
 * @url: /api/ThirdPayMerchant/Update
 */
export const thirdPayMerchantUpdate = (params: ThirdPayMerchantModelReq) => {
  return requestClient.post<any>('/ThirdPayMerchant/Update', params);
}

/**
 * @description: 修改支代付三方商户状态 (Auth)
 * @param {UpdateStateReq} params
 * @url: /api/ThirdPayMerchant/UpdateState
 */
export const thirdPayMerchantUpdateState = (params: UpdateStateReq) => {
  return requestClient.post<any>('/ThirdPayMerchant/UpdateState', params);
}

/**
 * @description: 删除支代付三方商户 (Auth)
 * @param {IdReq} params
 * @url: /api/ThirdPayMerchant/Delete
 */
export const thirdPayMerchantDelete = (params: IdReq) => {
  return requestClient.post<any>('/ThirdPayMerchant/Delete', params);
}

/**
 * @description: 获取新增场景的三方映射码下拉数据 (Auth)
 * @param {PayCodeSelectDataReq} params
 * @url: /api/ThirdPayMerchant/GetPayCodeSelectData
 */
export const getPayCodeSelectData = (params: PayCodeSelectDataReq) => {
  return requestClient.post<StringListApiResponse>('/ThirdPayMerchant/GetPayCodeSelectData', params);
}

/**
 * @description: 获取查询场景的三方映射码下拉数据 (Auth)
 * @param {PayCodeSelectDataReq} params
 * @url: /api/ThirdPayMerchant/GetThirdPayMerchantSelectData
 */
export const getThirdPayMerchantSelectData = (params: PayCodeSelectDataReq) => {
  return requestClient.post<PayCodeCurrencySelectRsp>('/ThirdPayMerchant/GetThirdPayMerchantSelectData', params);
}

/**
 * @description: 获取币种下拉数据 (Auth)
 * @url: /api/ThirdPayMerchant/GetSysCurrencySelectData
 */
export const getSysCurrencySelectData = () => {
  return requestClient.post<StringListApiResponse>('/ThirdPayMerchant/GetSysCurrencySelectData');
}

/**
 * @description: 获取支代付三方商户详情 (Auth)
 * @param {ThirdPayMerchantReq} params
 * @url: /api/ThirdPayMerchant/GetByPrimaryKey
 */
export const getByPrimaryKey = (params: ThirdPayMerchantReq) => {
  return requestClient.post<ThirdPayMerchantDetailRsp>('/ThirdPayMerchant/GetByPrimaryKey', params);
}

/**
 * @description: 支代付三方商户分页查询 (Auth)
 * @param {ThirdPayMerchantListReq} params
 * @url: /api/ThirdPayMerchant/GetPageList
 */
export const thirdPayMerchantGetPageList = (params: ThirdPayMerchantListReq) => {
  return requestClient.post<ThirdPayMerchantRspListPageBaseResponse>('/ThirdPayMerchant/GetPageList', params);
}
/**
 * @description: 支代付三方商户分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {ThirdPayMerchantListReq} params
 * @url: /api/ThirdPayMerchant/GetPageList
 */
export const thirdPayMerchantGetPageListExport = (params: ThirdPayMerchantListReq) => {
  return requestClient.post<Blob>('/ThirdPayMerchant/GetPageList', params, { responseType: 'blob' });
}
