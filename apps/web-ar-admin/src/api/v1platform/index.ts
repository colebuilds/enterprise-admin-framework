import { requestClient, uploadFile } from '#/api/request';
import type {
  DictionaryRsp,
  UserManageReq,
  UserManageRspListUserManageSummaryRspPageBaseResponse,
  OnlineUserPageReq,
  OnlineUserPageRspListPageBaseResponse,
  UserDetailsReq,
  UserDetailsRsp,
  EditUserPwdReq,
  SetUserRemarkReq,
  UpdateActualCodingReq,
  SetBatchUserStateReq,
  UserBetTotalReq,
  UserBetTotalRspListUserBetTotalSummaryRspPageBaseResponse,
  UserWalletInfoRsp,
  UserRelativeReq,
  UserRelativeRspListUserRelativeSummaryRspPageBaseResponse,
  MasterApiRequest,
  IdNameRspListApiResponse,
  SubsetUserListReq,
  SubsetUserListRspListSubsetUserListSummaryRspPageBaseResponse,
  CodeNameRspListApiResponse,
  UserBankCardReq,
  UserBankCardRspListPageBaseResponse,
  UserBankCardAddReq,
  UserBankCardUpdateReq,
  UserBankCardDeleteReq,
  UserUsdtRspListPageBaseResponse,
  UserUsdtAddReq,
  UserUsdtUpdateReq,
  UserUsdtDeleteReq,
  UserCpfRspListPageBaseResponse,
  UserCpfAddReq,
  UserCpfUpdateReq,
  UserCpfDeleteReq,
  UserWalletPageRspListPageBaseResponse,
  UserWalletAddReq,
  UserWalletUpdateReq,
  UserWalletDeleteReq,
  UserUpiPageReq,
  UserUpiPageRspListPageBaseResponse,
  UserUpiAddReq,
  UserUpiUpdateReq,
  UserUpiDeleteReq,
  UserRealNameReq,
  UserRealNameRspListPageBaseResponse,
  UserRealNameUpdateReq,
  UserRealNameDeleteReq,
  MasterPageBaseRequest,
  GetGameCategoryListReq,
  GameCategoryVendorRspListApiResponse,
  GetGameListReq,
  GameListRspListApiResponse,
  LiveGamesBetRecordReq,
  LiveGamesBetRecordRspListLiveGamesBetRecordSummaryRspPageBaseResponse,
  ElectronicGamesBetRecordReq,
  ElectronicGamesBetRecordRspListElectronicGamesBetRecordSummaryRspPageBaseResponse,
  SportGamesBetRecordReq,
  SportGamesBetRecordRspListSportGamesBetRecordSummaryRspPageBaseResponse,
  ChessGamesBetRecordReq,
  ChessGamesBetRecordRspListChessGamesBetRecordSummaryRspPageBaseResponse,
  LotteryGameOrderReq,
  LotteryGameOrderRspListLotteryGameOrderSummaryRspPageBaseResponse,
  FXosoGameBettingReq,
  FXosoGameBettingRspListFXosoGameBettingSummaryRspPageBaseResponse,
  NewLotteryBetRecordReq,
  NewLotteryBetRecordRspListNewLotteryBetRecordSummaryRspPageBaseResponse,
  FinanceRecordReq,
  FinanceRecordRspListFinanceRecordSummaryRspPageBaseResponse,
  FinanceUpdateRemarkReq,
  WebLogReq,
  WebLogRspListPageBaseResponse,
  TabBanksPageReq,
  TabBanksRspListPageBaseResponse,
  TabBanksChangeStateReq,
  OnlineBankingSmsPageReq,
  OnlineBankingSmsRspListPageBaseResponse,
  ManualRechargeRecordsPageReq,
  ManualRechargeRecordRspListPageBaseResponse,
  ManualRechargeApprovalListPageReq,
  ManualRechargeApprovalListRspListPageBaseResponse,
  ManualRechargeApproveReq,
  ManualRechargeRejectReq,
  GetRechargeUserInfoReq,
  GetRechargeUserInfoRsp,
  SubmitManualRechargeReq,
  SubmitManualRechargeRsp,
  InitBatchRechargeFileFormDto,
  InitBatchRechargeFileRsp,
  ImportBatchRechargeDataReq,
  ImportBatchRechargeDataRsp,
  PlatformLogReq,
  PlatformLogRspListPageBaseResponse,
  StringListApiResponse
} from './types';

// 导出类型
export * from './types';

// ==================== V1Platform ====================

/**
 * @description: 获取公共字典映射 (Auth)
 * @url: /api/v1/Common/GetDictionary
 */
export const getDictionary = () => {
  return requestClient.post<DictionaryRsp>('/v1/Common/GetDictionary');
}

/**
 * @description: 分页获取会员列表 (Auth)
 * @param {UserManageReq} params
 * @url: /api/v1/Users/GetUserPageList
 */
export const getUserPageList = (params: UserManageReq) => {
  return requestClient.post<UserManageRspListUserManageSummaryRspPageBaseResponse>('/v1/Users/GetUserPageList', params);
}
/**
 * @description: 分页获取会员列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserManageReq} params
 * @url: /api/v1/Users/GetUserPageList
 */
