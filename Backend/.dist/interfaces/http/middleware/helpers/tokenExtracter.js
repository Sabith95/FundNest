"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExtracter = void 0;
class TokenExtracter {
    static fromHeader(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        const token = authHeader.split(' ')[1];
        return token || null;
    }
}
exports.TokenExtracter = TokenExtracter;
