import { Injectable, Logger } from '@nestjs/common';
import { AppError } from '@repo/shared';

import { DrizzleService, SpaceStatus } from '../../drizzle';
import { MediaStorageService } from '../../media';
import type { Space } from '../models/space.model';
import { SpaceEventsService } from '../services/space-events.service';
import {
  FindSpaceByIdUseCase,
  LoadAuthoredSpaceUseCase,
  RemoveSpaceFileUseCase,
} from '../use-cases';

export interface RemoveSpaceFileWorkflowInput {
  spaceId: string;
  fileIds: string[];
}

@Injectable()
export class RemoveSpaceFileWorkflow {
  private readonly logger = new Logger(RemoveSpaceFileWorkflow.name);

  constructor(
    private readonly drizzle: DrizzleService,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly removeFiles: RemoveSpaceFileUseCase,
    private readonly loadAuthoredSpace: LoadAuthoredSpaceUseCase,
    private readonly spaceEvents: SpaceEventsService,
    private readonly media: MediaStorageService,
  ) {}

  async execute(input: RemoveSpaceFileWorkflowInput): Promise<Space> {
    const fileIds = [...new Set(input.fileIds)];

    if (fileIds.length === 0) {
      throw AppError.badRequest('At least one file id is required');
    }

    const { presented, removed } = await this.drizzle.db.transaction(async (tx) => {
      const space = await this.findSpaceById.execute(input.spaceId, tx);

      if (!space) {
        throw AppError.notFound('Space not found');
      }

      if (space.status !== SpaceStatus.DRAFT && space.status !== SpaceStatus.SHARED) {
        throw AppError.badRequest('Cannot modify a space that is no longer editable');
      }

      const removedFiles = await this.removeFiles.execute({ spaceId: input.spaceId, fileIds }, tx);

      if (removedFiles.length === 0) {
        throw AppError.notFound('File(s) not found');
      }

      return {
        presented: await this.loadAuthoredSpace.execute({ space }, tx),
        removed: removedFiles,
      };
    });

    await Promise.all(
      removed.map((file) =>
        this.media
          .removeSpaceFileMedia({
            spaceId: file.spaceId,
            fileId: file.id,
            storageKey: file.storageKey,
          })
          .catch((error: unknown) => {
            this.logger.warn(
              `Failed to remove media for file ${file.id}: ${
                error instanceof Error ? error.message : String(error)
              }`,
            );
          }),
      ),
    );

    await this.spaceEvents.broadcastSpaceUpdated(presented);

    return presented;
  }
}
