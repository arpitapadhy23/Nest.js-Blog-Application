import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomErrorFilter } from './utils/error-handler.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomErrorFilter());
  await app.listen(3000);
}
bootstrap();
