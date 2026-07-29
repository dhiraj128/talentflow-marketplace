export declare class ResendEmailProvider {
    private resend;
    private readonly logger;
    sendOtp(email: string, otp: string): Promise<{
        data: import("resend").CreateEmailResponseSuccess;
        error: null;
    } & {
        headers: Record<string, string> | null;
    }>;
}
