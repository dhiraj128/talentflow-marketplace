import { FileUploadService } from './file-upload.service';
export declare class FileUploadController {
    private readonly fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadResume(file: Express.Multer.File, user: any): Promise<{
        success: boolean;
        url: string;
        key: string;
        originalName: string;
        mimeType: string;
        size: number;
        resumeId: string;
        data: {
            id: string;
            title: string | null;
            type: string;
            fileName: string | null;
            storageKey: string | null;
            bucket: string | null;
            mimeType: string | null;
            size: number | null;
            version: number;
            createdAt: Date;
            candidateId: string;
            content: import(".prisma/client").Prisma.JsonValue | null;
            fileUrl: string | null;
            isDefault: boolean;
            updatedAt: Date;
        };
    }>;
    uploadVerificationDocument(file: Express.Multer.File, documentType: string, user: any): Promise<{
        success: boolean;
        url: string;
        documentId: string;
        documentType: string;
        status: string;
    }>;
    uploadAvatar(file: Express.Multer.File, user: any): Promise<{
        success: boolean;
        url: string;
        avatarUrl: string;
        originalName: string;
        mimeType: string;
    }>;
    testAws(): Promise<{
        success: boolean;
        reason: string;
        region?: undefined;
        bucket?: undefined;
        envVars?: undefined;
        uploadResult?: undefined;
    } | {
        region: string;
        bucket: string | null;
        envVars: {
            AWS_REGION: string | undefined;
            AWS_S3_BUCKET: string | undefined;
            has_AWS_ACCESS_KEY_ID: boolean;
            has_AWS_SECRET_ACCESS_KEY: boolean;
            has_ACCESS_KEY_ID: boolean;
            has_SECRET_ACCESS_KEY: boolean;
            accessKeyIdSuffix: string;
            secretLength: number;
            secretHasWhitespace: boolean;
            accessKeyHasWhitespace: boolean;
        };
        uploadResult: import("../storage/storage.service").StorageResult | {
            error: any;
            awsErrorName: any;
            details: any;
            code: any;
        };
        success?: undefined;
        reason?: undefined;
    }>;
}
