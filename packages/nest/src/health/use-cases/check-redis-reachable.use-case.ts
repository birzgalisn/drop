import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import type { UseCase } from '../../common';
import { RedisService } from '../../pubsub';

@Injectable()
export class CheckRedisReachableUseCase implements UseCase {
  constructor(private readonly redis: RedisService) {}

  async execute(): Promise<void> {
    try {
      await this.redis.ping();
    } catch {
      throw AppError.serviceUnavailable('Redis unreachable');
    }
  }
}
