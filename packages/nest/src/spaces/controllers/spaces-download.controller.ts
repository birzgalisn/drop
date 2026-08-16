import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common';
import { AppError, uuidListSchema } from '@repo/shared';

import { Streamable } from '../../common';
import { MediaZipService } from '../../media';
import { ZodValidationPipe } from '../../validation';
import { AuthoredSpace } from '../pipes/authored-space.decorator';
import { SpaceAuthorPipe } from '../pipes/space-author.pipe';
import { SpaceFileMediaService } from '../services/space-file-media.service';
import { FindSpaceFileByIdUseCase, ListReadySpaceFilesUseCase, type SpaceRow } from '../use-cases';
import { SpaceFileStorage } from '../util/space-file-storage.util';

@Controller('spaces')
export class SpacesDownloadController {
  constructor(
    private readonly findFile: FindSpaceFileByIdUseCase,
    private readonly listReady: ListReadySpaceFilesUseCase,
    private readonly fileMedia: SpaceFileMediaService,
    private readonly mediaZip: MediaZipService,
  ) {}

  @Get(':spaceId/files/:fileId')
  async downloadFile(
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
    @Param('fileId') fileId: string,
    @Query('variant') variantRaw: string | undefined,
  ): Promise<StreamableFile> {
    const file = await this.findFile.execute({ fileId, spaceId: space.id });

    if (!file || !SpaceFileStorage.isReady(file)) {
      throw AppError.notFound('File not available');
    }

    const media = this.fileMedia.open({
      file,
      variant: SpaceFileMediaService.parseVariant(variantRaw),
    });

    return Streamable.file({
      stream: media.stream,
      contentType: media.contentType,
      filename: file.originalName,
      inline: media.inline,
    });
  }

  @Get(':spaceId/zip')
  async downloadZip(
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
    @Query('fileIds', new ZodValidationPipe(uuidListSchema)) fileIds: string[],
  ): Promise<StreamableFile> {
    const ready = await this.listReady.execute({
      spaceId: space.id,
      fileIds,
    });

    if (ready.length === 0) {
      throw AppError.notFound('No files available to download');
    }

    return Streamable.zip(
      this.mediaZip.open({
        filename: `space-${space.id}.zip`,
        files: ready.map((file) => ({
          storageKey: file.storageKey,
          name: file.originalName,
        })),
      }),
    );
  }
}
