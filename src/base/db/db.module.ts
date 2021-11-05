import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { LoggingService } from '@/base/logging';
import { config } from '@/config';

import { typeOrmOptionsGenerate } from './ormconfig';

const typeOrmOptions: TypeOrmModuleAsyncOptions[] = [
  {
    inject: [LoggingService],
    useFactory: (loggingService: LoggingService) =>
      ({
        ...typeOrmOptionsGenerate(config),
        synchronize: config.NODE_ENV !== config.PROD,
        cache: {
          type: 'redis',
          duration: config.CACHE_DB_TIMEOUT,
          options: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            Db: config.REDIS_STORAGE.DB,
          },
        },
        logging: true,
        logger: config.NODE_ENV === config.JEST ? 'debug' : loggingService.getDbLogger('main_db'),
      } as TypeOrmModuleOptions),
  },
];

@Module({
  imports: [
    ...typeOrmOptions.map(options => TypeOrmModule.forRootAsync(options)), //
  ],
})
export class DatabaseModule {}
