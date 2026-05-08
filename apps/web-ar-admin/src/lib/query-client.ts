import { QueryClient } from '@tanstack/vue-query';

/**
 * 单例 QueryClient — 在组件上下文外（auth store、语言切换）调用 prefetchQuery / invalidateQueries 时使用。
 * bootstrap.ts 通过 app.use(VueQueryPlugin, { queryClient }) 将其注入组件树，
 * 保证 auth store 和组件内 useQuery 共享同一个 cache。
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
