import { ExecutionContext } from '@nestjs/common';
declare const GithubOAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class GithubOAuthGuard extends GithubOAuthGuard_base {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any): any;
}
export {};
