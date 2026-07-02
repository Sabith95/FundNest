"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBaseRepository = void 0;
class MongoBaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        const doc = await this.model.findById(id).lean();
        if (!doc)
            return null;
        return this.toEntity(doc);
    }
    async find(filter) {
        const docs = await this.model.find(filter ?? {}).lean();
        return docs.map((doc) => this.toEntity(doc));
    }
    async save(entity) {
        const doc = new this.model(entity);
        const saved = await doc.save();
        return this.toEntity(saved.toObject());
    }
    async insertMany(entities) {
        const docs = await this.model.insertMany(entities);
        return docs.map((doc) => this.toEntity(doc.toObject()));
    }
    async update(id, data) {
        const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!doc)
            return null;
        return this.toEntity(doc);
    }
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }
}
exports.MongoBaseRepository = MongoBaseRepository;
