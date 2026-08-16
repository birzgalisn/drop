import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import { SpaceStatus } from '../../drizzle';
import type { Space } from '../models/space.model';
import { FindSpaceByIdUseCase, LoadAuthoredSpaceUseCase } from '../use-cases';

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
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly loadAuthoredSpace: LoadAuthoredSpaceUseCase,
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

    return this.loadAuthoredSpace.execute({ space });
  }
}
