import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    create(createBillingDto: CreateBillingDto): import(".prisma/client").Prisma.Prisma__BillingClient<{
        id: string;
        employerId: string;
        invoiceId: string;
        amount: number;
        status: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(skip?: string, take?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        employerId: string;
        invoiceId: string;
        amount: number;
        status: string;
        issuedAt: Date;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__BillingClient<{
        id: string;
        employerId: string;
        invoiceId: string;
        amount: number;
        status: string;
        issuedAt: Date;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateBillingDto: UpdateBillingDto): import(".prisma/client").Prisma.Prisma__BillingClient<{
        id: string;
        employerId: string;
        invoiceId: string;
        amount: number;
        status: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__BillingClient<{
        id: string;
        employerId: string;
        invoiceId: string;
        amount: number;
        status: string;
        issuedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
