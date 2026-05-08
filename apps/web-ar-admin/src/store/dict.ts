import { api } from '#/api';
import { queryClient } from '#/lib/query-client';

/**
 * 字典 QueryKey 常量 — 统一管理，避免拼写错误。
 * useDictionary.ts 和 auth.ts 共享这里的 key，保证 cache 命中。
 */
export const DICT_QUERY_KEY = {
  common: ['dict', 'common'] as const,
  v1: ['dict', 'v1'] as const,
  group: ['dict', 'group'] as const,
  platform: ['dict', 'platform'] as const,
  dynamic: ['dict', 'dynamic'] as const,
  all: ['dict'] as const,
} as const;

/**
 * 静态字典查询函数 — 与 useDictionary.ts 里的 useQuery 共用，
 * 保证 prefetchQuery 和 useQuery 的 queryFn 完全一致，cache 才能命中。
 */
export const STATIC_DICT_QUERY_FN = {
  common: () => api.common.getDictionary(),
  v1: () => api.v1platform.getDictionary(),
  group: () => api.system.getGroupData(),
  platform: () => api.common.getPlatformDic(),
} as const;

/**
 * 登录后预热静态字典（non-blocking）。
 * 调用后数据进入 TanStack Query cache，组件内 useQuery 直接命中，不二次请求。
 */
export function prefetchStaticDicts(): void {
  Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: DICT_QUERY_KEY.common,
      queryFn: STATIC_DICT_QUERY_FN.common,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery({
      queryKey: DICT_QUERY_KEY.v1,
      queryFn: STATIC_DICT_QUERY_FN.v1,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery({
      queryKey: DICT_QUERY_KEY.group,
      queryFn: STATIC_DICT_QUERY_FN.group,
      staleTime: Infinity,
    }),
    queryClient.prefetchQuery({
      queryKey: DICT_QUERY_KEY.platform,
      queryFn: STATIC_DICT_QUERY_FN.platform,
      staleTime: Infinity,
    }),
  ]);
}

/**
 * 登出时清理所有字典 cache。
 * 语言切换不用调此函数，用 invalidateDicts() 更合适（保留结构，强制重拉）。
 */
export function clearDictCache(): void {
  queryClient.removeQueries({ queryKey: DICT_QUERY_KEY.all });
}

/**
 * 语言切换后让所有字典 cache 失效 → 下次 useQuery 自动重拉最新语言的数据。
 */
export function invalidateDicts(): void {
  queryClient.invalidateQueries({ queryKey: DICT_QUERY_KEY.all });
}
