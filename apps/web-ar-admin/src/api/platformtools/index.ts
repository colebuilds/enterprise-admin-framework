import { requestClient } from '#/api/request';
import {
  VendorInfoRspListApiResponse,
  VendorGameListQuery,
  VendorGameListRspListApiResponse
} from './types';

// 导出类型
export * from './types';

// ==================== PlatformTools ====================

/**
 * @description: 获取全部游戏厂商
 * @url: /api/PlatformTools/GetAllVendorInfo
 */
export const getAllVendorInfo = () => {
  return requestClient.post<VendorInfoRspListApiResponse>('/PlatformTools/GetAllVendorInfo');
}

/**
 * @description: 根据厂商获取该厂商的所有子游戏
 * @param {VendorGameListQuery} params
 * @url: /api/PlatformTools/GetVendorGameList
 */
export const getVendorGameList = (params: VendorGameListQuery) => {
  return requestClient.post<VendorGameListRspListApiResponse>('/PlatformTools/GetVendorGameList', params);
}
