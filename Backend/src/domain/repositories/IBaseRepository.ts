export interface IBaseRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  find(filter?: Partial<TEntity>): Promise<TEntity[]>;
  save(entity: Partial<TEntity>): Promise<TEntity>;
  insertMany(entities: Partial<TEntity>[]): Promise<TEntity[]>;
  update(id: string, data: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: string): Promise<boolean>;
}