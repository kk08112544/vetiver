import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TopicRepositories } from './topic.repositories';
@Module({
  controllers: [TopicController],
  providers: [TopicService, TopicRepositories, PrismaService],
})
export class TopicModule {}
