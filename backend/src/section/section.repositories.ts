import { Injectable } from '@nestjs/common';

import { ResponseSectionDto } from './dto/response-section.dto';
import { PaginationSectionDto } from './dto/pagination-section.dto';
import { PaginatedResult } from 'src/common/pagination/paginate.interface';
import { Prisma } from '@prisma/client';
import { paginate } from 'src/common/pagination/paginate.util';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SectionRepositories {
  constructor(private readonly prisma: PrismaService) {}

  async findByTopicId(
    topicId: number,
    options: PaginationSectionDto,
  ): Promise<PaginatedResult<ResponseSectionDto>> {
    const whereCondition: Prisma.SectionWhereInput = {
      deletedAt: null,
      topicId: Number(topicId),
    };

    if (options.search) {
      whereCondition.OR = [
        { heading: { contains: options.search } },
        { body: { contains: options.search } },
      ];
    }

    const queryFn = (skip: number, take: number) => {
      return this.prisma.section.findMany({
        // 👈 เพิ่ม return ตรงนี้
        where: whereCondition,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          topic: true,
        },
      });
    };

    const countFn = () => {
      return this.prisma.section.count({
        where: whereCondition,
      });
    };

    return paginate(queryFn, countFn, options);
  }
}
