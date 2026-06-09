import { Injectable } from '@nestjs/common';
import { TopicRepositories } from './topic.repositories';

@Injectable()
export class TopicService {
  constructor(private readonly topicRepositories: TopicRepositories) {}


  async findAll() {
    const data = await this.topicRepositories.findAll();
    return data;
  }

  async findBySlug(slug: string) {
    const data = await this.topicRepositories.findBySlug(slug);
    return data;
  }
}
