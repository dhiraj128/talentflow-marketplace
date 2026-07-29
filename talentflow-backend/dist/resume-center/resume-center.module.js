"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeCenterModule = void 0;
const common_1 = require("@nestjs/common");
const resume_center_service_1 = require("./resume-center.service");
const resume_center_controller_1 = require("./resume-center.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ResumeCenterModule = class ResumeCenterModule {
};
exports.ResumeCenterModule = ResumeCenterModule;
exports.ResumeCenterModule = ResumeCenterModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [resume_center_controller_1.ResumeCenterController],
        providers: [resume_center_service_1.ResumeCenterService],
        exports: [resume_center_service_1.ResumeCenterService],
    })
], ResumeCenterModule);
//# sourceMappingURL=resume-center.module.js.map