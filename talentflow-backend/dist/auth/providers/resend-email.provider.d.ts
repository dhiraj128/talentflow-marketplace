export interface TransactionalEmailOptions {
    to: string;
    subject: string;
    recipientName?: string;
    title: string;
    bodyParagraphs: string[];
    details?: Array<{
        label: string;
        value: string;
    }>;
    ctaText?: string;
    ctaUrl?: string;
}
export declare class ResendEmailProvider {
    private resend;
    private readonly logger;
    sendOtp(email: string, otp: string): Promise<{
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }>;
    sendTransactionalEmail(options: TransactionalEmailOptions): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    private buildHtmlTemplate;
    private buildPlainText;
}
