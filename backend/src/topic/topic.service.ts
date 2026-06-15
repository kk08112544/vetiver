import { Injectable } from '@nestjs/common';
import { TopicRepositories } from './topic.repositories';
import { PaginationTopicDto } from './dto/pagination-topic.dto';
import { MESSAGE } from 'src/common/message/message';

@Injectable()
export class TopicService {
  constructor(private readonly topicRepositories: TopicRepositories) {}

  async findAll() {
    const data = await this.topicRepositories.findAll();
    return {
      topic: data,
      message: MESSAGE.TOPIC.ALL_SUCCESS,
    };
  }

  async findMany(dto: PaginationTopicDto) {
    const data = await this.topicRepositories.findManyPaginated(dto);
    return {
      topic: data,
      message: MESSAGE.TOPIC.PAGINATED_SUCCESS,
    };
  }

  async findById(id: number) {
    const data = await this.topicRepositories.findById(id);
    return {
      topic: data,
      message: MESSAGE.TOPIC.RETRIVED_SUCCESS,
    };
  }
}
