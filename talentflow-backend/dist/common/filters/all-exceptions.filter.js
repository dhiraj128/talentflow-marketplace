"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal Server Error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const responsePayload = exception.getResponse();
            message = responsePayload.message || exception.message;
            error = responsePayload.error || exception.name;
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            this.logger.error(`Prisma Error: ${exception.code} - ${exception.message}`);
            switch (exception.code) {
                case 'P2002':
                    statusCode = common_1.HttpStatus.CONFLICT;
                    message =
                        'A record with this value already exists (Unique constraint failed).';
                    error = 'Conflict';
                    break;
                case 'P2003':
                    statusCode = common_1.HttpStatus.BAD_REQUEST;
                    message =
                        'A related record does not exist (Foreign key constraint failed).';
                    error = 'Bad Request';
                    break;
                case 'P2025':
                    statusCode = common_1.HttpStatus.NOT_FOUND;
                    message = 'Record not found.';
                    error = 'Not Found';
                    break;
                default:
                    statusCode = common_1.HttpStatus.BAD_REQUEST;
                    message = 'Database request error.';
                    error = 'Bad Request';
                    break;
            }
        }
        else {
            this.logger.error(exception);
        }
        const errorResponse = {
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        if (exception instanceof common_1.HttpException) {
            const responsePayload = exception.getResponse();
            if (typeof responsePayload === 'object') {
                Object.assign(errorResponse, responsePayload);
            }
        }
        response.status(statusCode).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map