// apps/backend-mock/utils/ar-mock-utils.ts

export interface PaginatedResult {
  list: any[];
  pageNo: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
}

export function paginate(
  list: any[],
  pageNo: number,
  pageSize: number,
): PaginatedResult {
  const page = Math.max(1, pageNo);
  const size = Math.max(1, pageSize);
  const start = (page - 1) * size;
  return {
    list: list.slice(start, start + size),
    pageNo: page,
    pageSize: size,
    totalCount: list.length,
    totalPage: Math.ceil(list.length / size) || 1,
  };
}

export function filterByFields(
  list: any[],
  keyword: string | undefined,
  fields: string[],
): any[] {
  if (!keyword || !keyword.trim()) return list;
  const kw = keyword.trim().toLowerCase();
  return list.filter((item) =>
    fields.some((f) =>
      String(item[f] ?? '')
        .toLowerCase()
        .includes(kw),
    ),
  );
}

export function findById(list: any[], id: any, idField: string): any | null {
  if (id === null || id === undefined) return list[0] ?? null;
  return (
    list.find((item) => String(item[idField]) === String(id)) ?? list[0] ?? null
  );
}

export function wrapOk(data: any): { code: 0; data: any; msg: string } {
  return { code: 0, data, msg: '' };
}
