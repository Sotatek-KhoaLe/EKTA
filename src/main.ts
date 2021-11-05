import { NestFactory } from '@nestjs/core';
import { ValidationError as NestValidationError } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as csurf from 'csurf';
import * as express from 'express';

import { config } from '@/config';
import { LoggingService } from '@/base/logging';
import { ValidationError } from '@/base/api/exception';
import {
  ValidationPipe,
  ContextInterceptor,
  HttpExceptionFilter,
  UnknownExceptionsFilter,
  ResponseTransformInterceptor,
  useMorgan,
  authMiddleware,
} from '@/base/middleware';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const loggingService = app.get(LoggingService);
  const logger = loggingService.getLogger();
  const csrf = config.CSRF ? csurf({ cookie: true }) : (req, res, next) => next();

  app.enableCors(config.CORS);
  app.setGlobalPrefix(config.API_NAMESPACE);
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(cookieParser());
  app.use(rateLimit(config.RATE_LIMIT));
  app.use(csrf);
  app.use(useMorgan(loggingService.logger.access));

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalInterceptors(new ContextInterceptor());
  app.useGlobalFilters(new UnknownExceptionsFilter(loggingService));
  app.useGlobalFilters(new HttpExceptionFilter(loggingService));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: NestValidationError[] = []) => new ValidationError(validationErrors),
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet());
  app.use('/uploads', express.static(config.UPLOAD_PATH));
  app.use('/favicon.ico', express.static(config.STATIC_PATH + '/favicon.ico'));

  await app.listen(config.PORT);
  const hostname = config.HOST;
  logger.info('Server time: ' + new Date().toString());
  logger.info(`Local/public ip: ${config.LOCAL_IP} - ${config.PUBLIC_IP}`);
  logger.info(`Running app on: ${hostname}`);
  logger.info(`Api DocumentV1: ${hostname}/apidoc`);
  logger.info(`Api gateway v1: ${hostname}/${config.API_NAMESPACE}`);
}

bootstrap();
