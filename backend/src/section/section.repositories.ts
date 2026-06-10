import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ResponseSectionDto } from './dto/response-section.dto';
import { PaginationSectionDto } from './dto/pagination-section.dto';
import { PaginatedResult } from 'src/common/pagination/paginate.interface';
import { Prisma } from '@prisma/client';
import { paginate } from 'src/common/pagination/paginate.util';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SectionRepositories {
   constructor(private readonly prisma: PrismaService) {}
  create(createSectionDto: CreateSectionDto) {
    return 'This action adds a new section';
  }

  findAll() {
    return `This action returns all section`;
  }

  async findByTopicId(topicId: number, options: PaginationSectionDto): Promise<PaginatedResult<ResponseSectionDto>> {
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
        return this.prisma.section.findMany({   // 👈 เพิ่ม return ตรงนี้
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

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
