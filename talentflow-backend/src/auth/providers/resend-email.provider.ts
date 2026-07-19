import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class ResendEmailProvider {
  private resend = new Resend(process.env.RESEND_API_KEY);
  private readonly logger = new Logger(ResendEmailProvider.name);

  async sendOtp(email: string, otp: string) {
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
        throw new InternalServerErrorException('Failed to send verification email');
      }

      this.logger.log(`Email successfully sent via Resend to ${email}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Failed to send email via Resend: ${error.message}`);
      throw new InternalServerErrorException('Failed to send verification email');
    }
  }
}
