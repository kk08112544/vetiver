export class ResponseSectionDto {
  id!: number;
  order!: number;
  heading!: string;
  body!: string | null;
  items!: string;
  topicId!: number;
  topic!: {
    id: number;
    slug: string;
    order: number;
    title: string;
    subtitle: string | null;
  };
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;
}
