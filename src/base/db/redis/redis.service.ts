import { Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import * as cacheManager from 'cache-manager';

import { config } from '@/config';
import { LoggingService } from '@/base/logging';

@Injectable()
export class RedisService {
  constructor(private readonly logging: LoggingService) {}

  private logger = this.logging.getLogger('redis');
  private createClient(
    db: string, //
    ttl: number = config.CACHE_TIMEOUT,
  ) {
    const redisCache = cacheManager.caching({
      store: redisStore,
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      db,
      ttl: ttl / 1000, // sec
    });
    const redisClient = redisCache.store.getClient();
    redisClient.on('error', error => {
      this.logger.error(error);
    });
    return redisCache;
  }

  globalCache = this.createClient(config.REDIS_STORAGE.GLOBAL);
}
