import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import {
  SpaceConfig,
  SpaceFilePath,
  SpaceFileThumbnailSize,
  SpaceFileThumbnailSizes,
} from '@repo/shared';
import type { Job } from 'bullmq';
import sharp from 'sharp';

import { mediaConfig } from '../../media';
import { SpaceThumbnails } from '../constants/space-thumbnails.constants';
import type { GenerateThumbnailsJobData } from '../interfaces/generate-thumbnails-job-data.interface';
import { SpaceEventsService } from '../services/space-events.service';
import { LoadAuthoredSpaceUseCase, MarkSpaceFileThumbnailsReadyUseCase } from '../use-cases';

/**
 * Generates thumb (grid) + preview (viewer) WebP derivatives, persists their
 * storage keys on the file row, then broadcasts so open clients swap
 * blob/original previews for optimized thumbs. Failures bubble to BullMQ for
 * retry/backoff.
 */
@Processor(SpaceThumbnails.QUEUE, {
  concurrency: SpaceThumbnails.WORKER_CONCURRENCY,
})
export class GenerateThumbnailsProcessor extends WorkerHost {
  constructor(
    @Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>,
    private readonly markReady: MarkSpaceFileThumbnailsReadyUseCase,
    private readonly loadAuthoredSpace: LoadAuthoredSpaceUseCase,
    private readonly spaceEvents: SpaceEventsService,
  ) {
    super();
  }

  async process(job: Job<GenerateThumbnailsJobData>): Promise<void> {
    const { fileId, spaceId, storageKey } = job.data;
    const source = path.join(this.media.root, storageKey);

    const thumbKey = SpaceFilePath.thumbnailKey({
      spaceId,
      fileId,
      size: SpaceFileThumbnailSize.Thumb,
    });
    const previewKey = SpaceFilePath.thumbnailKey({
      spaceId,
      fileId,
      size: SpaceFileThumbnailSize.Preview,
    });

    await Promise.all(
      SpaceFileThumbnailSizes.ALL.map((size) =>
        this.writeThumbnail({
          source,
          key: SpaceFilePath.thumbnailKey({ spaceId, fileId, size }),
          width: SpaceConfig.THUMBNAIL_WIDTHS[size],
          quality: SpaceConfig.THUMBNAIL_WEBP_QUALITY[size],
        }),
      ),
    );

    await this.markReady.execute({ fileId, thumbKey, previewKey });
    await this.broadcast(spaceId);
  }

  private async writeThumbnail(input: {
    source: string;
    key: string;
    width: number;
    quality: number;
  }): Promise<void> {
    const destination = path.join(this.media.root, input.key);

    await mkdir(path.dirname(destination), { recursive: true });
    await sharp(input.source)
      .rotate()
      .resize({ width: input.width, withoutEnlargement: true })
      .webp({ quality: input.quality })
      .toFile(destination);
  }

  private async broadcast(spaceId: string): Promise<void> {
    const presented = await this.loadAuthoredSpace.forSpaceId(spaceId);

    if (!presented) {
      return;
    }

    await this.spaceEvents.broadcastSpaceUpdated(presented);
  }
}
