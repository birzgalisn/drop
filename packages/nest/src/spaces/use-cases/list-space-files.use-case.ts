import { Injectable } from '@nestjs/common';
import { and, asc, eq, ne } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles, SpaceFileStatus } from '../../drizzle';
import type { SpaceFileRow } from './insert-space-files.use-case';

export interface ListSpaceFilesInput {
  spaceId: string;
  /** When true, removed files are included (defaults to false). */
  includeRemoved?: boolean;
}

@Injectable()
export class ListSpaceFilesUseCase implements UseCase<ListSpaceFilesInput, SpaceFileRow[]> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: ListSpaceFilesInput, db?: DrizzleClient): Promise<SpaceFileRow[]> {
    const client = this.drizzle.client(db);
    const spaceMatch = eq(spaceFiles.spaceId, input.spaceId);
    const where = input.includeRemoved
      ? spaceMatch
      : and(spaceMatch, ne(spaceFiles.status, SpaceFileStatus.REMOVED));

    return client
      .select()
      .from(spaceFiles)
      .where(where)
      .orderBy(asc(spaceFiles.sortOrder), asc(spaceFiles.createdAt));
  }
}
