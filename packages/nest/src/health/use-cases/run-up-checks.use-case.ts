import { Injectable } from '@nestjs/common';

import type { UseCase } from '../../common';
import { UpStatus } from '../enums/up-status.enum';
import { CheckDatabaseReachableUseCase } from './check-database-reachable.use-case';
import { CheckRedisReachableUseCase } from './check-redis-reachable.use-case';

@Injectable()
export class RunUpChecksUseCase implements UseCase<void, UpStatus> {
  constructor(
    private readonly database: CheckDatabaseReachableUseCase,
    private readonly redis: CheckRedisReachableUseCase,
  ) {}

  async execute(): Promise<UpStatus> {
    await Promise.all([this.database.execute(), this.redis.execute()]);
    return UpStatus.OK;
  }
}
