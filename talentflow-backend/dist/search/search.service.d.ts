import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    searchTalent(q?: string, location?: string): Promise<{
        id: string;
        name: string;
        role: string;
        location: string;
        rating: number;
        availableNow: boolean;
        experience: string;
        skills: string[];
        certification: string;
    }[]>;
    searchJobs(q?: string, location?: string): Promise<{
        id: string;
        title: string;
        company: string;
        location: string;
        salary: string;
        type: string;
        posted: string;
        matchScore: number;
        skills: string[];
        logo: string | null;
    }[]>;
    searchFreelancers(q?: string, location?: string): Promise<{
        id: string;
        name: string;
        title: string;
        hourlyRate: number;
        rating: number;
        completedJobs: number;
        skills: string[];
    }[]>;
    searchCourses(q?: string, location?: string): Promise<{
        id: string;
        title: string;
        instructor: string;
        rating: number | null;
        students: number;
        duration: string;
        level: string;
        thumbnail: string | null;
    }[]>;
    getJobSuggestions(q: string): Promise<{
        suggestions: {
            text: string;
            type: string;
        }[];
    }>;
    getJobLocations(q: string): Promise<{
        locations: string[];
    }>;
}
