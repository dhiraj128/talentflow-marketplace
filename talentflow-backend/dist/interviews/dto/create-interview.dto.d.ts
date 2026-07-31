import { InterviewType } from '@prisma/client';
export declare class CreateInterviewDto {
    applicationId: string;
    scheduledAt: string;
    type?: InterviewType;
    duration?: number;
    timezone?: string;
    meetingProvider?: string;
    meetingUrl?: string;
    location?: string;
    instructions?: string;
    notes?: string;
}
