import { Injectable, PipeTransform } from '@nestjs/common';
import { AppError } from '@repo/shared';

import { FindSpaceByIdUseCase, type SpaceRow } from '../use-cases';
import type { SpaceAuthorPipeInput } from './authored-space.decorator';

/**
 * Ensures the author cookie matches the given `spaceId` and returns the space
 * row. Singleton — pair with {@link AuthoredSpace} so cookies come from the
 * execution context (not `REQUEST` injection), keeping GraphQL resolvers static.
 */
@Injectable()
export class SpaceAuthorPipe implements PipeTransform<SpaceAuthorPipeInput, Promise<SpaceRow>> {
  constructor(private readonly findSpaceById: FindSpaceByIdUseCase) {}

  async transform(input: SpaceAuthorPipeInput): Promise<SpaceRow> {
    if (!input.authorKey) {
      throw AppError.unauthorized('Author cookie is required');
    }

    const space = await this.findSpaceById.execute(input.spaceId);

    if (!space || space.authorKey !== input.authorKey) {
      throw AppError.unauthorized('You are not the author of this space');
    }

    return space;
  }
}
