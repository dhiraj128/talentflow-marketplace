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
var GoogleStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth.service");
let GoogleStrategy = GoogleStrategy_1 = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    authService;
    logger = new common_1.Logger(GoogleStrategy_1.name);
    constructor(authService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MISSING_GOOGLE_CLIENT_SECRET',
            callbackURL: process.env.GOOGLE_CALLBACK_URL ||
                'https://api.sispl.shop/api/v1/auth/google/callback',
            scope: ['email', 'profile'],
        });
        this.authService = authService;
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            this.logger.warn('Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are missing from environment variables. Google login will fail with invalid_client.');
        }
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails, photos, id } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            provider: 'google',
            providerId: id,
        };
        const result = await this.authService.validateOAuthUser(user);
        done(null, result);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = GoogleStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map