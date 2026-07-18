import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('resume')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadResume(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    console.log('[FileUploadController] Request received for resume upload');
    if (!file) {
      console.log('[FileUploadController] File missing in request');
      throw new BadRequestException('No file provided');
    }
    console.log(`[FileUploadController] File received. Size: ${file.size} bytes, Mime Type: ${file.mimetype}`);
    return this.fileUploadService.uploadResume(file, user.userId || user.sub);
  }

  @Post('aws-test')
  async testAws() {
    return this.fileUploadService.testAws();
  }
}
