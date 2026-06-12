import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SectionRepositories } from './section.repositories';

@Module({
  controllers: [SectionController],
  providers: [SectionService, SectionRepositories, PrismaService],
})
export class SectionModule {}
