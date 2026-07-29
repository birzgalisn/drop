import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import type { DrizzleClient } from '../../drizzle';
import { CreateSpaceUseCase, type SpaceRow } from '../use-cases';

export interface CreateSpaceWorkflowInput {
  ownerUserId?: string | null;
}

export interface CreateSpaceWorkflowResult {
  space: SpaceRow;
  /** Secret bound to the author's HttpOnly cookie by the caller (resolver). */
  authorKey: string;
}

@Injectable()
export class CreateSpaceWorkflow {
  constructor(private readonly createSpace: CreateSpaceUseCase) {}

  async execute(
    input?: CreateSpaceWorkflowInput,
    db?: DrizzleClient,
  ): Promise<CreateSpaceWorkflowResult> {
    const authorKey = randomBytes(32).toString('hex');
    const space = await this.createSpace.execute(
      { authorKey, ownerUserId: input?.ownerUserId },
      db,
    );

    return { space, authorKey };
  }
}
