"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const tsyringe_1 = require("tsyringe");
const env_1 = require("../../config/env");
const AppError_1 = require("../../shared/errors/AppError");
const constants_1 = require("../../shared/constants");
let GoogleAuthService = class GoogleAuthService {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client(env_1.env.GOOGLE_CLIENT_ID);
    }
    async verifyIdToken(idToken) {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: env_1.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload?.sub || !payload.email || !payload.name) {
            throw new AppError_1.AppError("Invalid google token", constants_1.HTTP_STATUS.UNAUTHORIZED);
        }
        return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
    }
};
exports.GoogleAuthService = GoogleAuthService;
exports.GoogleAuthService = GoogleAuthService = __decorate([
    (0, tsyringe_1.injectable)()
], GoogleAuthService);
