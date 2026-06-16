import { Injectable } from '@nestjs/common';
import { SectionRepositories } from './section.repositories';
import { PaginationSectionDto } from './dto/pagination-section.dto';
import {MESSAGE} from 'src/common/message/message'

@Injectable()
export class SectionService {
  constructor(private readonly sectionRepositories: SectionRepositories) {}

  async findByTopicId(topicId: number, dto: PaginationSectionDto) {
    const data = await this.sectionRepositories.findByTopicId(topicId, dto);
    return {
      section:data,
      message:MESSAGE.SECTION.SECTION_TOPIC_ID
    }
  }
}
