"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const UserModel_1 = require("../database/models/UserModel");
const MongoBaseRepository_1 = require("./MongoBaseRepository");
let UserRepository = class UserRepository extends MongoBaseRepository_1.MongoBaseRepository {
    constructor() {
        super(UserModel_1.UserModel);
    }
    async create(data) {
        return this.save({
            ...data,
            email: data.email.toLowerCase().trim(),
        });
    }
    async findByEmail(email) {
        const doc = await UserModel_1.UserModel.findOne({
            email: email.toLowerCase().trim()
        }).lean();
        return doc ? this.toEntity(doc) : null;
    }
    async findByEmailAndRole(email, role) {
        const doc = await UserModel_1.UserModel.findOne({
            email: email.toLowerCase().trim(),
            role,
        }).lean();
        return doc ? this.toEntity(doc) : null;
    }
    async findByGoogleId(googleId) {
        const doc = await UserModel_1.UserModel.findOne({ googleId }).lean();
        return doc ? this.toEntity(doc) : null;
    }
    async markEmailAsVerified(userId) {
        await UserModel_1.UserModel.updateOne({ _id: userId }, { $set: { isEmailVerified: true } });
    }
    async updatePassword(userId, hashedPassword) {
        await UserModel_1.UserModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
    }
    toEntity(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            authProvider: user.authProvider,
            googleId: user.googleId,
            isEmailVerified: user.isEmailVerified,
            profile: {
                address: {
                    line1: user.profile?.address?.line1,
                    line2: user.profile?.address?.line2,
                    city: user.profile?.address?.city,
                    state: user.profile?.address?.state,
                    pincode: user.profile?.address?.pincode,
                    country: user.profile?.address?.country,
                },
                kycStatus: user.profile?.kycStatus || "PENDING",
            },
            role: user.role,
            isActive: user.isActive,
            tenantId: user.tenantId?.toString(),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
