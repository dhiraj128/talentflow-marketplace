import { S3Client } from '@aws-sdk/client-s3';
export interface UploadedFile {
    filename: string;
    originalname?: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}
export interface StorageResult {
    key: string;
    url: string;
}
export declare abstract class AbstractStorageService {
    abstract uploadFile(file: UploadedFile, folder: string, candidateId?: string): Promise<StorageResult>;
    abstract deleteFile(key: string): Promise<void>;
    abstract getFileUrl(key: string): string;
    abstract getS3Client(): S3Client | null;
    abstract getBucketName(): string | null;
}
export declare class S3StorageService extends AbstractStorageService {
    private readonly s3Client;
    private readonly bucket;
    private readonly region;
    private readonly baseUrl;
    constructor();
    getS3Client(): S3Client;
    getBucketName(): string;
    uploadFile(file: UploadedFile, folder?: string, candidateId?: string): Promise<StorageResult>;
    deleteFile(key: string): Promise<void>;
    getFileUrl(key: string): string;
}
export declare class LocalStorageService extends AbstractStorageService {
    private readonly baseUrl;
    private readonly uploadPath;
    constructor();
    getS3Client(): S3Client | null;
    getBucketName(): string | null;
    uploadFile(file: UploadedFile, folder?: string, candidateId?: string): Promise<StorageResult>;
    deleteFile(key: string): Promise<void>;
    getFileUrl(key: string): string;
}
