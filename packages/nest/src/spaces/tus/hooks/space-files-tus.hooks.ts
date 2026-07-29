import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { AppError, UploadType } from '@repo/shared';
import type { Upload } from '@tus/server';

import { SpaceFileStatus } from '../../../drizzle';
import { MediaStorageService } from '../../../media';
import { TusHandlerRegistry, type TusUploadHandler } from '../../../tus';
import { FindSpaceFileByIdUseCase } from '../../use-cases';
import { CompleteSpaceFileUploadWorkflow } from '../../workflows/complete-space-file-upload.workflow';
import {
  type SpaceFileUploadMetadata,
  spaceFileUploadMetadataSchema,
} from '../schemas/space-file-upload-metadata.schema';

const UPLOADABLE_STATUSES: SpaceFileStatus[] = [
  SpaceFileStatus.PENDING,
  SpaceFileStatus.UPLOADING,
  SpaceFileStatus.PAUSED,
];

/**
 * Owns {@link UploadType.SpaceFile} in the shared tus registry. On create it
 * guards disk headroom and that the target file row is a still-pending match;
 * on finish it hands off to the completion workflow (promote + mark ready).
 */
@Injectable()
export class SpaceFilesTusHooks implements TusUploadHandler, OnModuleInit {
  private readonly logger = new Logger(SpaceFilesTusHooks.name);

  constructor(
    private readonly registry: TusHandlerRegistry,
    private readonly media: MediaStorageService,
    private readonly findFile: FindSpaceFileByIdUseCase,
    private readonly completeUpload: CompleteSpaceFileUploadWorkflow,
  ) {}

  onModuleInit(): void {
    this.registry.register(UploadType.SpaceFile, this);
    this.logger.log(`Registered tus handler for "${UploadType.SpaceFile}"`);
  }

  async onUploadCreate(_req: unknown, upload: Upload): Promise<void> {
    const metadata = this.parseMetadata(upload);

    if (typeof upload.size === 'number') {
      await this.media.ensureDiskHeadroomFor(upload.size);
    }

    const file = await this.findFile.execute({ fileId: metadata.fileId });

    if (!file) {
      throw AppError.notFound('Space file not found');
    }

    if (file.spaceId !== metadata.spaceId) {
      throw AppError.badRequest('File does not belong to this space');
    }

    if (file.mimeType !== metadata.mimeType) {
      throw AppError.badRequest('Upload type does not match the reserved file');
    }

    if (!UPLOADABLE_STATUSES.includes(file.status)) {
      throw AppError.conflict('This file has already been uploaded');
    }
  }

  async onUploadFinish(_req: unknown, upload: Upload): Promise<void> {
    const metadata = this.parseMetadata(upload);

    await this.completeUpload.execute({
      fileId: metadata.fileId,
      spaceId: metadata.spaceId,
      uploadId: upload.id,
    });
  }

  private parseMetadata(upload: Upload): SpaceFileUploadMetadata {
    const result = spaceFileUploadMetadataSchema.safeParse(upload.metadata ?? {});

    if (!result.success) {
      throw AppError.zod(result.error);
    }

    return result.data;
  }
}
