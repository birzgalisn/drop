import { Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';
import type { SpaceFileRow } from './insert-space-files.use-case';

export interface ClaimSpaceFileUploadInput {
  fileId: string;
  spaceId: string;
  storageKey: string;
}

/**
 * Atomically transitions a file to `ready` and records its permanent storage
 * key. The status guard means a concurrent second finish for the same upload
 * matches no row and returns `undefined`, so promotion is idempotent.
 */
@Injectable()
export class ClaimSpaceFileUploadUseCase implements UseCase<
  ClaimSpaceFileUploadInput,
  SpaceFileRow | undefined
> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(
    input: ClaimSpaceFileUploadInput,
    db?: DrizzleClient,
  ): Promise<SpaceFileRow | undefined> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .update(spaceFiles)
      .set({ status: SpaceFileStatus.READY, storageKey: input.storageKey })
      .where(
        and(
          eq(spaceFiles.id, input.fileId),
          eq(spaceFiles.spaceId, input.spaceId),
          inArray(spaceFiles.status, [
            SpaceFileStatus.PENDING,
            SpaceFileStatus.UPLOADING,
            SpaceFileStatus.PAUSED,
          ]),
        ),
      )
      .returning();

    return row;
  }
}
