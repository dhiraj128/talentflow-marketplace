import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    create(createCertificateDto: CreateCertificateDto): import(".prisma/client").Prisma.Prisma__CertificateClient<{
        id: string;
        candidateId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(skip?: string, take?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        candidateId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string | null;
    }[]>;
    findOne(id: string, user: any): Promise<{
        course: {
            trainer: {
                id: string;
                userId: string;
                fullName: string;
                bio: string | null;
                expertise: string | null;
                avatarUrl: string | null;
                rating: number | null;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            title: string;
            category: string;
            description: string;
            thumbnailUrl: string | null;
            rating: number | null;
            studentCount: number;
            createdAt: Date;
            updatedAt: Date;
            trainerId: string;
            duration: string | null;
            level: string | null;
            price: number;
            status: import(".prisma/client").$Enums.CourseStatus;
        };
        candidate: {
            id: string;
            userId: string;
            fullName: string;
            title: string | null;
            location: string | null;
            avatarUrl: string | null;
            resumeUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
            education: import(".prisma/client").Prisma.JsonValue | null;
            experience: import(".prisma/client").Prisma.JsonValue | null;
            githubUrl: string | null;
            linkedinUrl: string | null;
            phone: string | null;
            portfolioUrl: string | null;
        };
    } & {
        id: string;
        candidateId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string | null;
    }>;
    update(id: string, updateCertificateDto: UpdateCertificateDto, user: any): Promise<{
        id: string;
        candidateId: string;
        courseId: string;
        issuedAt: Date;
        certificateUrl: string | null;
    }>;
    remove(id: string, user: any): Promise<{
        success: boolean;
    }>;
}
