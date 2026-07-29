import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import type { UseCase } from '../../common';
import { DrizzleService } from '../../drizzle';

@Injectable()
export class CheckDatabaseReachableUseCase implements UseCase {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(): Promise<void> {
    try {
      await this.drizzle.ping();
    } catch {
      throw AppError.serviceUnavailable('Database unreachable');
    }
  }
}
