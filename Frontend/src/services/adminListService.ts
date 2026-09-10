// services/adminListService.ts
export interface PagedResponse<T> {
  data: T[];
  total: number;
}

export interface AdminListService<T> {
  getList: (
    page: number,
    pageSize: number,
    search: string,
  ) => Promise<PagedResponse<T>>;
  updateStatus: (id: string, isActive: boolean) => Promise<T>;
}
