import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export interface TransactionalEmailOptions {
  to: string;
  subject: string;
  recipientName?: string;
  title: string;
  bodyParagraphs: string[];
  details?: Array<{ label: string; value: string }>;
  ctaText?: string;
  ctaUrl?: string;
}

@Injectable()
export class ResendEmailProvider {
  private resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_fallback_key_12345');
  private readonly logger = new Logger(ResendEmailProvider.name);

  async sendOtp(email: string, otp: string) {
    try {
      this.logger.log(`[EMAIL] Resend email provider invoked for ${email}`);
      const sender = process.env.FROM_EMAIL || 'TalentFlow <noreply@sispl.shop>';
      const result = await this.resend.emails.send({
        from: sender,
        to: email,
        subject: 'TalentFlow Marketplace Verification Code',
        html: `
          <div style="font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; padding: 32px; color: #1e293b;">
            <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 32px; text-align: left;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">TalentFlow Marketplace</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="font-size: 18px; font-weight: 600; margin-top: 0; margin-bottom: 16px; color: #0f172a;">Verify Your Email Address</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px;">Your 6-digit verification code is:</p>
                <div style="background: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                  <span style="font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #2563eb; font-family: monospace;">${otp}</span>
                </div>
                <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">This OTP expires in 5 minutes. If you did not request this, please ignore this email.</p>
              </div>
              <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 32px; text-align: center;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">TalentFlow Marketplace &bull; <a href="https://sispl.shop" style="color: #2563eb; text-decoration: none;">https://sispl.shop</a></p>
              </div>
            </div>
          </div>
        `
      });

      if (result.error) {
        this.logger.error(`[EMAIL] Failed to send email via Resend: ${result.error.message}`);
        throw new InternalServerErrorException('Failed to send verification email');
      }

      this.logger.log(`[EMAIL] Resend accepted email message ID: ${result.data?.id}`);
      return result;
    } catch (error: any) {
      this.logger.error(`[EMAIL] Failed to send email via Resend: ${error.message}`);
      throw new InternalServerErrorException('Failed to send verification email');
    }
  }

  async sendTransactionalEmail(options: TransactionalEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      this.logger.log(`[EMAIL] Dispatching transactional email: "${options.subject}" to ${options.to}`);
      const sender = process.env.FROM_EMAIL || 'TalentFlow <noreply@sispl.shop>';
      const html = this.buildHtmlTemplate(options);
      const text = this.buildPlainText(options);

      const result = await this.resend.emails.send({
        from: sender,
        to: options.to,
        subject: options.subject,
        html,
        text,
      });

      if (result.error) {
        this.logger.error(`[EMAIL] Resend returned error for ${options.to}: ${result.error.message}`);
        return { success: false, error: result.error.message };
      }

      this.logger.log(`[EMAIL] Resend accepted email message ID: ${result.data?.id}`);
      return { success: true, messageId: result.data?.id };
    } catch (error: any) {
      this.logger.error(`[EMAIL] Failed to dispatch transactional email to ${options.to}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  private buildHtmlTemplate(options: TransactionalEmailOptions): string {
    const greeting = options.recipientName ? `Hello ${options.recipientName},` : 'Hello,';
    
    let detailsHtml = '';
    if (options.details && options.details.length > 0) {
      const rows = options.details.map(d => `
        <tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #475569; width: 35%;">${d.label}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a;">${d.value}</td>
        </tr>
      `).join('');

      detailsHtml = `
        <div style="margin: 24px 0; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #f8fafc;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
    }

    let ctaHtml = '';
    if (options.ctaText && options.ctaUrl) {
      ctaHtml = `
        <div style="margin-top: 28px; margin-bottom: 12px; text-align: left;">
          <a href="${options.ctaUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);">${options.ctaText}</a>
        </div>
      `;
    }

    const paragraphsHtml = options.bodyParagraphs.map(p => `<p style="font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 16px;">${p}</p>`).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${options.subject}</title>
      </head>
      <body style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f1f5f9; margin: 0; padding: 32px 16px; color: #1e293b;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 32px; text-align: left;">
            <div style="display: inline-block; font-size: 18px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
              TalentFlow <span style="color: #60a5fa; font-weight: 400;">Marketplace</span>
            </div>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px; color: #0f172a; letter-spacing: -0.3px;">${options.title}</h2>
            <p style="font-size: 14px; font-weight: 500; color: #475569; margin-bottom: 16px;">${greeting}</p>
            ${paragraphsHtml}
            ${detailsHtml}
            ${ctaHtml}
          </div>
          
          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
            <p style="font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 6px;">This is an automated transactional security & activity notification from TalentFlow.</p>
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">TalentFlow Marketplace &bull; <a href="https://sispl.shop" style="color: #2563eb; text-decoration: none;">https://sispl.shop</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private buildPlainText(options: TransactionalEmailOptions): string {
    const greeting = options.recipientName ? `Hello ${options.recipientName},` : 'Hello,';
    const paragraphs = options.bodyParagraphs.join('\n\n');
    let details = '';
    if (options.details && options.details.length > 0) {
      details = '\n\nDetails:\n' + options.details.map(d => `- ${d.label}: ${d.value}`).join('\n');
    }
    let cta = '';
    if (options.ctaText && options.ctaUrl) {
      cta = `\n\n${options.ctaText}: ${options.ctaUrl}`;
    }

    return `${options.title}\n\n${greeting}\n\n${paragraphs}${details}${cta}\n\n--\nTalentFlow Marketplace\nhttps://sispl.shop`;
  }
}
