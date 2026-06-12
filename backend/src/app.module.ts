import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionModule } from 'src/common/exception/exception.module';
import { TopicModule } from './topic/topic.module';
import { SectionModule } from './section/section.module';
import { AuthModule } from './backoffice/auth/auth.module';
@Module({
  imports: [ExceptionModule, TopicModule, SectionModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
