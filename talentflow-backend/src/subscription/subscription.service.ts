import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.employerProfile.update({
      where: { id: createSubscriptionDto.employerId },
      data: { subscription: createSubscriptionDto.tier },
    });
  }

  findAll() {
    return this.prisma.employerProfile.findMany({
      select: { id: true, companyName: true, subscription: true },
    });
  }

  findOne(id: string) {
    return this.prisma.employerProfile.findUnique({
      where: { id },
      select: { id: true, companyName: true, subscription: true },
    });
  }

  update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
    if (updateSubscriptionDto.tier) {
      return this.prisma.employerProfile.update({
        where: { id },
        data: { subscription: updateSubscriptionDto.tier },
      });
    }
    return null;
  }

  remove(id: string) {
    return this.prisma.employerProfile.update({
      where: { id },
      data: { subscription: 'FREE' },
    });
  }
}
