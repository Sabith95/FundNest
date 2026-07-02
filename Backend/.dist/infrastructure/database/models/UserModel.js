"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../../../shared/constants");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'LOCAL';
        },
    },
    role: {
        type: String,
        enum: Object.values(constants_1.ROLES),
        required: true,
        index: true,
    },
    authProvider: {
        type: String,
        enum: ['LOCAL', "GOOGLE"],
        default: "LOCAL",
        required: true
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true,
        index: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tenant",
        required: false,
        index: true,
    },
    profile: {
        address: {
            line1: { type: String, trim: true },
            line2: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            pincode: { type: String, trim: true },
            country: { type: String, trim: true, default: "India" },
        },
        kycStatus: {
            type: String,
            enum: ["PENDING", "VERIFIED", "REJECTED"],
            default: "PENDING",
        },
    },
}, {
    timestamps: true,
    collection: "users",
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
