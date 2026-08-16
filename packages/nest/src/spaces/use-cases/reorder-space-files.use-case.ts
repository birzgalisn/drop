import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';
import { and, eq, inArray, ne } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, SpaceFileStatus, spaceFiles } from '../../drizzle';

export interface ReorderSpaceFileEntry {
  fileId: string;
  sortOrder: number;
}

export interface ReorderSpaceFilesInput {
  spaceId: string;
  files: ReorderSpaceFileEntry[];
}

@Injectable()
export class ReorderSpaceFilesUseCase implements UseCase<ReorderSpaceFilesInput, void> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: ReorderSpaceFilesInput, db?: DrizzleClient): Promise<void> {
    if (input.files.length === 0) {
      return;
    }

    const ids = input.files.map((file) => file.fileId);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== ids.length) {
      throw AppError.badRequest('Duplicate file ids in reorder payload');
    }

    const client = this.drizzle.client(db);

    const owned = await client
      .select({ id: spaceFiles.id })
      .from(spaceFiles)
      .where(
        and(
          eq(spaceFiles.spaceId, input.spaceId),
          inArray(spaceFiles.id, ids),
          ne(spaceFiles.status, SpaceFileStatus.REMOVED),
        ),
      );

    if (owned.length !== ids.length) {
      throw AppError.badRequest('Reorder must include only active files from this space');
    }

    for (const file of input.files) {
      await client
        .update(spaceFiles)
        .set({ sortOrder: file.sortOrder })
        .where(and(eq(spaceFiles.id, file.fileId), eq(spaceFiles.spaceId, input.spaceId)));
    }
  }
}
