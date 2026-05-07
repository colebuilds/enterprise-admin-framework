/* oxlint-disable */
import type { Ref, ShallowRef } from 'vue';

import type { CreateProSearchFormReturn, Recordable } from '../../types';
import type { CrudRequestParams, CrudRequestResult } from '../types';

import { ref, shallowRef } from 'vue';

export interface UseCrudRequestOptions<T extends Recordable = Recordable> {
  request: (params: CrudRequestParams) => Promise<CrudRequestResult<T>>;
  beforeRequest?: (
    params: CrudRequestParams,
  ) => CrudRequestParams | Promise<CrudRequestParams>;
  afterRequest?: (data: T[]) => Promise<T[]> | T[];
  defaultPageSize: number;
  searchForm: CreateProSearchFormReturn;
  advancedSearchForm: CreateProSearchFormReturn;
  hasAdvancedColumns: () => boolean;
  onLoad?: (data: T[]) => void;
}

export interface UseCrudRequestReturn<T extends Recordable = Recordable> {
  loading: Ref<boolean>;
  tableData: ShallowRef<T[]>;
  paginationState: Ref<{ itemCount: number; page: number; pageSize: number }>;
  loadData: (extraParams?: Recordable) => Promise<void>;
  handleSearch: (values: Recordable) => void;
  handleReset: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleSorterChange: (
    sorter: null | { columnKey: string; order: 'ascend' | 'descend' | false },
  ) => void;
  getSearchParams: () => Recordable;
}

export function useCrudRequest<T extends Recordable = Recordable>(
  options: UseCrudRequestOptions<T>,
): UseCrudRequestReturn<T> {
  const loading = ref(false);
  const tableData = shallowRef<T[]>([]);
  const paginationState = ref({
    page: 1,
    pageSize: options.defaultPageSize,
    itemCount: 0,
  });
  const sortState = ref<{ field?: string; order?: 'ascend' | 'descend' }>({});

  function getSearchParams(): Recordable {
    return {
      ...options.searchForm.getSearchParams(),
      ...(options.hasAdvancedColumns()
        ? options.advancedSearchForm.getSearchParams()
        : {}),
    };
  }

  async function loadData(extraParams?: Recordable) {
    // 请求互斥：上一次请求未结束前忽略新的触发，规避用户连点搜索 / 分页 / 排序导致的并发请求与后发先至。
    if (loading.value) return;
    loading.value = true;
    try {
      let params: CrudRequestParams = {
        pageNo: paginationState.value.page,
        pageSize: paginationState.value.pageSize,
        ...getSearchParams(),
        ...extraParams,
      };

      if (sortState.value.field) {
        params.sortField = sortState.value.field;
        params.sortOrder = sortState.value.order;
      }

      if (options.beforeRequest) {
        params = await options.beforeRequest(params);
      }

      const result = await options.request(params);
      let data = result.list || [];

      if (options.afterRequest) {
        data = await options.afterRequest(data);
      }

      tableData.value = data;
      paginationState.value.itemCount = result.total ?? result.totalCount ?? 0;

      // 响应后对齐显示的分页：按最新 total / pageSize 算最大有效页，当前 page 超了就拉回来。
      // 不再发第二次请求，这一轮表格可能显示空，但分页指示器与真实总数已经一致。
      const total = paginationState.value.itemCount;
      const pageSize = paginationState.value.pageSize;
      const maxPage = total > 0 ? Math.ceil(total / pageSize) : 1;
      if (paginationState.value.page > maxPage) {
        paginationState.value.page = maxPage;
      }

      options.onLoad?.(data);
    } catch (error) {
      console.error('ProCrudTable load error:', error);
    } finally {
      loading.value = false;
    }
  }

  function handleSearch(_values: Recordable) {
    paginationState.value.page = 1;
    loadData();
  }

  function handleReset() {
    paginationState.value.page = 1;
    options.searchForm.reset();
    if (options.hasAdvancedColumns()) {
      options.advancedSearchForm.reset();
    }
    loadData();
  }

  function handlePageChange(page: number) {
    paginationState.value.page = page;
    loadData();
  }

  function handlePageSizeChange(pageSize: number) {
    paginationState.value.pageSize = pageSize;
    paginationState.value.page = 1;
    loadData();
  }

  function handleSorterChange(
    sorter: null | { columnKey: string; order: 'ascend' | 'descend' | false },
  ) {
    sortState.value = sorter?.order
      ? { field: sorter.columnKey, order: sorter.order }
      : {};
    loadData();
  }

  return {
    loading,
    tableData,
    paginationState,
    loadData,
    handleSearch,
    handleReset,
    handlePageChange,
    handlePageSizeChange,
    handleSorterChange,
    getSearchParams,
  };
}
