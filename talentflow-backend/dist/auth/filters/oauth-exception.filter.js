"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthExceptionFilter = exports.OAuthException = void 0;
const common_1 = require("@nestjs/common");
class OAuthException extends common_1.HttpException {
    errorType;
    constructor(errorType) {
        super(errorType, common_1.HttpStatus.UNAUTHORIZED);
        this.errorType = errorType;
    }
}
exports.OAuthException = OAuthException;
let OAuthExceptionFilter = class OAuthExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        const errorMsg = exception.errorType || 'GoogleAuthFailed';
        if (!response.headersSent) {
            response.redirect(`${frontendUrl}/sign-in?error=${encodeURIComponent(errorMsg)}`);
        }
    }
};
exports.OAuthExceptionFilter = OAuthExceptionFilter;
exports.OAuthExceptionFilter = OAuthExceptionFilter = __decorate([
    (0, common_1.Catch)(OAuthException)
], OAuthExceptionFilter);
//# sourceMappingURL=oauth-exception.filter.js.map