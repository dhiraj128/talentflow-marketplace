"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("./storage.service");
const storage_controller_1 = require("./storage.controller");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: storage_service_1.AbstractStorageService,
                useFactory: () => {
                    const provider = process.env.STORAGE_PROVIDER;
                    const logger = new common_1.Logger('StorageModule');
                    if (provider === 's3') {
                        logger.log('Storage Provider: S3');
                        return new storage_service_1.S3StorageService();
                    }
                    else if (provider === 'local') {
                        logger.log('Storage Provider: LOCAL');
                        return new storage_service_1.LocalStorageService();
                    }
                    else {
                        logger.error(`Invalid or missing STORAGE_PROVIDER environment variable. Must be 's3' or 'local'. Current value: ${provider}`);
                        process.exit(1);
                    }
                },
            },
        ],
        exports: [storage_service_1.AbstractStorageService],
        controllers: [storage_controller_1.StorageController],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map