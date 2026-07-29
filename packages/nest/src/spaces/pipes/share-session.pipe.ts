import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SpaceConfig } from '@repo/shared';
import type { FastifyRequest } from 'fastify';
import '@fastify/cookie';

import { FindShareByTokenUseCase, type ShareRow } from '../use-cases';

/**
 * Ensures the share session cookie matches `:token`, the share exists and is
 * unexpired, then returns the row.
 */
@Injectable({ scope: Scope.REQUEST })
export class ShareSessionPipe implements PipeTransform<string, Promise<ShareRow>> {
  constructor(
    private readonly findShare: FindShareByTokenUseCase,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) {}

  async transform(token: string): Promise<ShareRow> {
    const session = this.request.cookies?.[SpaceConfig.SHARE_SESSION_COOKIE];

    if (!session || session !== token) {
      throw new UnauthorizedException('Share is locked');
    }

    const share = await this.findShare.execute(token);

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    if (share.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('This share link has expired');
    }

    return share;
  }
}
