import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/exception.filter';
import { LoggingInterceptor } from './logger/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor(app.get('winston')));
  app.useGlobalPipes(new ValidationPipe({whitelist: true}))
  app.useGlobalFilters(new HttpExceptionFilter(app.get('winston')));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
