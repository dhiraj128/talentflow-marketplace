"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const users_module_1 = require("./users/users.module");
const employers_module_1 = require("./employers/employers.module");
const candidates_module_1 = require("./candidates/candidates.module");
const jobs_module_1 = require("./jobs/jobs.module");
const applications_module_1 = require("./applications/applications.module");
const courses_module_1 = require("./courses/courses.module");
const enrollments_module_1 = require("./enrollments/enrollments.module");
const certificates_module_1 = require("./certificates/certificates.module");
const skills_module_1 = require("./skills/skills.module");
const notifications_module_1 = require("./notifications/notifications.module");
const audit_logs_module_1 = require("./audit-logs/audit-logs.module");
const analytics_module_1 = require("./analytics/analytics.module");
const matching_engine_module_1 = require("./matching-engine/matching-engine.module");
const interviews_module_1 = require("./interviews/interviews.module");
const billing_module_1 = require("./billing/billing.module");
const subscription_module_1 = require("./subscription/subscription.module");
const file_upload_module_1 = require("./file-upload/file-upload.module");
const auth_module_1 = require("./auth/auth.module");
const resume_center_module_1 = require("./resume-center/resume-center.module");
const messages_module_1 = require("./messages/messages.module");
const search_module_1 = require("./search/search.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const progress_module_1 = require("./progress/progress.module");
const assessments_module_1 = require("./assessments/assessments.module");
const freelancers_module_1 = require("./freelancers/freelancers.module");
const project_requests_module_1 = require("./project-requests/project-requests.module");
const categories_module_1 = require("./categories/categories.module");
const designations_module_1 = require("./designations/designations.module");
const locations_module_1 = require("./locations/locations.module");
const coupons_module_1 = require("./coupons/coupons.module");
const offers_module_1 = require("./offers/offers.module");
const plans_module_1 = require("./plans/plans.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const trainers_module_1 = require("./trainers/trainers.module");
const storage_module_1 = require("./storage/storage.module");
const health_module_1 = require("./health/health.module");
const request_logger_middleware_1 = require("./common/middleware/request-logger.middleware");
const talent_crm_module_1 = require("./talent-crm/talent-crm.module");
const saved_searches_module_1 = require("./saved-searches/saved-searches.module");
const job_alerts_module_1 = require("./job-alerts/job-alerts.module");
const search_analytics_module_1 = require("./search-analytics/search-analytics.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(request_logger_middleware_1.RequestLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            employers_module_1.EmployersModule,
            candidates_module_1.CandidatesModule,
            jobs_module_1.JobsModule,
            applications_module_1.ApplicationsModule,
            talent_crm_module_1.TalentCrmModule,
            courses_module_1.CoursesModule,
            enrollments_module_1.EnrollmentsModule,
            certificates_module_1.CertificatesModule,
            skills_module_1.SkillsModule,
            notifications_module_1.NotificationsModule,
            audit_logs_module_1.AuditLogsModule,
            analytics_module_1.AnalyticsModule,
            matching_engine_module_1.MatchingEngineModule,
            interviews_module_1.InterviewsModule,
            billing_module_1.BillingModule,
            subscription_module_1.SubscriptionModule,
            file_upload_module_1.FileUploadModule,
            resume_center_module_1.ResumeCenterModule,
            messages_module_1.MessagesModule,
            search_module_1.SearchModule,
            progress_module_1.ProgressModule,
            assessments_module_1.AssessmentsModule,
            freelancers_module_1.FreelancersModule,
            project_requests_module_1.ProjectRequestsModule,
            categories_module_1.CategoriesModule,
            designations_module_1.DesignationsModule,
            locations_module_1.LocationsModule,
            coupons_module_1.CouponsModule,
            offers_module_1.OffersModule,
            plans_module_1.PlansModule,
            subscriptions_module_1.SubscriptionsModule,
            trainers_module_1.TrainersModule,
            storage_module_1.StorageModule,
            saved_searches_module_1.SavedSearchesModule,
            job_alerts_module_1.JobAlertsModule,
            search_analytics_module_1.SearchAnalyticsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map