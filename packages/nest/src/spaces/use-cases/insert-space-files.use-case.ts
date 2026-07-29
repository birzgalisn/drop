import { Injectable } from '@nestjs/common';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles } from '../../drizzle';

export interface InsertSpaceFileValues {
  originalName: string;
  mimeType: string;
  byteSize: number;
  sortOrder: number;
}

export interface InsertSpaceFilesInput {
  spaceId: string;
  files: InsertSpaceFileValues[];
}

export type SpaceFileRow = typeof spaceFiles.$inferSelect;

/** A space file row whose `storageKey` is known to be present. */
export type SpaceFileWithStorageKey = Omit<SpaceFileRow, 'storageKey'> & {
  storageKey: string;
};

@Injectable()
export class InsertSpaceFilesUseCase implements UseCase<InsertSpaceFilesInput, SpaceFileRow[]> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: InsertSpaceFilesInput, db?: DrizzleClient): Promise<SpaceFileRow[]> {
    const client = this.drizzle.client(db);
    return client
      .insert(spaceFiles)
      .values(
        input.files.map((file) => ({
          spaceId: input.spaceId,
          originalName: file.originalName,
          mimeType: file.mimeType,
          byteSize: file.byteSize,
          sortOrder: file.sortOrder,
        })),
      )
      .returning();
  }
}
