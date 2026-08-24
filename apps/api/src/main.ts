import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

config({ path: resolve(process.cwd(), '../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
  app.setGlobalPrefix('v1');
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000', methods: ['GET', 'POST', 'PATCH', 'DELETE'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
