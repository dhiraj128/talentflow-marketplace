import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  create(createBillingDto: CreateBillingDto) {
    return this.prisma.billing.create({ data: createBillingDto });
  }

  findAll(skip?: number, take?: number) {
    return this.prisma.billing.findMany({ skip, take });
  }

  findOne(id: string) {
    return this.prisma.billing.findUnique({ where: { id } });
  }

  update(id: string, updateBillingDto: UpdateBillingDto) {
    return this.prisma.billing.update({
      where: { id },
      data: updateBillingDto,
    });
  }

  remove(id: string) {
    return this.prisma.billing.delete({ where: { id } });
  }
}
