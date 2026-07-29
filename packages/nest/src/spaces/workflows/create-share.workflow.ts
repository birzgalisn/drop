import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { AppError, SpaceConfig } from '@repo/shared';

import { DrizzleService, SpaceFileStatus, SpaceStatus } from '../../drizzle';
import { SpaceEventsService } from '../services/space-events.service';
import { SpaceThumbnailsService } from '../services/space-thumbnails.service';
import {
  FindSpaceByIdUseCase,
  InsertShareUseCase,
  ListSpaceFilesUseCase,
  MarkSpaceSharedUseCase,
  type ShareRow,
  type SpaceFileRow,
} from '../use-cases';
import { PinHasher } from '../util/pin-hasher.util';
import { SpaceFileStorage } from '../util/space-file-storage.util';

export interface CreateShareWorkflowInput {
  spaceId: string;
  expiryDays: number;
  pin: string;
}

@Injectable()
export class CreateShareWorkflow {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly listFiles: ListSpaceFilesUseCase,
    private readonly insertShare: InsertShareUseCase,
    private readonly markShared: MarkSpaceSharedUseCase,
    private readonly spaceEvents: SpaceEventsService,
    private readonly thumbnails: SpaceThumbnailsService,
  ) {}

  async execute(input: CreateShareWorkflowInput): Promise<ShareRow> {
    // Hash before opening a DB connection — scrypt is slow.
    const pinHash = await PinHasher.hash(input.pin);
    const token = randomBytes(24).toString('base64url');
    const expiresAt = SpaceConfig.shareExpiresAt({ expiryDays: input.expiryDays });

    const { share, updatedSpace, files } = await this.drizzle.db.transaction(async (tx) => {
      const space = await this.findSpaceById.execute(input.spaceId, tx);

      if (!space) {
        throw AppError.notFound('Space not found');
      }

      if (space.status === SpaceStatus.SHARED) {
        throw AppError.conflict('This space has already been shared');
      }

      if (space.status === SpaceStatus.EXPIRED) {
        throw AppError.badRequest('This space has expired');
      }

      const spaceFiles = await this.listFiles.execute({ spaceId: space.id }, tx);

      if (spaceFiles.length === 0) {
        throw AppError.badRequest('Add at least one file before sharing');
      }

      if (spaceFiles.some((file) => file.status !== SpaceFileStatus.READY)) {
        throw AppError.badRequest('All files must finish uploading before sharing');
      }

      const createdShare = await this.insertShare.execute(
        {
          spaceId: space.id,
          token,
          pinHash,
          expiresAt,
        },
        tx,
      );

      const sharedSpace = await this.markShared.execute(space.id, tx);

      if (!sharedSpace) {
        throw AppError.conflict('Failed to mark space as shared');
      }

      return { share: createdShare, updatedSpace: sharedSpace, files: spaceFiles };
    });

    await this.enqueueMissingThumbnails(files);
    await this.spaceEvents.broadcastSpaceUpdated(Object.assign(updatedSpace, { files, share }));

    return share;
  }

  /** Catch-up for files that never got thumb keys persisted. */
  private async enqueueMissingThumbnails(files: SpaceFileRow[]): Promise<void> {
    await Promise.all(
      files
        .filter(SpaceFileStorage.hasKey)
        .filter((file) => !file.thumbKey)
        .map((file) =>
          this.thumbnails.enqueue({
            spaceId: file.spaceId,
            fileId: file.id,
            storageKey: file.storageKey,
          }),
        ),
    );
  }
}
