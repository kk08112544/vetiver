import { Injectable } from '@nestjs/common';
import { TopicRepositories } from './topic.repositories';
import { PaginationTopicDto } from './dto/pagination-topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly topicRepositories: TopicRepositories) {}

  async findAll() {
    const data = await this.topicRepositories.findAll();
    return data;
  }

  async findMany(dto: PaginationTopicDto) {
    const data = await this.topicRepositories.findManyPaginated(dto);
    return data;
  }

  async findBySlug(slug: string) {
    const data = await this.topicRepositories.findBySlug(slug);
    return data;
  }
}
