import { JobStatus } from '@prisma/client';
export declare class CreateJobDto {
    employerId: string;
    title: string;
    location?: string;
    type?: string;
    salaryRange?: string;
    description: string;
    status?: JobStatus;
}
