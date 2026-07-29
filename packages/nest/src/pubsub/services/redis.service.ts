import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';

import { redisConfig } from '../redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  readonly client: Redis;

  constructor(@Inject(redisConfig.KEY) config: ConfigType<typeof redisConfig>) {
    this.client = new Redis(config.url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.client.on('error', (err) => {
      this.logger.error(err);
    });
  }

  async ping(): Promise<void> {
    await this.client.ping();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
