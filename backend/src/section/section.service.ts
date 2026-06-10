import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionRepositories } from './section.repositories';
import { PaginationSectionDto } from './dto/pagination-section.dto';
@Injectable()
export class SectionService {
  constructor(private readonly sectionRepositories: SectionRepositories) {}

  create(createSectionDto: CreateSectionDto) {
    return 'This action adds a new section';
  }

  findAll() {
    return `This action returns all section`;
  }

  async findByTopicId(topicId: number, dto: PaginationSectionDto) {
    const { page, limit, search } = dto;
    const data = await this.sectionRepositories.findByTopicId(topicId, dto);
    return data;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  remove(id: number) {
    return `This action removes a #${id} section`;
  }
}
