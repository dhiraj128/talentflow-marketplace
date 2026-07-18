import { Module, Global, Logger } from '@nestjs/common';
import { AbstractStorageService, S3StorageService, LocalStorageService } from './storage.service';
import { StorageController } from './storage.controller';

@Global()
@Module({
  providers: [
    {
      provide: AbstractStorageService,
      useFactory: () => {
        const provider = process.env.STORAGE_PROVIDER;
        const logger = new Logger('StorageModule');
        
        if (provider === 's3') {
          logger.log('Storage Provider: S3');
          return new S3StorageService();
        } else if (provider === 'local') {
          logger.log('Storage Provider: LOCAL');
          return new LocalStorageService();
        } else {
          logger.error(`Invalid or missing STORAGE_PROVIDER environment variable. Must be 's3' or 'local'. Current value: ${provider}`);
          process.exit(1); // Fail application startup
        }
      },
    },
  ],
  exports: [AbstractStorageService],
  controllers: [StorageController],
})
export class StorageModule {}
