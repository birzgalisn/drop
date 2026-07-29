import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';
import { HealthResolver } from './health.resolver';
import { CheckDatabaseReachableUseCase } from './use-cases/check-database-reachable.use-case';
import { CheckRedisReachableUseCase } from './use-cases/check-redis-reachable.use-case';
import { RunUpChecksUseCase } from './use-cases/run-up-checks.use-case';

@Module({
  controllers: [HealthController],
  providers: [
    HealthResolver,
    RunUpChecksUseCase,
    CheckDatabaseReachableUseCase,
    CheckRedisReachableUseCase,
  ],
})
export class HealthModule {}
