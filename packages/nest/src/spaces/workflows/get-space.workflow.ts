import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import { DrizzleService, SpaceStatus } from '../../drizzle';
import type { Space } from '../models/space.model';
import {
  FindShareBySpaceIdUseCase,
  FindSpaceByIdUseCase,
  ListSpaceFilesUseCase,
} from '../use-cases';

export interface GetSpaceWorkflowInput {
  spaceId: string;
  /** Author cookie value; compared to `space.authorKey` for draft access and file visibility. */
  authorKey?: string;
}

/**
 * Loads a space for the GraphQL `space` query: drafts are author-only; authors
 * also get files + share metadata.
 */
@Injectable()
export class GetSpaceWorkflow {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly listSpaceFiles: ListSpaceFilesUseCase,
    private readonly findShareBySpaceId: FindShareBySpaceIdUseCase,
  ) {}

  async execute(input: GetSpaceWorkflowInput): Promise<Space | null> {
    const space = await this.findSpaceById.execute(input.spaceId);

    if (!space) {
      return null;
    }

    const isAuthor = Boolean(input.authorKey) && input.authorKey === space.authorKey;

    if (space.status === SpaceStatus.DRAFT && !isAuthor) {
      throw AppError.unauthorized('You are not the author of this draft space');
    }

    if (!isAuthor) {
      return space;
    }

    const [files, share] = await this.drizzle.db.transaction(async (tx) =>
      Promise.all([
        this.listSpaceFiles.execute({ spaceId: space.id }, tx),
        this.findShareBySpaceId.execute(space.id, tx),
      ]),
    );

    return Object.assign(space, { files, share: share ?? null });
  }
}
