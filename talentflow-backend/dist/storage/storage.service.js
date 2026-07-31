"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = exports.S3StorageService = exports.AbstractStorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const path = __importStar(require("path"));
class AbstractStorageService {
}
exports.AbstractStorageService = AbstractStorageService;
let S3StorageService = class S3StorageService extends AbstractStorageService {
    s3Client;
    bucket;
    region;
    baseUrl = process.env.API_URL || 'http://localhost:3001/api/v1';
    constructor() {
        super();
        this.region = process.env.AWS_REGION || 'ap-south-1';
        console.log(`[S3 Config Startup] process.env.AWS_REGION='${process.env.AWS_REGION}', actual region passed to S3Client='${this.region}'`);
        this.bucket =
            process.env.AWS_S3_BUCKET || 'talentflow-private-resumes-dk2026';
        const accessKeyId = (process.env.AWS_ACCESS_KEY_ID ||
            process.env.ACCESS_KEY_ID ||
            '').trim();
        const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY ||
            process.env.SECRET_ACCESS_KEY ||
            '').trim();
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    getS3Client() {
        return this.s3Client;
    }
    getBucketName() {
        return this.bucket;
    }
    async uploadFile(file, folder = 'resumes', candidateId) {
        try {
            const extension = path.extname(file.originalname || file.filename);
            const uniqueName = `${(0, crypto_1.randomUUID)()}${extension}`;
            let key = `${folder}/${uniqueName}`;
            if (candidateId) {
                key = `${folder}/${candidateId}/${uniqueName}`;
            }
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            console.log(`[S3StorageService] Before PutObject. Bucket: ${this.bucket}, Key: ${key}`);
            await this.s3Client.send(command);
            console.log(`[S3StorageService] After PutObject success. Key: ${key}`);
            return {
                key,
                url: this.getFileUrl(key),
            };
        }
        catch (error) {
            console.error('S3 Upload Error:', error);
            throw new common_1.InternalServerErrorException({
                message: 'Failed to upload file to S3',
                awsErrorName: error?.name,
                awsErrorCode: error?.Code || error?.code,
                awsRequestId: error?.$metadata?.requestId,
                httpStatusCode: error?.$metadata?.httpStatusCode,
                details: error?.message,
            });
        }
    }
    async deleteFile(key) {
        try {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.s3Client.send(command);
        }
        catch (error) {
            console.error(`Failed to delete file from S3: ${key}`, error);
        }
    }
    getFileUrl(key) {
        return `${this.baseUrl}/files/${key}`;
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3StorageService);
let LocalStorageService = class LocalStorageService extends AbstractStorageService {
    baseUrl = process.env.API_URL || 'http://localhost:3001/api/v1';
    uploadPath;
    constructor() {
        super();
        this.uploadPath = process.env.LOCAL_STORAGE_PATH || 'uploads/e2e-resumes';
    }
    getS3Client() {
        return null;
    }
    getBucketName() {
        return null;
    }
    async uploadFile(file, folder = 'resumes', candidateId) {
        try {
            const fs = await import('fs/promises');
            const extension = path.extname(file.originalname || file.filename);
            const uniqueName = `${(0, crypto_1.randomUUID)()}${extension}`;
            let key = `${folder}/${uniqueName}`;
            if (candidateId) {
                key = `${folder}/${candidateId}/${uniqueName}`;
            }
            const safeKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
            const fullPath = path.resolve(process.cwd(), this.uploadPath, safeKey);
            const uploadDir = path.resolve(process.cwd(), this.uploadPath);
            if (!fullPath.startsWith(uploadDir)) {
                throw new common_1.InternalServerErrorException('Invalid file path');
            }
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.writeFile(fullPath, file.buffer);
            return {
                key: safeKey,
                url: this.getFileUrl(safeKey),
            };
        }
        catch (error) {
            console.error('Local Upload Error:', error);
            throw new common_1.InternalServerErrorException('Failed to upload file locally');
        }
    }
    async deleteFile(key) {
        try {
            const fs = await import('fs/promises');
            const safeKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
            const fullPath = path.resolve(process.cwd(), this.uploadPath, safeKey);
            await fs.unlink(fullPath);
        }
        catch (error) {
            console.error(`Failed to delete local file: ${key}`, error);
        }
    }
    getFileUrl(key) {
        return `${this.baseUrl}/files/${key}`;
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocalStorageService);
//# sourceMappingURL=storage.service.js.map