import { Injectable } from '@nestjs/common';
import { inArray, lte } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, shares, spaces } from '../../drizzle';

/**
 * Deletes spaces whose share is past expiry (files/share cascade). Returns the
 * deleted space ids so the caller can `rm -rf` media dirs.
 */
@Injectable()
export class DeleteExpiredSharesUseCase implements UseCase<void, string[]> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(db?: DrizzleClient): Promise<string[]> {
    const client = this.drizzle.client(db);
    const now = new Date();

    const deleted = await client
      .delete(spaces)
      .where(
        inArray(
          spaces.id,
          client.select({ id: shares.spaceId }).from(shares).where(lte(shares.expiresAt, now)),
        ),
      )
      .returning({ id: spaces.id });

    return deleted.map((row) => row.id);
  }
}
