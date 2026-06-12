import { Controller, Get, Query, Param } from '@nestjs/common';
import { SectionService } from './section.service';

import { PaginationSectionDto } from './dto/pagination-section.dto';

@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get('topic/:topicId')
  findByTopicId(
    @Param('topicId') topicId: number,
    @Query() paginationDto: PaginationSectionDto,
  ) {
    return this.sectionService.findByTopicId(topicId, paginationDto);
  }
}
