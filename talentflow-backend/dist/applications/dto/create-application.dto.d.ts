import { ApplicationStatus } from '@prisma/client';
export declare class CreateApplicationDto {
    candidateId: string;
    jobId: string;
    resumeId?: string;
    status?: ApplicationStatus;
    matchScore?: number;
}
