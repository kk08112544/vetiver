import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicModule } from './topic/topic.module';
import { SectionModule } from './section/section.module';

@Module({
  imports: [TopicModule, SectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
