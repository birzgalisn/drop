import { Injectable } from '@nestjs/common';
import { and, eq, max, ne } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';

/** Highest sortOrder among active files, or -1 when the space has none. */
@Injectable()
export class MaxSpaceFileSortOrderUseCase implements UseCase<string, number> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(spaceId: string, db?: DrizzleClient): Promise<number> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .select({ value: max(spaceFiles.sortOrder) })
      .from(spaceFiles)
      .where(and(eq(spaceFiles.spaceId, spaceId), ne(spaceFiles.status, SpaceFileStatus.REMOVED)));

    return row?.value ?? -1;
  }
}
