"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const BcryptService_1 = require("../infrastructure/auth/BcryptService");
const JwtService_1 = require("../infrastructure/auth/JwtService");
const UserRepository_1 = require("../infrastructure/repositories/UserRepository");
tsyringe_1.container.register('IJwtService', {
    useClass: JwtService_1.JwtService,
});
tsyringe_1.container.register('IBcryptService', {
    useClass: BcryptService_1.BcryptService,
});
tsyringe_1.container.register('IUserRepository', {
    useClass: UserRepository_1.UserRepository,
});
