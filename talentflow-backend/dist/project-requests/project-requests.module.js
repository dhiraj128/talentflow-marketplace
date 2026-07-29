"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const project_requests_service_1 = require("./project-requests.service");
const project_requests_controller_1 = require("./project-requests.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ProjectRequestsModule = class ProjectRequestsModule {
};
exports.ProjectRequestsModule = ProjectRequestsModule;
exports.ProjectRequestsModule = ProjectRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [project_requests_service_1.ProjectRequestsService],
        controllers: [project_requests_controller_1.ProjectRequestsController],
    })
], ProjectRequestsModule);
//# sourceMappingURL=project-requests.module.js.map