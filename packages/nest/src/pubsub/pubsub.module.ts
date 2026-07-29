import { Global, Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { redisConfig } from './redis.config';
import { RedisService } from './services/redis.service';
import { GRAPHQL_PUBSUB } from './tokens/pubsub.tokens';
import { RedisJson } from './util/redis-json.util';

const redisEnvFromConfig = redisConfig.asProvider();

/**
 * Global Redis-backed GraphQL PubSub. Kept transport-agnostic: domains publish
 * and subscribe through {@link GRAPHQL_PUBSUB} without knowing it is Redis.
 *
 * Also exports {@link RedisService} for direct Redis ops (e.g. health pings).
 */
@Global()
@Module({
  imports: [...redisEnvFromConfig.imports],
  providers: [
    {
      provide: GRAPHQL_PUBSUB,
      inject: [redisConfig.KEY],
      useFactory: (redis: ConfigType<typeof redisConfig>) =>
        new RedisPubSub({
          connection: redis.url,
          reviver: RedisJson.reviver,
        }),
    },
    RedisService,
  ],
  exports: [GRAPHQL_PUBSUB, RedisService],
})
export class PubSubModule {}
