import { Injectable, Logger } from '@nestjs/common';
import { AppError, SpaceFilePath } from '@repo/shared';

import { SpaceFileStatus } from '../../drizzle';
import { MediaStorageService } from '../../media';
import { SpaceEventsService } from '../services/space-events.service';
import { SpaceThumbnailsService } from '../services/space-thumbnails.service';
import {
  ClaimSpaceFileUploadUseCase,
  FindSpaceFileByIdUseCase,
  LoadAuthoredSpaceUseCase,
} from '../use-cases';

export interface CompleteSpaceFileUploadWorkflowInput {
  fileId: string;
  spaceId: string;
  /** The finished tus upload id whose bytes live under the tus root. */
  uploadId: string;
}

/**
 * Runs on tus `onUploadFinish`: promotes the finished upload into permanent
 * media storage and flips the file to `ready`, enqueues thumb/preview thumbnails for
 * the landing grid / reorder UI, then broadcasts the change.
 */
@Injectable()
export class CompleteSpaceFileUploadWorkflow {
  private readonly logger = new Logger(CompleteSpaceFileUploadWorkflow.name);

  constructor(
    private readonly findFile: FindSpaceFileByIdUseCase,
    private readonly claimUpload: ClaimSpaceFileUploadUseCase,
    private readonly loadAuthoredSpace: LoadAuthoredSpaceUseCase,
    private readonly media: MediaStorageService,
    private readonly spaceEvents: SpaceEventsService,
    private readonly thumbnails: SpaceThumbnailsService,
  ) {}

  async execute(input: CompleteSpaceFileUploadWorkflowInput): Promise<void> {
    const file = await this.findFile.execute({ fileId: input.fileId });

    if (!file) {
      throw AppError.notFound('Space file not found');
    }

    if (file.spaceId !== input.spaceId) {
      throw AppError.badRequest('File does not belong to this space');
    }

    if (file.status === SpaceFileStatus.READY) {
      return;
    }

    const storageKey = SpaceFilePath.storageKey({
      spaceId: file.spaceId,
      fileId: file.id,
      mimeType: file.mimeType,
    });

    // Promote bytes outside the DB transaction — filesystem I/O must not hold a connection.
    await this.media.promote({ uploadId: input.uploadId, storageKey });

    const claimed = await this.claimUpload.execute({
      fileId: file.id,
      spaceId: input.spaceId,
      storageKey,
    });

    if (!claimed) {
      this.logger.warn(`File ${file.id} finished but could not be claimed (already ready?)`);
    }

    if (claimed?.storageKey) {
      await this.thumbnails.enqueue({
        spaceId: claimed.spaceId,
        fileId: claimed.id,
        storageKey: claimed.storageKey,
      });
    }

    await this.broadcast(input.spaceId);
  }

  private async broadcast(spaceId: string): Promise<void> {
    const presented = await this.loadAuthoredSpace.forSpaceId(spaceId);

    if (!presented) {
      return;
    }

    await this.spaceEvents.broadcastSpaceUpdated(presented);
  }
}
