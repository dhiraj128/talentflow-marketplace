import { CreateJobDto } from './create-job.dto';
declare const UpdateJobDto_base: import("@nestjs/common").Type<Partial<Omit<CreateJobDto, "status" | "employerId">>>;
export declare class UpdateJobDto extends UpdateJobDto_base {
}
export {};
