import { Injectable } from '@nestjs/common';
import { and, eq, ne, sql } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';

/** Sums the bytes of all non-removed files in a space (the value that counts against the space cap). */
@Injectable()
export class SumSpaceFileBytesUseCase implements UseCase<string, number> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(spaceId: string, db?: DrizzleClient): Promise<number> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .select({ total: sql<string>`coalesce(sum(${spaceFiles.byteSize}), 0)` })
      .from(spaceFiles)
      .where(and(eq(spaceFiles.spaceId, spaceId), ne(spaceFiles.status, SpaceFileStatus.REMOVED)));

    return Number(row?.total ?? 0);
  }
}
