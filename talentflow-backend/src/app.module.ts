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
import { InterviewsModule } from './interviews/interviews.module';
import { BillingModule } from './billing/billing.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { AuthModule } from './auth/auth.module';
import { ResumeCenterModule } from './resume-center/resume-center.module';
import { MessagesModule } from './messages/messages.module';
import { SearchModule } from './search/search.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProgressModule } from './progress/progress.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { FreelancersModule } from './freelancers/freelancers.module';
import { ProjectRequestsModule } from './project-requests/project-requests.module';
import { CategoriesModule } from './categories/categories.module';
import { DesignationsModule } from './designations/designations.module';
import { LocationsModule } from './locations/locations.module';
import { CouponsModule } from './coupons/coupons.module';
import { OffersModule } from './offers/offers.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TrainersModule } from './trainers/trainers.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule, AuthModule, UsersModule, EmployersModule, CandidatesModule, JobsModule, ApplicationsModule, CoursesModule, EnrollmentsModule, CertificatesModule, SkillsModule, NotificationsModule, AuditLogsModule, AnalyticsModule, MatchingEngineModule, InterviewsModule, BillingModule, SubscriptionModule, FileUploadModule, ResumeCenterModule, MessagesModule, SearchModule, ProgressModule, AssessmentsModule, FreelancersModule, ProjectRequestsModule, CategoriesModule, DesignationsModule, LocationsModule, CouponsModule, OffersModule, PlansModule, SubscriptionsModule, TrainersModule, StorageModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
