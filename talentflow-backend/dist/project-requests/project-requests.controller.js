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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRequestsController = void 0;
const create_review_dto_1 = require("./dto/create-review.dto");
const create_request_dto_1 = require("./dto/create-request.dto");
const common_1 = require("@nestjs/common");
const project_requests_service_1 = require("./project-requests.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ProjectRequestsController = class ProjectRequestsController {
    projectRequestsService;
    constructor(projectRequestsService) {
        this.projectRequestsService = projectRequestsService;
    }
    createRequest(req, createData) {
        return this.projectRequestsService.createRequest(req.user.id, createData);
    }
    getFreelancerRequests(req) {
        return this.projectRequestsService.getFreelancerRequests(req.user.id);
    }
    getEmployerRequests(req) {
        return this.projectRequestsService.getEmployerRequests(req.user.id);
    }
    updateStatus(req, id, status) {
        return this.projectRequestsService.updateStatus(req.user.id, req.user.role, id, status);
    }
    createReview(req, id, reviewData) {
        return this.projectRequestsService.createReview(req.user.id, id, reviewData);
    }
};
exports.ProjectRequestsController = ProjectRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYER, client_1.Role.FREELANCER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_request_dto_1.CreateProjectRequestDto]),
    __metadata("design:returntype", void 0)
], ProjectRequestsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('freelancer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYER, client_1.Role.FREELANCER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectRequestsController.prototype, "getFreelancerRequests", null);
__decorate([
    (0, common_1.Get)('employer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYER, client_1.Role.FREELANCER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectRequestsController.prototype, "getEmployerRequests", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYER, client_1.Role.FREELANCER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProjectRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/review'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYER, client_1.Role.FREELANCER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], ProjectRequestsController.prototype, "createReview", null);
exports.ProjectRequestsController = ProjectRequestsController = __decorate([
    (0, common_1.Controller)('project-requests'),
    __metadata("design:paramtypes", [project_requests_service_1.ProjectRequestsService])
], ProjectRequestsController);
//# sourceMappingURL=project-requests.controller.js.map