import '@fastify/cookie';
import { Duration, SpaceConfig } from '@repo/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Shape of the GraphQL execution context we build in `graphql.module.ts`. The
 * Fastify `reply` is absent for subscription operations (graphql-ws), so cookie
 * writes are always guarded.
 */
export interface SpaceGraphqlContext {
  req?: FastifyRequest;
  reply?: FastifyReply;
}

/** Cookie helpers for author identity and share-session unlock on GraphQL context. */
export class SpaceContext {
  /** Author cookie should outlive typical share windows. */
  private static readonly AUTHOR_COOKIE_MAX_AGE_SECONDS = Duration.YEAR;
  /** Unlock session for a share link. */
  private static readonly SHARE_SESSION_MAX_AGE_SECONDS = Duration.DAY;

  static readAuthorKey(ctx: SpaceGraphqlContext | undefined): string | undefined {
    return SpaceContext.readCookie(ctx, SpaceConfig.AUTHOR_COOKIE);
  }

  static readShareSession(ctx: SpaceGraphqlContext | undefined): string | undefined {
    return SpaceContext.readCookie(ctx, SpaceConfig.SHARE_SESSION_COOKIE);
  }

  static setAuthorCookie(ctx: SpaceGraphqlContext | undefined, authorKey: string): void {
    ctx?.reply?.setCookie(SpaceConfig.AUTHOR_COOKIE, authorKey, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: SpaceContext.AUTHOR_COOKIE_MAX_AGE_SECONDS,
    });
  }

  static setShareSessionCookie(ctx: SpaceGraphqlContext | undefined, token: string): void {
    ctx?.reply?.setCookie(SpaceConfig.SHARE_SESSION_COOKIE, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: SpaceContext.SHARE_SESSION_MAX_AGE_SECONDS,
    });
  }

  private static readCookie(
    ctx: SpaceGraphqlContext | undefined,
    name: string,
  ): string | undefined {
    return ctx?.req?.cookies?.[name];
  }
}
