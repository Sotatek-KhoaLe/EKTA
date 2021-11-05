import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';

// GLOBAL
import { ConfigModule, ConfigService } from '@/config';
import { LoggingModule } from '@/base/logging/logging.module';
import { RedisModule } from '@/base/db/redis';
import { MemcachedModule } from '@/base/db/cache/memcached.module';

// CORE
import { DatabaseModule } from '@/base/db/db.module';
import { HealthController } from '@/base/health/health.controller';

// DEV ONLY
import { DocsModule } from '@/base/docs/docs.module';

// APP

const config = new ConfigService();
const devModules = config.NODE_ENV === config.PROD ? [] : [DocsModule];

const globalModule = [
  ConfigModule, //
  LoggingModule,
  RedisModule,
  MemcachedModule,
];

const coreModules = [
  TerminusModule, //
  DatabaseModule,
];

const appModules = [];

@Module({
  imports: [
    ...globalModule, //
    ...coreModules,
    // ...devModules,
    ...appModules,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
