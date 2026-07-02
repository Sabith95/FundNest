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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSuperAdminUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../shared/tokens");
const AppError_1 = require("../../../shared/errors/AppError");
const constants_1 = require("../../../shared/constants");
let LoginSuperAdminUseCase = class LoginSuperAdminUseCase {
    constructor(userRepository, bcryptService, jwtService) {
        this.userRepository = userRepository;
        this.bcryptService = bcryptService;
        this.jwtService = jwtService;
    }
    async execute(input) {
        const user = await this.userRepository.findByEmailAndRole(input.email, constants_1.ROLES.SUPER_ADMIN);
        if (!user) {
            throw new AppError_1.AppError('Invalid email or password', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        if (!user.isActive) {
            throw new AppError_1.AppError('Account is inactive', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        if (!user.password) {
            throw new AppError_1.AppError('Invalid email or password', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        const isPasswordValid = await this.bcryptService.comparePassword(input.password, user.password);
        if (!isPasswordValid) {
            throw new AppError_1.AppError('Invalid email or password', constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        const tokens = this.jwtService.generateTokenPair({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            tokens
        };
    }
};
exports.LoginSuperAdminUseCase = LoginSuperAdminUseCase;
exports.LoginSuperAdminUseCase = LoginSuperAdminUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.UserRepository)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.TOKENS.BcryptService)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.TOKENS.JwtService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], LoginSuperAdminUseCase);
