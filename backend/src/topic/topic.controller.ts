import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { TopicService } from './topic.service';

@Controller('backoffice/topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('all')
  findAll() {
    return this.topicService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.topicService.findBySlug(slug);
  }
}
