"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const oauth_exception_filter_1 = require("../filters/oauth-exception.filter");
let GoogleOAuthGuard = class GoogleOAuthGuard extends (0, passport_1.AuthGuard)('google') {
    handleRequest(err, user, info, context, status) {
        if (err || !user) {
            let errorMsg = 'GoogleAuthFailed';
            if (err?.message?.includes('invalid_client'))
                errorMsg = 'OAuthConfigurationMissing';
            else if (err)
                errorMsg = err.message || 'GoogleAuthFailed';
            else if (info && info.message === 'Missing email')
                errorMsg = 'MissingEmail';
            throw new oauth_exception_filter_1.OAuthException(errorMsg);
        }
        return user;
    }
};
exports.GoogleOAuthGuard = GoogleOAuthGuard;
exports.GoogleOAuthGuard = GoogleOAuthGuard = __decorate([
    (0, common_1.Injectable)()
], GoogleOAuthGuard);
//# sourceMappingURL=google-oauth.guard.js.map