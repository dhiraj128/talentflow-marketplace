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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditLogsService = class AuditLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createAuditLogDto) {
        return this.prisma.auditLog.create({
            data: {
                ...createAuditLogDto,
                details: createAuditLogDto.details || {},
            },
        });
    }
    findAll(skip, take) {
        return this.prisma.auditLog.findMany({ skip, take });
    }
    findOne(id) {
        return this.prisma.auditLog.findUnique({ where: { id } });
    }
    update(id, updateAuditLogDto) {
        return this.prisma.auditLog.update({
            where: { id },
            data: {
                ...updateAuditLogDto,
                details: updateAuditLogDto.details
                    ? updateAuditLogDto.details
                    : undefined,
            },
        });
    }
    remove(id) {
        return this.prisma.auditLog.delete({ where: { id } });
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map