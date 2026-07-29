import type { ConnectionOptions } from 'bullmq';
import { z } from 'zod';

export const redisEnvSchema = z.object({
  REDIS_URL: z.string().min(1, 'REDIS_URL environment variable is required'),
});

export type RedisEnv = z.infer<typeof redisEnvSchema>;

export interface RedisEnvConfig {
  /** Redis connection URL shared by GraphQL pub/sub, BullMQ, and health checks. */
  url: string;
  /**
   * BullMQ connection options. Passes the URL through so ioredis parses it;
   * `maxRetriesPerRequest: null` is required for BullMQ's blocking workers.
   */
  bullmq: ConnectionOptions;
}

export type RedisEnvNamespace = { redis: RedisEnvConfig };
