import { Injectable } from '@nestjs/common';
import { SpaceConfig } from '@repo/shared';
import { and, eq, lt, notInArray } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, shares, spaces, SpaceStatus } from '../../drizzle';

/**
 * Deletes draft spaces older than {@link SpaceConfig.DRAFT_TTL_MS} that never got a
 * share. Files cascade with the space. Returns the deleted space ids so the
 * caller can best-effort clean their media off disk.
 */
@Injectable()
export class DeleteExpiredDraftsUseCase implements UseCase<void, string[]> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(db?: DrizzleClient): Promise<string[]> {
    const client = this.drizzle.client(db);
    const cutoff = new Date(Date.now() - SpaceConfig.DRAFT_TTL_MS);

    const deleted = await client
      .delete(spaces)
      .where(
        and(
          eq(spaces.status, SpaceStatus.DRAFT),
          lt(spaces.createdAt, cutoff),
          notInArray(spaces.id, client.select({ id: shares.spaceId }).from(shares)),
        ),
      )
      .returning({ id: spaces.id });

    return deleted.map((row) => row.id);
  }
}
