import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import type { Space } from '../models/space.model';
import {
  FindShareByTokenUseCase,
  FindSpaceByIdUseCase,
  ListReadySpaceFilesUseCase,
} from '../use-cases';

export interface GetSharedSpaceWorkflowInput {
  token: string;
  /** Share-session cookie; must equal `token` (set by unlock). */
  shareSession?: string;
}

/**
 * Recipient view after PIN unlock: validates the session cookie, then returns
 * the space with READY files only.
 */
@Injectable()
export class GetSharedSpaceWorkflow {
  constructor(
    private readonly findShareByToken: FindShareByTokenUseCase,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly listReadySpaceFiles: ListReadySpaceFilesUseCase,
  ) {}

  async execute(input: GetSharedSpaceWorkflowInput): Promise<Space> {
    if (input.shareSession !== input.token) {
      throw AppError.unauthorized('This share is locked. Unlock it with the PIN first.');
    }

    const share = await this.findShareByToken.execute(input.token);

    if (!share || share.expiresAt.getTime() <= Date.now()) {
      throw AppError.unauthorized('This share link is invalid or has expired');
    }

    const space = await this.findSpaceById.execute(share.spaceId);

    if (!space) {
      throw AppError.notFound('Space not found');
    }

    const files = await this.listReadySpaceFiles.execute({ spaceId: share.spaceId });

    return Object.assign(space, { files });
  }
}