export const getUserPageListExport = (params: UserManageReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取在线会员列表 (Auth)
 * @param {OnlineUserPageReq} params
 * @url: /api/v1/Users/GetOnlineUserPageList
 */
export const getOnlineUserPageList = (params: OnlineUserPageReq) => {
  return requestClient.post<OnlineUserPageRspListPageBaseResponse>('/v1/Users/GetOnlineUserPageList', params);
}
/**
 * @description: 分页获取在线会员列表 (Auth)（导出，返回原生 blob 响应）
 * @param {OnlineUserPageReq} params
 * @url: /api/v1/Users/GetOnlineUserPageList
 */
export const getOnlineUserPageListExport = (params: OnlineUserPageReq) => {
  return requestClient.post<Blob>('/v1/Users/GetOnlineUserPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取会员详情 (Auth)
 * @param {UserDetailsReq} params
 * @url: /api/v1/Users/GetUserDetail
 */
export const getUserDetail = (params: UserDetailsReq) => {
  return requestClient.post<UserDetailsRsp>('/v1/Users/GetUserDetail', params);
}

/**
 * @description: 修改会员密码 (Auth)
 * @param {EditUserPwdReq} params
 * @url: /api/v1/Users/EditUserpwdSubmit
 */
export const editUserpwdSubmit = (params: EditUserPwdReq) => {
  return requestClient.post<any>('/v1/Users/EditUserpwdSubmit', params);
}

/**
 * @description: 设置用户备注 (Auth)
 * @param {SetUserRemarkReq} params
 * @url: /api/v1/Users/UpdateRemark
 */
export const usersUpdateRemark = (params: SetUserRemarkReq) => {
  return requestClient.post<any>('/v1/Users/UpdateRemark', params);
}

/**
 * @description: 设置打码量 (Auth)
 * @param {UpdateActualCodingReq} params
 * @url: /api/v1/Users/UpdateActualCoding
 */
export const updateActualCoding = (params: UpdateActualCodingReq) => {
  return requestClient.post<any>('/v1/Users/UpdateActualCoding', params);
}

/**
 * @description: 批量设置用户状态（State=0禁用，State=1启用，对应V1的SetBatchBan/SetBatchUnset） (Auth)
 * @param {SetBatchUserStateReq} params
 * @url: /api/v1/Users/SetBatchUserState
 */
export const setBatchUserState = (params: SetBatchUserStateReq) => {
  return requestClient.post<any>('/v1/Users/SetBatchUserState', params);
}

/**
 * @description: 获取用户打码统计报表 (Auth)
 * @param {UserBetTotalReq} params
 * @url: /api/v1/Users/GetUserBetTotal
 */
export const getUserBetTotal = (params: UserBetTotalReq) => {
  return requestClient.post<UserBetTotalRspListUserBetTotalSummaryRspPageBaseResponse>('/v1/Users/GetUserBetTotal', params);
}
/**
 * @description: 获取用户打码统计报表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserBetTotalReq} params
 * @url: /api/v1/Users/GetUserBetTotal
 */
export const getUserBetTotalExport = (params: UserBetTotalReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserBetTotal', params, { responseType: 'blob' });
}

/**
 * @description: 获取会员钱包信息列表（银行卡/电子钱包/UPI/NEWUPI/USDT，含银行名称） (Auth)
 * @param {UserDetailsReq} params
 * @url: /api/v1/Users/GetUserWalletInfo
 */
export const getUserWalletInfo = (params: UserDetailsReq) => {
  return requestClient.post<UserWalletInfoRsp>('/v1/Users/GetUserWalletInfo', params);
}

/**
 * @description: 分页获取会员层级列表 (Auth)
 * @param {UserRelativeReq} params
 * @url: /api/v1/Users/GetUserRelativePageList
 */
export const getUserRelativePageList = (params: UserRelativeReq) => {
  return requestClient.post<UserRelativeRspListUserRelativeSummaryRspPageBaseResponse>('/v1/Users/GetUserRelativePageList', params);
}
/**
 * @description: 分页获取会员层级列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserRelativeReq} params
 * @url: /api/v1/Users/GetUserRelativePageList
 */
export const getUserRelativePageListExport = (params: UserRelativeReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserRelativePageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取VIP等级列表（根据商户ID查询对应数据库） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Users/GetVipLevelList
 */
export const getVipLevelList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Users/GetVipLevelList', params);
}

/**
 * @description: 分页获取下级会员列表 (Auth)
 * @param {SubsetUserListReq} params
 * @url: /api/v1/Users/GetSubsetUserPageList
 */
export const getSubsetUserPageList = (params: SubsetUserListReq) => {
  return requestClient.post<SubsetUserListRspListSubsetUserListSummaryRspPageBaseResponse>('/v1/Users/GetSubsetUserPageList', params);
}
/**
 * @description: 分页获取下级会员列表 (Auth)（导出，返回原生 blob 响应）
 * @param {SubsetUserListReq} params
 * @url: /api/v1/Users/GetSubsetUserPageList
 */
export const getSubsetUserPageListExport = (params: SubsetUserListReq) => {
  return requestClient.post<Blob>('/v1/Users/GetSubsetUserPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取渠道列表（来自 tab_Channels，按商户ID查询） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Common/GetChannelList
 */
export const getChannelList = (params: MasterApiRequest) => {
  return requestClient.post<CodeNameRspListApiResponse>('/v1/Common/GetChannelList', params);
}

/**
 * @description: 获取会员分组列表（来自 tab_UserGroup，按商户ID查询） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Common/GetUserGroupList
 */
export const getUserGroupList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Common/GetUserGroupList', params);
}

/**
 * @description: 分页获取会员银行卡列表 (Auth)
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserBankCardPageList
 */
export const getUserBankCardPageList = (params: UserBankCardReq) => {
  return requestClient.post<UserBankCardRspListPageBaseResponse>('/v1/Users/GetUserBankCardPageList', params);
}
/**
 * @description: 分页获取会员银行卡列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserBankCardPageList
 */
export const getUserBankCardPageListExport = (params: UserBankCardReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserBankCardPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增会员银行卡 (Auth)
 * @param {UserBankCardAddReq} params
 * @url: /api/v1/Users/AddUserBankCard
 */
export const addUserBankCard = (params: UserBankCardAddReq) => {
  return requestClient.post<any>('/v1/Users/AddUserBankCard', params);
}

/**
 * @description: 编辑会员银行卡 (Auth)
 * @param {UserBankCardUpdateReq} params
 * @url: /api/v1/Users/UpdateUserBankCard
 */
export const updateUserBankCard = (params: UserBankCardUpdateReq) => {
  return requestClient.post<any>('/v1/Users/UpdateUserBankCard', params);
}

/**
 * @description: 删除会员银行卡 (Auth)
 * @param {UserBankCardDeleteReq} params
 * @url: /api/v1/Users/DeleteUserBankCard
 */
export const deleteUserBankCard = (params: UserBankCardDeleteReq) => {
  return requestClient.post<any>('/v1/Users/DeleteUserBankCard', params);
}

/**
 * @description: 分页获取会员USDT列表 (Auth)
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserUsdtPageList
 */
export const getUserUsdtPageList = (params: UserBankCardReq) => {
  return requestClient.post<UserUsdtRspListPageBaseResponse>('/v1/Users/GetUserUsdtPageList', params);
}
/**
 * @description: 分页获取会员USDT列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserUsdtPageList
 */
export const getUserUsdtPageListExport = (params: UserBankCardReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserUsdtPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增会员USDT钱包 (Auth)
 * @param {UserUsdtAddReq} params
 * @url: /api/v1/Users/AddUserUsdt
 */
export const addUserUsdt = (params: UserUsdtAddReq) => {
  return requestClient.post<any>('/v1/Users/AddUserUsdt', params);
}

/**
 * @description: 编辑会员USDT钱包 (Auth)
 * @param {UserUsdtUpdateReq} params
 * @url: /api/v1/Users/UpdateUserUsdt
 */
export const updateUserUsdt = (params: UserUsdtUpdateReq) => {
  return requestClient.post<any>('/v1/Users/UpdateUserUsdt', params);
}

/**
 * @description: 删除会员USDT钱包 (Auth)
 * @param {UserUsdtDeleteReq} params
 * @url: /api/v1/Users/DeleteUserUsdt
 */
export const deleteUserUsdt = (params: UserUsdtDeleteReq) => {
  return requestClient.post<any>('/v1/Users/DeleteUserUsdt', params);
}

/**
 * @description: 分页获取会员CPF列表 (Auth)
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserCpfPageList
 */
export const getUserCpfPageList = (params: UserBankCardReq) => {
  return requestClient.post<UserCpfRspListPageBaseResponse>('/v1/Users/GetUserCpfPageList', params);
}
/**
 * @description: 分页获取会员CPF列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserCpfPageList
 */
export const getUserCpfPageListExport = (params: UserBankCardReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserCpfPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增会员PIX钱包 (Auth)
 * @param {UserCpfAddReq} params
 * @url: /api/v1/Users/AddUserCpf
 */
export const addUserCpf = (params: UserCpfAddReq) => {
  return requestClient.post<any>('/v1/Users/AddUserCpf', params);
}

/**
 * @description: 编辑会员PIX钱包 (Auth)
 * @param {UserCpfUpdateReq} params
 * @url: /api/v1/Users/UpdateUserCpf
 */
export const updateUserCpf = (params: UserCpfUpdateReq) => {
  return requestClient.post<any>('/v1/Users/UpdateUserCpf', params);
}

/**
 * @description: 删除会员PIX钱包 (Auth)
 * @param {UserCpfDeleteReq} params
 * @url: /api/v1/Users/DeleteUserCpf
 */
export const deleteUserCpf = (params: UserCpfDeleteReq) => {
  return requestClient.post<any>('/v1/Users/DeleteUserCpf', params);
}

/**
 * @description: 分页获取会员钱包列表 (Auth)
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserWalletPageList
 */
export const getUserWalletPageList = (params: UserBankCardReq) => {
  return requestClient.post<UserWalletPageRspListPageBaseResponse>('/v1/Users/GetUserWalletPageList', params);
}
/**
 * @description: 分页获取会员钱包列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserBankCardReq} params
 * @url: /api/v1/Users/GetUserWalletPageList
 */
export const getUserWalletPageListExport = (params: UserBankCardReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserWalletPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增会员钱包 (Auth)
 * @param {UserWalletAddReq} params
 * @url: /api/v1/Users/AddUserWallet
 */
export const addUserWallet = (params: UserWalletAddReq) => {
  return requestClient.post<any>('/v1/Users/AddUserWallet', params);
}

/**
 * @description: 编辑会员钱包 (Auth)
 * @param {UserWalletUpdateReq} params
 * @url: /api/v1/Users/UpdateUserWallet
 */
export const updateUserWallet = (params: UserWalletUpdateReq) => {
  return requestClient.post<any>('/v1/Users/UpdateUserWallet', params);
}

/**
 * @description: 删除会员钱包 (Auth)
 * @param {UserWalletDeleteReq} params
 * @url: /api/v1/Users/DeleteUserWallet
 */
export const deleteUserWallet = (params: UserWalletDeleteReq) => {
  return requestClient.post<any>('/v1/Users/DeleteUserWallet', params);
}

/**
 * @description: 分页获取会员UPI列表 (Auth)
 * @param {UserUpiPageReq} params
 * @url: /api/v1/Users/GetUPIPageList
 */
export const getUPIPageList = (params: UserUpiPageReq) => {
  return requestClient.post<UserUpiPageRspListPageBaseResponse>('/v1/Users/GetUPIPageList', params);
}
/**
 * @description: 分页获取会员UPI列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserUpiPageReq} params
 * @url: /api/v1/Users/GetUPIPageList
 */
export const getUPIPageListExport = (params: UserUpiPageReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUPIPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增会员UPI (Auth)
 * @param {UserUpiAddReq} params
 * @url: /api/v1/Users/AddUPI
 */
export const addUPI = (params: UserUpiAddReq) => {
  return requestClient.post<any>('/v1/Users/AddUPI', params);
}

/**
 * @description: 编辑会员UPI (Auth)
 * @param {UserUpiUpdateReq} params
 * @url: /api/v1/Users/UpdateUPI
 */
export const updateUPI = (params: UserUpiUpdateReq) => {
  return requestClient.post<any>('/v1/Users/UpdateUPI', params);
}

/**
 * @description: 删除会员UPI (Auth)
 * @param {UserUpiDeleteReq} params
 * @url: /api/v1/Users/DeleteUPI
 */
export const deleteUPI = (params: UserUpiDeleteReq) => {
  return requestClient.post<any>('/v1/Users/DeleteUPI', params);
}

/**
 * @description: 分页获取用户实名认证列表 (Auth)
 * @param {UserRealNameReq} params
 * @url: /api/v1/Users/GetUserRealNamePageList
 */
export const getUserRealNamePageList = (params: UserRealNameReq) => {
  return requestClient.post<UserRealNameRspListPageBaseResponse>('/v1/Users/GetUserRealNamePageList', params);
}
/**
 * @description: 分页获取用户实名认证列表 (Auth)（导出，返回原生 blob 响应）
 * @param {UserRealNameReq} params
 * @url: /api/v1/Users/GetUserRealNamePageList
 */
export const getUserRealNamePageListExport = (params: UserRealNameReq) => {
  return requestClient.post<Blob>('/v1/Users/GetUserRealNamePageList', params, { responseType: 'blob' });
}

/**
 * @description: 编辑会员实名 (Auth)
 * @param {UserRealNameUpdateReq} params
 * @url: /api/v1/Users/UpdateUserRealName
 */
export const updateUserRealName = (params: UserRealNameUpdateReq) => {
  return requestClient.post<any>('/v1/Users/UpdateUserRealName', params);
}

/**
 * @description: 删除会员实名 (Auth)
 * @param {UserRealNameDeleteReq} params
 * @url: /api/v1/Users/DeleteUserRealName
 */
export const deleteUserRealName = (params: UserRealNameDeleteReq) => {
  return requestClient.post<any>('/v1/Users/DeleteUserRealName', params);
}

/**
 * @description: 获取银行卡类型下拉列表（根据商户ID查询对应数据库） (Auth)
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetBankTypeList
 */
export const getBankTypeList = (params: MasterPageBaseRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Users/GetBankTypeList', params);
}
/**
 * @description: 获取银行卡类型下拉列表（根据商户ID查询对应数据库） (Auth)（导出，返回原生 blob 响应）
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetBankTypeList
 */
export const getBankTypeListExport = (params: MasterPageBaseRequest) => {
  return requestClient.post<Blob>('/v1/Users/GetBankTypeList', params, { responseType: 'blob' });
}

/**
 * @description: 获取USDT类型下拉列表（根据商户ID查询对应数据库） (Auth)
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetUsdtTypeList
 */
export const getUsdtTypeList = (params: MasterPageBaseRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Users/GetUsdtTypeList', params);
}
/**
 * @description: 获取USDT类型下拉列表（根据商户ID查询对应数据库） (Auth)（导出，返回原生 blob 响应）
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetUsdtTypeList
 */
export const getUsdtTypeListExport = (params: MasterPageBaseRequest) => {
  return requestClient.post<Blob>('/v1/Users/GetUsdtTypeList', params, { responseType: 'blob' });
}

/**
 * @description: 获取CPF类型下拉列表（根据商户ID查询对应数据库） (Auth)
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetCpfTypeList
 */
export const getCpfTypeList = (params: MasterPageBaseRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Users/GetCpfTypeList', params);
}
/**
 * @description: 获取CPF类型下拉列表（根据商户ID查询对应数据库） (Auth)（导出，返回原生 blob 响应）
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetCpfTypeList
 */
export const getCpfTypeListExport = (params: MasterPageBaseRequest) => {
  return requestClient.post<Blob>('/v1/Users/GetCpfTypeList', params, { responseType: 'blob' });
}

/**
 * @description: 获取钱包类型下拉列表（根据商户ID查询对应数据库） (Auth)
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetWalletTypeList
 */
export const getWalletTypeList = (params: MasterPageBaseRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Users/GetWalletTypeList', params);
}
/**
 * @description: 获取钱包类型下拉列表（根据商户ID查询对应数据库） (Auth)（导出，返回原生 blob 响应）
 * @param {MasterPageBaseRequest} params
 * @url: /api/v1/Users/GetWalletTypeList
 */
export const getWalletTypeListExport = (params: MasterPageBaseRequest) => {
  return requestClient.post<Blob>('/v1/Users/GetWalletTypeList', params, { responseType: 'blob' });
}

/**
 * @description: 获取游戏大类厂商列表 (Auth)
 * @param {GetGameCategoryListReq} params
 * @url: /api/v1/ThirdGame/GetGameCategoryList
 */
export const getGameCategoryList = (params: GetGameCategoryListReq) => {
  return requestClient.post<GameCategoryVendorRspListApiResponse>('/v1/ThirdGame/GetGameCategoryList', params);
}

/**
 * @description: 获取子游戏列表 (Auth)
 * @param {GetGameListReq} params
 * @url: /api/v1/ThirdGame/GetGameList
 */
export const getGameList = (params: GetGameListReq) => {
  return requestClient.post<GameListRspListApiResponse>('/v1/ThirdGame/GetGameList', params);
}

/**
 * @description: 分页获取真人视讯投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:LiveGame:Export 按钮权限） (Auth)
 * @param {LiveGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetLiveGamesBetRecordPageList
 */
export const getLiveGamesBetRecordPageList = (params: LiveGamesBetRecordReq) => {
  return requestClient.post<LiveGamesBetRecordRspListLiveGamesBetRecordSummaryRspPageBaseResponse>('/v1/ThirdGame/GetLiveGamesBetRecordPageList', params);
}
/**
 * @description: 分页获取真人视讯投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:LiveGame:Export 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {LiveGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetLiveGamesBetRecordPageList
 */
export const getLiveGamesBetRecordPageListExport = (params: LiveGamesBetRecordReq) => {
  return requestClient.post<Blob>('/v1/ThirdGame/GetLiveGamesBetRecordPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取电子游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Electronic:Export 按钮权限） (Auth)
 * @param {ElectronicGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetElectronicGamesBetRecordPageList
 */
export const getElectronicGamesBetRecordPageList = (params: ElectronicGamesBetRecordReq) => {
  return requestClient.post<ElectronicGamesBetRecordRspListElectronicGamesBetRecordSummaryRspPageBaseResponse>('/v1/ThirdGame/GetElectronicGamesBetRecordPageList', params);
}
/**
 * @description: 分页获取电子游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Electronic:Export 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {ElectronicGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetElectronicGamesBetRecordPageList
 */
export const getElectronicGamesBetRecordPageListExport = (params: ElectronicGamesBetRecordReq) => {
  return requestClient.post<Blob>('/v1/ThirdGame/GetElectronicGamesBetRecordPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取体育游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Sport:Export 按钮权限） (Auth)
 * @param {SportGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetSportGamesBetRecordPageList
 */
export const getSportGamesBetRecordPageList = (params: SportGamesBetRecordReq) => {
  return requestClient.post<SportGamesBetRecordRspListSportGamesBetRecordSummaryRspPageBaseResponse>('/v1/ThirdGame/GetSportGamesBetRecordPageList', params);
}
/**
 * @description: 分页获取体育游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Sport:Export 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {SportGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetSportGamesBetRecordPageList
 */
export const getSportGamesBetRecordPageListExport = (params: SportGamesBetRecordReq) => {
  return requestClient.post<Blob>('/v1/ThirdGame/GetSportGamesBetRecordPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取棋牌游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Chess:Export 按钮权限） (Auth)
 * @param {ChessGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetChessGamesBetRecordPageList
 */
export const getChessGamesBetRecordPageList = (params: ChessGamesBetRecordReq) => {
  return requestClient.post<ChessGamesBetRecordRspListChessGamesBetRecordSummaryRspPageBaseResponse>('/v1/ThirdGame/GetChessGamesBetRecordPageList', params);
}
/**
 * @description: 分页获取棋牌游戏投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Chess:Export 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {ChessGamesBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetChessGamesBetRecordPageList
 */
export const getChessGamesBetRecordPageListExport = (params: ChessGamesBetRecordReq) => {
  return requestClient.post<Blob>('/v1/ThirdGame/GetChessGamesBetRecordPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取彩票游戏投注记录（合并 Win / 5D / K3 / Trx_Win，通过 GameCategory 区分彩种；IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:OldLottoExport 按钮权限） (Auth)
 * @param {LotteryGameOrderReq} params
 * @url: /api/v1/GameManage/GetLotteryGameOrderPageList
 */
export const getLotteryGameOrderPageList = (params: LotteryGameOrderReq) => {
  return requestClient.post<LotteryGameOrderRspListLotteryGameOrderSummaryRspPageBaseResponse>('/v1/GameManage/GetLotteryGameOrderPageList', params);
}
/**
 * @description: 分页获取彩票游戏投注记录（合并 Win / 5D / K3 / Trx_Win，通过 GameCategory 区分彩种；IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:OldLottoExport 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {LotteryGameOrderReq} params
 * @url: /api/v1/GameManage/GetLotteryGameOrderPageList
 */
export const getLotteryGameOrderPageListExport = (params: LotteryGameOrderReq) => {
  return requestClient.post<Blob>('/v1/GameManage/GetLotteryGameOrderPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取彩票游戏彩种类型列表（下拉数据） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/GameManage/GetLotteryGameCategoryList
 */
export const getLotteryGameCategoryList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/GameManage/GetLotteryGameCategoryList', params);
}

/**
 * @description: 分页获取极速XOSO投注记录 (Auth)
 * @param {FXosoGameBettingReq} params
 * @url: /api/v1/GameManage/GetFXosoGameBettingPageList
 */
export const getFXosoGameBettingPageList = (params: FXosoGameBettingReq) => {
  return requestClient.post<FXosoGameBettingRspListFXosoGameBettingSummaryRspPageBaseResponse>('/v1/GameManage/GetFXosoGameBettingPageList', params);
}
/**
 * @description: 分页获取极速XOSO投注记录 (Auth)（导出，返回原生 blob 响应）
 * @param {FXosoGameBettingReq} params
 * @url: /api/v1/GameManage/GetFXosoGameBettingPageList
 */
export const getFXosoGameBettingPageListExport = (params: FXosoGameBettingReq) => {
  return requestClient.post<Blob>('/v1/GameManage/GetFXosoGameBettingPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取Win游戏期号类型列表（来自 tab_Win_Game_Type，按商户ID查询） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Common/GetGameIssueTypeWinList
 */
export const getGameIssueTypeWinList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Common/GetGameIssueTypeWinList', params);
}

/**
 * @description: 获取Trx Win游戏期号类型列表（来自 tab_Trx_Win_Game_Type，按商户ID查询） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Common/GetGameIssueTypeTrxWinList
 */
export const getGameIssueTypeTrxWinList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Common/GetGameIssueTypeTrxWinList', params);
}

/**
 * @description: 获取5D游戏期号类型列表（来自 tab_5D_Game_Type，按商户ID查询） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Common/GetGameIssueType5DList
 */
export const getGameIssueType5DList = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Common/GetGameIssueType5DList', params);
}

/**
 * @description: 获取K3游戏期号类型列表（来自 tab_K3_Game_Type，按商户ID查询） (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/Common/GetGameIssueTypeK3List
 */
export const getGameIssueTypeK3List = (params: MasterApiRequest) => {
  return requestClient.post<IdNameRspListApiResponse>('/v1/Common/GetGameIssueTypeK3List', params);
}

/**
 * @description: 分页获取彩票游戏（NewLottery）投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:NewLottoExport 按钮权限） (Auth)
 * @param {NewLotteryBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetNewLotteryBetRecordPageList
 */
export const getNewLotteryBetRecordPageList = (params: NewLotteryBetRecordReq) => {
  return requestClient.post<NewLotteryBetRecordRspListNewLotteryBetRecordSummaryRspPageBaseResponse>('/v1/ThirdGame/GetNewLotteryBetRecordPageList', params);
}
/**
 * @description: 分页获取彩票游戏（NewLottery）投注记录（IsExport=true 时导出，需配置 Game:ThirdGame:Lottery:NewLottoExport 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {NewLotteryBetRecordReq} params
 * @url: /api/v1/ThirdGame/GetNewLotteryBetRecordPageList
 */
export const getNewLotteryBetRecordPageListExport = (params: NewLotteryBetRecordReq) => {
  return requestClient.post<Blob>('/v1/ThirdGame/GetNewLotteryBetRecordPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取账变记录 (Auth)
 * @param {FinanceRecordReq} params
 * @url: /api/v1/Finance/GetFinanceRecordPageList
 */
export const getFinanceRecordPageList = (params: FinanceRecordReq) => {
  return requestClient.post<FinanceRecordRspListFinanceRecordSummaryRspPageBaseResponse>('/v1/Finance/GetFinanceRecordPageList', params);
}
/**
 * @description: 分页获取账变记录 (Auth)（导出，返回原生 blob 响应）
 * @param {FinanceRecordReq} params
 * @url: /api/v1/Finance/GetFinanceRecordPageList
 */
export const getFinanceRecordPageListExport = (params: FinanceRecordReq) => {
  return requestClient.post<Blob>('/v1/Finance/GetFinanceRecordPageList', params, { responseType: 'blob' });
}

/**
 * @description: 修改账变备注 (Auth)
 * @param {FinanceUpdateRemarkReq} params
 * @url: /api/v1/Finance/UpdateRemark
 */
export const financeUpdateRemark = (params: FinanceUpdateRemarkReq) => {
  return requestClient.post<any>('/v1/Finance/UpdateRemark', params);
}

/**
 * @description: 分页获取前台日志列表 (Auth)
 * @param {WebLogReq} params
 * @url: /api/v1/System/GetWebLogPageList
 */
export const getWebLogPageList = (params: WebLogReq) => {
  return requestClient.post<WebLogRspListPageBaseResponse>('/v1/System/GetWebLogPageList', params);
}
/**
 * @description: 分页获取前台日志列表 (Auth)（导出，返回原生 blob 响应）
 * @param {WebLogReq} params
 * @url: /api/v1/System/GetWebLogPageList
 */
export const getWebLogPageListExport = (params: WebLogReq) => {
  return requestClient.post<Blob>('/v1/System/GetWebLogPageList', params, { responseType: 'blob' });
}

/**
 * @description: 银行字典 -  分页获取银行列表 (Auth)
 * @param {TabBanksPageReq} params
 * @url: /api/v1/Finance/GetTabBanksPageList
 */
export const getTabBanksPageList = (params: TabBanksPageReq) => {
  return requestClient.post<TabBanksRspListPageBaseResponse>('/v1/Finance/GetTabBanksPageList', params);
}
/**
 * @description: 银行字典 -  分页获取银行列表 (Auth)（导出，返回原生 blob 响应）
 * @param {TabBanksPageReq} params
 * @url: /api/v1/Finance/GetTabBanksPageList
 */
export const getTabBanksPageListExport = (params: TabBanksPageReq) => {
  return requestClient.post<Blob>('/v1/Finance/GetTabBanksPageList', params, { responseType: 'blob' });
}

/**
 * @description: 银行字典 - 变更银行状态 (Auth)
 * @param {TabBanksChangeStateReq} params
 * @url: /api/v1/Finance/UpdateStateTabBanks
 */
export const updateStateTabBanks = (params: TabBanksChangeStateReq) => {
  return requestClient.post<any>('/v1/Finance/UpdateStateTabBanks', params);
}

/**
 * @description: 获取网银收款卡号下拉列表（来自 tab_RechargesBank） (Auth)
 * @url: /api/v1/Common/GetOnlineBankingBankList
 */
export const getOnlineBankingBankList = () => {
  return requestClient.post<CodeNameRspListApiResponse>('/v1/Common/GetOnlineBankingBankList');
}

/**
 * @description: 分页获取短信收款记录 (Auth)
 * @param {OnlineBankingSmsPageReq} params
 * @url: /api/v1/Recharge/GetOnlineBankingSmsPageList
 */
export const getOnlineBankingSmsPageList = (params: OnlineBankingSmsPageReq) => {
  return requestClient.post<OnlineBankingSmsRspListPageBaseResponse>('/v1/Recharge/GetOnlineBankingSmsPageList', params);
}
/**
 * @description: 分页获取短信收款记录 (Auth)（导出，返回原生 blob 响应）
 * @param {OnlineBankingSmsPageReq} params
 * @url: /api/v1/Recharge/GetOnlineBankingSmsPageList
 */
export const getOnlineBankingSmsPageListExport = (params: OnlineBankingSmsPageReq) => {
  return requestClient.post<Blob>('/v1/Recharge/GetOnlineBankingSmsPageList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取人工充值记录（IsExport=true 时导出，需配置 Finance:ManualRecharge:ApprovalRecordPage:Export 按钮权限） (Auth)
 * @param {ManualRechargeRecordsPageReq} params
 * @url: /api/v1/Recharge/GetManualRechargeRecordsPageList
 */
export const getManualRechargeRecordsPageList = (params: ManualRechargeRecordsPageReq) => {
  return requestClient.post<ManualRechargeRecordRspListPageBaseResponse>('/v1/Recharge/GetManualRechargeRecordsPageList', params);
}
/**
 * @description: 分页获取人工充值记录（IsExport=true 时导出，需配置 Finance:ManualRecharge:ApprovalRecordPage:Export 按钮权限） (Auth)（导出，返回原生 blob 响应）
 * @param {ManualRechargeRecordsPageReq} params
 * @url: /api/v1/Recharge/GetManualRechargeRecordsPageList
 */
export const getManualRechargeRecordsPageListExport = (params: ManualRechargeRecordsPageReq) => {
  return requestClient.post<Blob>('/v1/Recharge/GetManualRechargeRecordsPageList', params, { responseType: 'blob' });
}

/**
 * @description: 导出后台操作审核列表（State 固定为审核中） (Auth)
 * @param {ManualRechargeApprovalListPageReq} params
 * @url: /api/v1/Recharge/ExportManualRechargeApprovalList
 */
export const exportManualRechargeApprovalList = (params: ManualRechargeApprovalListPageReq) => {
  return requestClient.post<ManualRechargeRecordRspListPageBaseResponse>('/v1/Recharge/ExportManualRechargeApprovalList', params);
}
/**
 * @description: 导出后台操作审核列表（State 固定为审核中） (Auth)（导出，返回原生 blob 响应）
 * @param {ManualRechargeApprovalListPageReq} params
 * @url: /api/v1/Recharge/ExportManualRechargeApprovalList
 */
export const exportManualRechargeApprovalListExport = (params: ManualRechargeApprovalListPageReq) => {
  return requestClient.post<Blob>('/v1/Recharge/ExportManualRechargeApprovalList', params, { responseType: 'blob' });
}

/**
 * @description: 分页获取后台操作审核列表 (Auth)
 * @param {ManualRechargeApprovalListPageReq} params
 * @url: /api/v1/Recharge/GetManualRechargeApprovalPageList
 */
export const getManualRechargeApprovalPageList = (params: ManualRechargeApprovalListPageReq) => {
  return requestClient.post<ManualRechargeApprovalListRspListPageBaseResponse>('/v1/Recharge/GetManualRechargeApprovalPageList', params);
}
/**
 * @description: 分页获取后台操作审核列表 (Auth)（导出，返回原生 blob 响应）
 * @param {ManualRechargeApprovalListPageReq} params
 * @url: /api/v1/Recharge/GetManualRechargeApprovalPageList
 */
export const getManualRechargeApprovalPageListExport = (params: ManualRechargeApprovalListPageReq) => {
  return requestClient.post<Blob>('/v1/Recharge/GetManualRechargeApprovalPageList', params, { responseType: 'blob' });
}

/**
 * @description: 人工充值审核通过 (Auth)
 * @param {ManualRechargeApproveReq} params
 * @url: /api/v1/Recharge/ManualRechargeApprove
 */
export const manualRechargeApprove = (params: ManualRechargeApproveReq) => {
  return requestClient.post<any>('/v1/Recharge/ManualRechargeApprove', params);
}

/**
 * @description: 人工充值审核拒绝 (Auth)
 * @param {ManualRechargeRejectReq} params
 * @url: /api/v1/Recharge/ManualRechargeReject
 */
export const manualRechargeReject = (params: ManualRechargeRejectReq) => {
  return requestClient.post<any>('/v1/Recharge/ManualRechargeReject', params);
}

/**
 * @description: 获取人工充值用户信息（含下拉框数据） (Auth)
 * @param {GetRechargeUserInfoReq} params
 * @url: /api/v1/Recharge/GetRechargeUserInfo
 */
export const getRechargeUserInfo = (params: GetRechargeUserInfoReq) => {
  return requestClient.post<GetRechargeUserInfoRsp>('/v1/Recharge/GetRechargeUserInfo', params);
}

/**
 * @description: 提交人工充值/提款操作 (Auth)
 * @param {SubmitManualRechargeReq} params
 * @url: /api/v1/Recharge/SubmitManualRecharge
 */
export const submitManualRecharge = (params: SubmitManualRechargeReq) => {
  return requestClient.post<SubmitManualRechargeRsp>('/v1/Recharge/SubmitManualRecharge', params);
}

/**
 * @description: 解析批量充值Excel文件并做格式、权限、限额预校验（两阶段提交第一步） (Auth)
 * @param file 上传文件
 * @param {InitBatchRechargeFileFormDto} params
 * @url: /api/v1/Recharge/InitBatchRechargeFile
 */
export const initBatchRechargeFile = (file: File, params: Omit<InitBatchRechargeFileFormDto, 'File'>) => {
  return uploadFile<InitBatchRechargeFileRsp>({ url: '/v1/Recharge/InitBatchRechargeFile' }, { files: [file], ...params }, 'File');
}

/**
 * @description: 提交批量充值执行（两阶段提交第二步） (Auth)
 * @param {ImportBatchRechargeDataReq} params
 * @url: /api/v1/Recharge/ImportBatchRechargeData
 */
export const importBatchRechargeData = (params: ImportBatchRechargeDataReq) => {
  return requestClient.post<ImportBatchRechargeDataRsp>('/v1/Recharge/ImportBatchRechargeData', params);
}

/**
 * @description: 分页查询平台日志列表 (Auth)
 * @param {PlatformLogReq} params
 * @url: /api/v1/System/GetPlatformLogPageList
 */
export const getPlatformLogPageList = (params: PlatformLogReq) => {
  return requestClient.post<PlatformLogRspListPageBaseResponse>('/v1/System/GetPlatformLogPageList', params);
}
/**
 * @description: 分页查询平台日志列表 (Auth)（导出，返回原生 blob 响应）
 * @param {PlatformLogReq} params
 * @url: /api/v1/System/GetPlatformLogPageList
 */
export const getPlatformLogPageListExport = (params: PlatformLogReq) => {
  return requestClient.post<Blob>('/v1/System/GetPlatformLogPageList', params, { responseType: 'blob' });
}

/**
 * @description: 获取平台日志标题下拉列表 (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/v1/System/GetPlatformLogTitleList
 */
export const getPlatformLogTitleList = (params: MasterApiRequest) => {
  return requestClient.post<StringListApiResponse>('/v1/System/GetPlatformLogTitleList', params);
}
