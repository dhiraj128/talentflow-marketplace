import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

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

export abstract class AbstractStorageService {
  abstract uploadFile(file: UploadedFile, folder: string, candidateId?: string): Promise<StorageResult>;
  abstract deleteFile(key: string): Promise<void>;
  abstract getFileUrl(key: string): string;
  abstract getS3Client(): S3Client | null;
  abstract getBucketName(): string | null;
}

@Injectable()
export class S3StorageService extends AbstractStorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly baseUrl = process.env.API_URL || 'http://localhost:3001/api/v1';

  constructor() {
    super();
    this.region = process.env.AWS_REGION || 'eu-north-1';
    
    console.log(`[S3 Config Startup] process.env.AWS_REGION='${process.env.AWS_REGION}', actual region passed to S3Client='${this.region}'`);

    this.bucket = process.env.AWS_S3_BUCKET || 'talentflow-private-resumes-dk2026';
    
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY || '',
      }
    });
  }

  getS3Client(): S3Client {
    return this.s3Client;
  }

  getBucketName(): string {
    return this.bucket;
  }

  async uploadFile(file: UploadedFile, folder: string = 'resumes', candidateId?: string): Promise<StorageResult> {
    try {
      const extension = path.extname(file.originalname || file.filename);
      const uniqueName = `${uuidv4()}${extension}`;
      
      let key = `${folder}/${uniqueName}`;
      if (candidateId) {
        key = `${folder}/${candidateId}/${uniqueName}`;
      }

      const command = new PutObjectCommand({
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
        url: this.getFileUrl(key)
      };
    } catch (error: any) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException({
        message: 'Failed to upload file to S3',
        awsErrorName: error?.name,
        awsErrorCode: error?.Code || error?.code,
        awsRequestId: error?.$metadata?.requestId,
        httpStatusCode: error?.$metadata?.httpStatusCode,
        details: error?.message
      });
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Failed to delete file from S3: ${key}`, error);
    }
  }

  getFileUrl(key: string): string {
    return `${this.baseUrl}/files/${key}`;
  }
}

@Injectable()
export class LocalStorageService extends AbstractStorageService {
  private readonly baseUrl = process.env.API_URL || 'http://localhost:3001/api/v1';
  private readonly uploadPath: string;

  constructor() {
    super();
    this.uploadPath = process.env.LOCAL_STORAGE_PATH || 'uploads/e2e-resumes';
  }

  getS3Client(): S3Client | null {
    return null;
  }

  getBucketName(): string | null {
    return null;
  }

  async uploadFile(file: UploadedFile, folder: string = 'resumes', candidateId?: string): Promise<StorageResult> {
    try {
      const fs = await import('fs/promises');
      const extension = path.extname(file.originalname || file.filename);
      const uniqueName = `${uuidv4()}${extension}`;
      
      let key = `${folder}/${uniqueName}`;
      if (candidateId) {
        key = `${folder}/${candidateId}/${uniqueName}`;
      }

      // Ensure no path traversal in the key itself
      const safeKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
      const fullPath = path.resolve(process.cwd(), this.uploadPath, safeKey);
      
      // Ensure the resolved path is inside the uploadPath directory (prevent traversal)
      const uploadDir = path.resolve(process.cwd(), this.uploadPath);
      if (!fullPath.startsWith(uploadDir)) {
         throw new InternalServerErrorException('Invalid file path');
      }

      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.buffer);

      return {
        key: safeKey,
        url: this.getFileUrl(safeKey)
      };
    } catch (error) {
      console.error('Local Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file locally');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const safeKey = path.normalize(key).replace(/^(\.\.(\/|\\|$))+/, '');
      const fullPath = path.resolve(process.cwd(), this.uploadPath, safeKey);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete local file: ${key}`, error);
    }
  }

  getFileUrl(key: string): string {
    return `${this.baseUrl}/files/${key}`;
  }
}

