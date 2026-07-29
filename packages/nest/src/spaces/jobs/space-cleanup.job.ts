import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { DrizzleService } from '../../drizzle';
import { MediaStorageService } from '../../media';
import { DeleteExpiredDraftsUseCase, DeleteExpiredSharesUseCase } from '../use-cases';

/**
 * Daily housekeeping at UTC midnight: drops abandoned drafts (≥24h, never shared)
 * and share-expired spaces, then removes their media directories.
 */
@Injectable()
export class SpaceCleanupJob {
  private readonly logger = new Logger(SpaceCleanupJob.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly deleteExpiredDrafts: DeleteExpiredDraftsUseCase,
    private readonly deleteExpiredShares: DeleteExpiredSharesUseCase,
    private readonly media: MediaStorageService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyCleanup(): Promise<void> {
    const [deletedDrafts, expiredSpaces] = await this.drizzle.db.transaction((tx) =>
      Promise.all([this.deleteExpiredDrafts.execute(tx), this.deleteExpiredShares.execute(tx)]),
    );

    const spaceIds = [...new Set([...deletedDrafts, ...expiredSpaces])];

    await Promise.all(
      spaceIds.map((spaceId) =>
        this.media.removeSpaceDir(spaceId).catch((error: unknown) => {
          this.logger.warn(
            `Failed to remove media for space ${spaceId}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }),
      ),
    );

    this.logger.log(
      `Cleanup: removed ${deletedDrafts.length} stale draft(s), ${expiredSpaces.length} expired space(s)`,
    );
  }
}
