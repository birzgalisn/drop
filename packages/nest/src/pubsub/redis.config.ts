import { registerAs } from '@nestjs/config';

import { redisEnvSchema, type RedisEnvConfig } from './interfaces/redis-env.interface';

export const redisConfig = registerAs<RedisEnvConfig>('redis', () => {
  const env = redisEnvSchema.parse(process.env);

  return {
    url: env.REDIS_URL,
    bullmq: {
      url: env.REDIS_URL,
      maxRetriesPerRequest: null,
    },
  };
});
