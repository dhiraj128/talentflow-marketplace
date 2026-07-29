"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResendEmailProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendEmailProvider = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let ResendEmailProvider = ResendEmailProvider_1 = class ResendEmailProvider {
    resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_key_12345');
    logger = new common_1.Logger(ResendEmailProvider_1.name);
    async sendOtp(email, otp) {
        try {
            const result = await this.resend.emails.send({
                from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: 'TalentFlow Marketplace Verification Code',
                html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Verify your email</h2>

            <p>Your verification code is:</p>

            <h1 style="letter-spacing:8px">
              ${otp}
            </h1>

            <p>
            This OTP expires in 5 minutes.
            </p>

            <hr>

            <small>
            TalentFlow Marketplace
            </small>
          </div>
        `
            });
            if (result.error) {
                this.logger.error(`Failed to send email via Resend: ${result.error.message}`);
                throw new common_1.InternalServerErrorException('Failed to send verification email');
            }
            this.logger.log(`Email successfully sent via Resend to ${email}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to send email via Resend: ${error.message}`);
            throw new common_1.InternalServerErrorException('Failed to send verification email');
        }
    }
};
exports.ResendEmailProvider = ResendEmailProvider;
exports.ResendEmailProvider = ResendEmailProvider = ResendEmailProvider_1 = __decorate([
    (0, common_1.Injectable)()
], ResendEmailProvider);
//# sourceMappingURL=resend-email.provider.js.map