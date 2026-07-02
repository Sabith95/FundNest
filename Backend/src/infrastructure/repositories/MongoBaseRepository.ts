import { Model } from "mongoose";
import { IBaseRepository } from "../../domain/repositories/IBaseRepository";

export abstract class MongoBaseRepository<TEntity>  implements IBaseRepository<TEntity> {
    constructor(protected readonly model: Model<any>){}

    async findById(id: string): Promise<TEntity | null> {
        const doc = await this.model.findById(id).lean()
        if(!doc) return null

        return this.toEntity(doc)
    }

    async find(filter?: Partial<TEntity>): Promise<TEntity[]> {
        const docs = await this.model.find((filter as any) ?? {}).lean()
        return docs.map((doc: any) => this.toEntity(doc))
    }

    async save(entity: Partial<TEntity>): Promise<TEntity> {
        const doc = new this.model(entity)
        const saved = await doc.save()

        return this.toEntity(saved.toObject())
    }

    async insertMany(entities: Partial<TEntity>[]): Promise<TEntity[]> {
        const docs = await this.model.insertMany(entities)

        return docs.map((doc: any) => this.toEntity(doc.toObject()))
    }

    async update(id: string, data: Partial<TEntity>): Promise<TEntity | null> {
        const doc = await this.model.findByIdAndUpdate(id,data, {new: true}).lean()

        if(!doc)return null

        return this.toEntity(doc)
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id)

        return result !== null
    }


    protected abstract toEntity(doc: any): TEntity;
}