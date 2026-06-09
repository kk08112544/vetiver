export class ResponseTopicDto {
  id!: number;
  slug!: string;
  order!: number;
  title!: string;
  icon!: string;
  accent!: string;
  intro!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  sections!: {
    id: number;
    order: number;
    heading: string;
    body: string | null;
    items: string;
    topicId: number;
  }[];
  _count!: {
    sections: number;
  };
}
