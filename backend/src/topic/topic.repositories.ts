import { Injectable } from '@nestjs/common';
import { ResponseTopicDto } from './dto/response-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TopicRepositories {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ResponseTopicDto[]> {
    const data = await this.prisma.topic.findMany({
      orderBy: { order: 'asc' },
      include: {
        sections: true,
        _count: { select: { sections: true } },
      },
    });
    return data;
  }
  async findBySlug(slug: string): Promise<ResponseTopicDto | null> {
    const data = await this.prisma.topic.findUnique({
      where: {
        slug: String(slug),
      },
      include: {
        sections: true,
        _count: { select: { sections: true } },
      },
    });
    return data;
  }
}
