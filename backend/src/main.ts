// src/main.ts

import * as dotenv from 'dotenv';
dotenv.config(); // <--- บรรทัดนี้ต้องอยู่บนสุด ห้ามย้าย!

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('>>> MAIN.TS เวอร์ชันใหม่ กำลังรัน <<<'); // marker

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('vetiver-grass/api/v1');
  app.enableCors({ origin: true, credentials: true });

  await app.listen(3008); // hardcode ตรงๆ ไม่พึ่ง env
  console.log('🚀 รันที่ http://localhost:3008/vetiver-grass/api/v1');
}

bootstrap().catch((err) => {
  console.error(err);
});
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();
