import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AppError, SpaceConfig } from '@repo/shared';
import type { FastifyRequest } from 'fastify';
import '@fastify/cookie';

import type { SpaceGraphqlContext } from '../util/space-context.util';

/** Value passed into {@link import('./space-author.pipe').SpaceAuthorPipe}. */
export interface SpaceAuthorPipeInput {
  spaceId: string;
  authorKey: string | undefined;
}

/**
 * Extracts `spaceId` + author cookie for HTTP params or GraphQL args without
 * injecting `REQUEST` (keeps the host resolver/controller a singleton).
 *
 * @example
 * ```ts
 * @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow
 * ```
 */
export const AuthoredSpace = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SpaceAuthorPipeInput => {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gql = GqlExecutionContext.create(context);
      const args = gql.getArgs<{
        spaceId?: string;
        input?: { spaceId?: string };
      }>();
      const spaceId = args.spaceId ?? args.input?.spaceId;

      if (!spaceId) {
        throw AppError.badRequest('spaceId is required');
      }

      const ctx = gql.getContext<SpaceGraphqlContext>();

      return {
        spaceId,
        authorKey: ctx.req?.cookies?.[SpaceConfig.AUTHOR_COOKIE],
      };
    }

    const request = context
      .switchToHttp()
      .getRequest<FastifyRequest<{ Params: { spaceId?: string } }>>();
    const spaceId = request.params.spaceId;

    if (typeof spaceId !== 'string' || spaceId.length === 0) {
      throw AppError.badRequest('spaceId is required');
    }

    return {
      spaceId,
      authorKey: request.cookies?.[SpaceConfig.AUTHOR_COOKIE],
    };
  },
);
