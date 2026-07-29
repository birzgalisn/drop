import { Injectable } from '@nestjs/common';
import { and, count, eq, ne } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';

/** Counts non-removed files in a space (the value that counts against the file-count cap). */
@Injectable()
export class CountActiveSpaceFilesUseCase implements UseCase<string, number> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(spaceId: string, db?: DrizzleClient): Promise<number> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .select({ value: count() })
      .from(spaceFiles)
      .where(and(eq(spaceFiles.spaceId, spaceId), ne(spaceFiles.status, SpaceFileStatus.REMOVED)));

    return Number(row?.value ?? 0);
  }
}
