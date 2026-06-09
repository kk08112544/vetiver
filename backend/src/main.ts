import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิด CORS ให้ Quasar dev server เรียกได้
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  });

  app.setGlobalPrefix('vetiver-grass/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT ?? 3008;
  await app.listen(port);
  console.log(
    `🚀 API หญ้าแฝก รันที่ http://localhost:${port}/vetiver-grass/api`,
  );
}
bootstrap();
