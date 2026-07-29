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
exports.EmployersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmployersService = class EmployersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createEmployerDto) {
        return this.prisma.employerProfile.create({ data: createEmployerDto });
    }
    findAll(skip = 0, take = 10) {
        return this.prisma.employerProfile.findMany({ skip, take });
    }
    async findOne(id, user) {
        const employer = await this.prisma.employerProfile.findUnique({
            where: { id },
        });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        if (user && user.role !== 'ADMIN' && employer.userId !== (user.sub || user.userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        return employer;
    }
    async update(id, updateEmployerDto, user) {
        const employer = await this.prisma.employerProfile.findUnique({ where: { id } });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        if (user && user.role !== 'ADMIN' && employer.userId !== (user.sub || user.userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        return this.prisma.employerProfile.update({
            where: { id },
            data: updateEmployerDto,
        });
    }
    async remove(id, user) {
        const employer = await this.prisma.employerProfile.findUnique({ where: { id } });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        if (user && user.role !== 'ADMIN' && employer.userId !== (user.sub || user.userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        await this.prisma.employerProfile.delete({ where: { id } });
        return { success: true };
    }
};
exports.EmployersService = EmployersService;
exports.EmployersService = EmployersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployersService);
//# sourceMappingURL=employers.service.js.map