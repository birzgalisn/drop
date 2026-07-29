import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles } from '../../drizzle';
import type { SpaceFileRow } from './insert-space-files.use-case';

export interface MarkSpaceFileThumbnailsReadyInput {
  fileId: string;
  thumbKey: string;
  previewKey: string;
}

@Injectable()
export class MarkSpaceFileThumbnailsReadyUseCase implements UseCase<
  MarkSpaceFileThumbnailsReadyInput,
  SpaceFileRow | undefined
> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(
    input: MarkSpaceFileThumbnailsReadyInput,
    db?: DrizzleClient,
  ): Promise<SpaceFileRow | undefined> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .update(spaceFiles)
      .set({
        thumbKey: input.thumbKey,
        previewKey: input.previewKey,
      })
      .where(eq(spaceFiles.id, input.fileId))
      .returning();

    return row;
  }
}
