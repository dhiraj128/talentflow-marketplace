import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { EmployersModule } from './employers/employers.module';
import { CandidatesModule } from './candidates/candidates.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { CoursesModule } from './courses/courses.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SkillsModule } from './skills/skills.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MatchingEngineModule } from './matching-engine/matching-engine.module';
import { BillingModule } from './billing/billing.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { ResumeCenterModule } from './resume-center/resume-center.module';
import { MessagesModule } from './messages/messages.module';
import { SearchModule } from './search/search.module';
@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EmployersModule, CandidatesModule, JobsModule, ApplicationsModule, CoursesModule, EnrollmentsModule, CertificatesModule, SkillsModule, NotificationsModule, AuditLogsModule, AnalyticsModule, MatchingEngineModule, BillingModule, SubscriptionModule, FileUploadModule, ResumeCenterModule, MessagesModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
