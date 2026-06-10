import { Controller, Get, Param, Query } from '@nestjs/common';
import { TopicService } from './topic.service';
import { PaginationTopicDto } from './dto/pagination-topic.dto';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('all')
  findAll() {
    return this.topicService.findAll();
  }

  @Get()
  findMany(@Query() paginationDto: PaginationTopicDto) {
    return this.topicService.findMany(paginationDto);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.topicService.findBySlug(slug);
  }
}
