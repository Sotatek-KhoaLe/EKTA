import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as customEnv from 'custom-env';
import * as path from 'path';
import * as ms from 'ms';
import * as ip from 'ip';

import { DEFAULT_CACHE_LONG_TIMEOUT, DEFAULT_CACHE_TIMEOUT } from './config.constants';

process.env.NODE_ENV = process.env.NODE_ENV ?? 'dev';
const customEnvName = process.env.DOT_ENV_SUFFIX ?? process.env.NODE_ENV;
console.log('Using NODE_ENV: ' + process.env.NODE_ENV);
console.log('Using customEnvName: ' + customEnvName);
customEnv.env(customEnvName);
const _process = {
  env: process.env,
};
process.env = {};

@Injectable()
export class ConfigService {
  // COMMON
  DEV = 'dev';
  TEST = 'test';
  PROD = 'prod';
  JEST = 'jest';
  DEBUG = (_process.env.DEBUG ?? 'false').toLowerCase() !== 'false';
  NODE_ENV = _process.env.NODE_ENV;
  TZ = 'Asia/Ho_Chi_Minh';
  INSTANCE_ID = _process.env.INSTANCE_ID ?? 0;
  LIST_LIMIT = parseInt(_process.env.LIST_LIMIT ?? '250', 10);

  // SPECIAL
  THIRD_PARTIES = {};

  // NETWORK
  LOCAL_IP = ip.address();
  PUBLIC_IP = _process.env.PUBLIC_IP ?? this.LOCAL_IP;
  PORT = parseInt(_process.env.PORT ?? '1234', 10);
  HOST = `http://${this.PUBLIC_IP}:${this.PORT}`;
  API_NAMESPACE = _process.env.API_NAMESPACE ?? 'api/v1';
  STATIC_PATH = 'static';
  DOC_PATH = path.resolve('documentation');
  UPLOAD_PATH = _process.env.UPLOAD_PATH ?? 'media/uploads';
  UPLOAD_LIMIT = parseInt(_process.env.UPLOAD_LIMIT, 10) || 1024 * 1024 * 5; //Byte

  // MIDDLEWARE
  RATE_LIMIT = {
    windowMs: 60 * 1000,
    max: 120,
  };
  CSRF = (_process.env.CSRF ?? 'true').toLowerCase() === 'true';
  CORS_URLS_REGEX = '^http://192.168.1.\\d+:4\\d{3}$';
  CORS_ALLOWED_ORIGINS = ['http://localhost:' + this.PORT];
  CORS: CorsOptions = {
    origin: _process.env.CORS_ORIGINS ?? [this.CORS_URLS_REGEX, ...this.CORS_ALLOWED_ORIGINS],
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders:
      'content-type, authorization, accept-encoding, user-agent, accept, cache-control, connection, cookie',
    exposedHeaders: 'X-RateLimit-Reset, set-cookie',
  };

  // DB
  DB_TYPE = _process.env.DB_TYPE ?? 'postgres';
  DB_HOST = _process.env.DB_HOST ?? 'localhost';
  DB_PORT = parseInt(_process.env.DB_PORT ?? '5432', 10);
  DB_USERNAME = _process.env.DB_USERNAME ?? 'postgres';
  DB_PASSWORD = _process.env.DB_PASSWORD ?? 'root';
  DB_DATABASE = _process.env.DB_DATABASE ?? 'postgres_nest';

  REDIS_HOST = _process.env.REDIS_HOST ?? 'localhost';
  REDIS_PORT = parseInt(_process.env.REDIS_PORT ?? '6379', 10);
  REDIS_USERNAME = _process.env.REDIS_USERNAME ?? '';
  REDIS_PASSWORD = _process.env.REDIS_PASSWORD ?? '';
  REDIS_STORAGE = {
    // 0 ~ 15
    DB: _process.env.REDIS_STORAGE_DB ?? '0',
    GLOBAL: _process.env.REDIS_STORAGE_SYSTEM ?? '1',
    AUTH: _process.env.REDIS_STORAGE_SETTING ?? '2',
    USER: _process.env.REDIS_STORAGE_SETTING ?? '3',
  };

  CACHE_TIMEOUT = ms(_process.env.CACHE_TIMEOUT ?? DEFAULT_CACHE_TIMEOUT);
  CACHE_LONG_TIMEOUT = ms(_process.env.CACHE_LONG_TIMEOUT ?? DEFAULT_CACHE_LONG_TIMEOUT);
  CACHE_DB_TIMEOUT = ms('5s');

  // USER
}

export const config = new ConfigService();
