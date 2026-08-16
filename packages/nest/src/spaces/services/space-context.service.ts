import '@fastify/cookie';
import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { Duration, readCookie, SpaceConfig } from '@repo/shared';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { appConfig, NodeEnv } from '../../config';

/**
 * Shape of the GraphQL execution context we build in `graphql.module.ts`. The
 * Fastify `reply` is absent for subscription operations (graphql-ws), so cookie
 * writes are always guarded.
 */
export interface SpaceGraphqlContext {
  req?: FastifyRequest;
  reply?: FastifyReply;
}

/** GraphQL ctx or a Fastify reply. Writes no-op when `reply` is missing. */
type CookieWriteTarget = SpaceGraphqlContext | FastifyReply | undefined;

/**
 * Cookie helpers for author identity and share-session unlock.
 *
 * Reads accept GraphQL ctx, Fastify request, Fetch {@link Request} (`@tus/server`
 * v2), or Node `IncomingMessage`. Writes need a Fastify reply.
 */
@Injectable()
export class SpaceContext {
  /** Author cookie should outlive typical share windows. */
  private static readonly AUTHOR_COOKIE_MAX_AGE_SECONDS = Duration.YEAR;
  /** Unlock session for a share link. */
  private static readonly SHARE_SESSION_MAX_AGE_SECONDS = Duration.DAY;

  constructor(@Inject(appConfig.KEY) private readonly app: ConfigType<typeof appConfig>) {}

  readAuthorKey(source: unknown): string | undefined {
    return readCookie({ source, name: SpaceConfig.AUTHOR_COOKIE });
  }

  readShareSession(source: unknown): string | undefined {
    return readCookie({ source, name: SpaceConfig.SHARE_SESSION_COOKIE });
  }

  setAuthorCookie(target: CookieWriteTarget, authorKey: string): void {
    this.writeHttpOnlyCookie({
      target,
      name: SpaceConfig.AUTHOR_COOKIE,
      value: authorKey,
      maxAge: SpaceContext.AUTHOR_COOKIE_MAX_AGE_SECONDS,
    });
  }

  setShareSessionCookie(target: CookieWriteTarget, token: string): void {
    this.writeHttpOnlyCookie({
      target,
      name: SpaceConfig.SHARE_SESSION_COOKIE,
      value: token,
      maxAge: SpaceContext.SHARE_SESSION_MAX_AGE_SECONDS,
    });
  }

  private writeHttpOnlyCookie({
    target,
    name,
    value,
    maxAge,
  }: {
    target: CookieWriteTarget;
    name: string;
    value: string;
    maxAge: number;
  }): void {
    this.replyOf(target)?.setCookie(name, value, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: this.app.nodeEnv === NodeEnv.PRODUCTION,
      maxAge,
    });
  }

  private replyOf(target: CookieWriteTarget): FastifyReply | undefined {
    if (!target) {
      return undefined;
    }

    if ('setCookie' in target) {
      return target;
    }

    return target.reply;
  }
}
