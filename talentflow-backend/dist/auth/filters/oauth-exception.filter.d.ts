import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class OAuthException extends HttpException {
    readonly errorType: string;
    constructor(errorType: string);
}
export declare class OAuthExceptionFilter implements ExceptionFilter {
    catch(exception: OAuthException, host: ArgumentsHost): void;
}
