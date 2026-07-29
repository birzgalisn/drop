import { Controller, Get } from '@nestjs/common';

import { UpStatus } from './enums/up-status.enum';
import { RunUpChecksUseCase } from './use-cases/run-up-checks.use-case';

@Controller()
export class HealthController {
  constructor(private readonly runUpChecks: RunUpChecksUseCase) {}

  @Get('up')
  up(): Promise<UpStatus> {
    return this.runUpChecks.execute();
  }
}
