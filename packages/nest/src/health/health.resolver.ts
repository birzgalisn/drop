import { Query, Resolver } from '@nestjs/graphql';

import { UpStatus } from './enums/up-status.enum';
import { RunUpChecksUseCase } from './use-cases/run-up-checks.use-case';

@Resolver()
export class HealthResolver {
  constructor(private readonly runUpChecks: RunUpChecksUseCase) {}

  @Query(() => UpStatus)
  up(): Promise<UpStatus> {
    return this.runUpChecks.execute();
  }
}
