import { Injectable } from '@nestjs/common';
import { and, eq, inArray, ne } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';
import type { SpaceFileRow } from './insert-space-files.use-case';

export interface RemoveSpaceFilesInput {
  spaceId: string;
  fileIds: string[];
}

/** Soft-removes files (keeps rows for auditing but frees them from the caps). */
@Injectable()
export class RemoveSpaceFileUseCase implements UseCase<RemoveSpaceFilesInput, SpaceFileRow[]> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: RemoveSpaceFilesInput, db?: DrizzleClient): Promise<SpaceFileRow[]> {
    const fileIds = [...new Set(input.fileIds)];

    if (fileIds.length === 0) {
      return [];
    }

    const client = this.drizzle.client(db);

    return client
      .update(spaceFiles)
      .set({ status: SpaceFileStatus.REMOVED })
      .where(
        and(
          eq(spaceFiles.spaceId, input.spaceId),
          inArray(spaceFiles.id, fileIds),
          ne(spaceFiles.status, SpaceFileStatus.REMOVED),
        ),
      )
      .returning();
  }
}
