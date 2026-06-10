import { Injectable } from '@nestjs/common';
import { ResponseTopicDto } from './dto/response-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationTopicDto } from './dto/pagination-topic.dto';
import { PaginatedResult } from 'src/common/pagination/paginate.interface';
import { paginate } from 'src/common/pagination/paginate.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class TopicRepositories {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ResponseTopicDto[]> {
    const data = await this.prisma.topic.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { order: 'asc' },
      include: {
        sections: true,
        _count: { select: { sections: true } },
      },
    });

    return data;
  }

  async findManyPaginated(
    options: PaginationTopicDto,
  ): Promise<PaginatedResult<ResponseTopicDto>> {
    const whereCondition: Prisma.TopicWhereInput = { deletedAt: null };

    if (options.search) {
      whereCondition.OR = [
        { title: { contains: options.search } },
        { slug: { contains: options.search } },
        { subtitle: { contains: options.search } },
      ];
    }

    const queryFn = (skip: number, take: number) =>
      this.prisma.topic.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy: { createdAt: 'asc' },
        include: {
          sections: true,
          _count: { select: { sections: true } },
        },
      });

    const countFn = () => this.prisma.topic.count({ where: whereCondition });

    return paginate(queryFn, countFn, options);
  }

  async findById(id: number): Promise<ResponseTopicDto | null> {
    const data = await this.prisma.topic.findUnique({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: {
        sections: true,
        _count: { select: { sections: true } },
      },
    });
    return data;
  }
}
