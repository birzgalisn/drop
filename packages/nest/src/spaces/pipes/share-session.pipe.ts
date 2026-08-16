import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AppError } from '@repo/shared';
import type { FastifyRequest } from 'fastify';

import { SpaceContext } from '../services/space-context.service';
import { FindShareByTokenUseCase, type ShareRow } from '../use-cases';

/**
 * Ensures the share session cookie matches `:token`, the share exists and is
 * unexpired, then returns the row.
 */
@Injectable({ scope: Scope.REQUEST })
export class ShareSessionPipe implements PipeTransform<string, Promise<ShareRow>> {
  constructor(
    private readonly findShare: FindShareByTokenUseCase,
    private readonly spaceContext: SpaceContext,
    @Inject(REQUEST) private readonly request: FastifyRequest,
  ) {}

  async transform(token: string): Promise<ShareRow> {
    const session = this.spaceContext.readShareSession(this.request);

    if (!session || session !== token) {
      throw AppError.unauthorized('Share is locked');
    }

    const share = await this.findShare.execute(token);

    if (!share) {
      throw AppError.notFound('Share not found');
    }

    if (share.expiresAt.getTime() <= Date.now()) {
      throw AppError.unauthorized('This share link has expired');
    }

    return share;
  }
}
