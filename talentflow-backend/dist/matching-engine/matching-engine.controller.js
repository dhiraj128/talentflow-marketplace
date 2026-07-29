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
exports.MatchingEngineController = void 0;
const common_1 = require("@nestjs/common");
const matching_engine_service_1 = require("./matching-engine.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let MatchingEngineController = class MatchingEngineController {
    matchingEngineService;
    constructor(matchingEngineService) {
        this.matchingEngineService = matchingEngineService;
    }
    calculateMatch(candidateId, jobId) {
        return this.matchingEngineService.calculateMatch(candidateId, jobId);
    }
    getRecommendedJobs(candidateId) {
        return this.matchingEngineService.getRecommendedJobs(candidateId);
    }
    getRecommendedCandidates(jobId) {
        return this.matchingEngineService.getRecommendedCandidates(jobId);
    }
};
exports.MatchingEngineController = MatchingEngineController;
__decorate([
    (0, common_1.Get)(':candidateId/:jobId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('candidateId')),
    __param(1, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MatchingEngineController.prototype, "calculateMatch", null);
__decorate([
    (0, common_1.Get)('jobs/:candidateId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('candidateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MatchingEngineController.prototype, "getRecommendedJobs", null);
__decorate([
    (0, common_1.Get)('candidates/:jobId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('jobId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MatchingEngineController.prototype, "getRecommendedCandidates", null);
exports.MatchingEngineController = MatchingEngineController = __decorate([
    (0, swagger_1.ApiTags)('matching-engine'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('matching-engine'),
    __metadata("design:paramtypes", [matching_engine_service_1.MatchingEngineService])
], MatchingEngineController);
//# sourceMappingURL=matching-engine.controller.js.map