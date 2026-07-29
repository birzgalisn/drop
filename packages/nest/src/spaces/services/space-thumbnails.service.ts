import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { SpaceThumbnails } from '../constants/space-thumbnails.constants';
import type { GenerateThumbnailsJobData } from '../interfaces/generate-thumbnails-job-data.interface';

/**
 * Best-effort enqueue for thumb/preview WebP generation. Duplicate in-flight job ids
 * are ignored so download heal + upload-complete can both call this safely.
 */
@Injectable()
export class SpaceThumbnailsService {
  private readonly logger = new Logger(SpaceThumbnailsService.name);

  constructor(@InjectQueue(SpaceThumbnails.QUEUE) private readonly thumbnailsQueue: Queue) {}

  async enqueue(options: { spaceId: string; fileId: string; storageKey: string }): Promise<void> {
    const { spaceId, fileId, storageKey } = options;

    try {
      const data: GenerateThumbnailsJobData = {
        spaceId,
        fileId,
        storageKey,
      };

      await this.thumbnailsQueue.add(SpaceThumbnails.JOB, data, {
        jobId: SpaceThumbnails.jobId(fileId),
        removeOnComplete: true,
        removeOnFail: 100,
      });
    } catch (error) {
      this.logger.warn(`Failed to enqueue thumbnail job for ${fileId}: ${String(error)}`);
    }
  }
}
