export interface PaginatedResult<TEntity> {
  data: TEntity[];
  total: number;
  page: number;
  limit: number;
}
