import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import { DrizzleService, SpaceStatus } from '../../drizzle';
import type { Space } from '../models/space.model';
import { SpaceEventsService } from '../services/space-events.service';
import {
  FindShareBySpaceIdUseCase,
  FindSpaceByIdUseCase,
  ListSpaceFilesUseCase,
  ReorderSpaceFilesUseCase,
  type ReorderSpaceFileEntry,
} from '../use-cases';

export interface ReorderSpaceFilesWorkflowInput {
  spaceId: string;
  files: ReorderSpaceFileEntry[];
}

@Injectable()
export class ReorderSpaceFilesWorkflow {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly reorderFiles: ReorderSpaceFilesUseCase,
    private readonly listFiles: ListSpaceFilesUseCase,
    private readonly findShareBySpaceId: FindShareBySpaceIdUseCase,
    private readonly spaceEvents: SpaceEventsService,
  ) {}

  async execute(input: ReorderSpaceFilesWorkflowInput): Promise<Space> {
    const presented = await this.drizzle.db.transaction(async (tx) => {
      const space = await this.findSpaceById.execute(input.spaceId, tx);

      if (!space) {
        throw AppError.notFound('Space not found');
      }

      if (space.status !== SpaceStatus.DRAFT && space.status !== SpaceStatus.SHARED) {
        throw AppError.badRequest('Cannot modify a space that is no longer editable');
      }

      await this.reorderFiles.execute({ spaceId: input.spaceId, files: input.files }, tx);

      const [files, share] = await Promise.all([
        this.listFiles.execute({ spaceId: input.spaceId }, tx),
        this.findShareBySpaceId.execute(input.spaceId, tx),
      ]);

      return Object.assign(space, { files, share: share ?? null });
    });

    await this.spaceEvents.broadcastSpaceUpdated(presented);

    return presented;
  }
}
