import { Injectable } from '@nestjs/common';

import { SectionRepositories } from './section.repositories';
import { PaginationSectionDto } from './dto/pagination-section.dto';
@Injectable()
export class SectionService {
  constructor(private readonly sectionRepositories: SectionRepositories) {}

  async findByTopicId(topicId: number, dto: PaginationSectionDto) {
    const data = await this.sectionRepositories.findByTopicId(topicId, dto);
    return data;
  }
}
