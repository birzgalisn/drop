import { Injectable } from '@nestjs/common';
import { and, asc, eq, inArray, isNotNull } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';
import { SpaceFileStorage } from '../util/space-file-storage.util';
import type { SpaceFileWithStorageKey } from './insert-space-files.use-case';

export interface ListReadySpaceFilesInput {
  spaceId: string;
  /** When non-empty, only these file ids are returned. */
  fileIds?: string[];
}

@Injectable()
export class ListReadySpaceFilesUseCase implements UseCase<
  ListReadySpaceFilesInput,
  SpaceFileWithStorageKey[]
> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(
    input: ListReadySpaceFilesInput,
    db?: DrizzleClient,
  ): Promise<SpaceFileWithStorageKey[]> {
    const client = this.drizzle.client(db);
    const conditions = [
      eq(spaceFiles.spaceId, input.spaceId),
      eq(spaceFiles.status, SpaceFileStatus.READY),
      isNotNull(spaceFiles.storageKey),
    ];

    if (input.fileIds && input.fileIds.length > 0) {
      conditions.push(inArray(spaceFiles.id, input.fileIds));
    }

    const rows = await client
      .select()
      .from(spaceFiles)
      .where(and(...conditions))
      .orderBy(asc(spaceFiles.sortOrder), asc(spaceFiles.createdAt));

    return rows.filter(SpaceFileStorage.hasKey);
  }
}
