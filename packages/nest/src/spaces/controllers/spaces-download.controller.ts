import { Controller, Get, NotFoundException, Param, Query, StreamableFile } from '@nestjs/common';

import { AuthoredSpace } from '../pipes/authored-space.decorator';
import { SpaceAuthorPipe } from '../pipes/space-author.pipe';
import { SpaceFileMediaService } from '../services/space-file-media.service';
import { SpaceZipService } from '../services/space-zip.service';
import { FindSpaceFileByIdUseCase, ListReadySpaceFilesUseCase, type SpaceRow } from '../use-cases';
import { SpaceFileStorage } from '../util/space-file-storage.util';

/**
 * Author-authenticated downloads for a space they own.
 */
@Controller('spaces')
export class SpacesDownloadController {
  constructor(
    private readonly findFile: FindSpaceFileByIdUseCase,
    private readonly listReady: ListReadySpaceFilesUseCase,
    private readonly fileMedia: SpaceFileMediaService,
    private readonly spaceZip: SpaceZipService,
  ) {}

  @Get(':spaceId/files/:fileId')
  async downloadFile(
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
    @Param('fileId') fileId: string,
    @Query('variant') variantRaw: string | undefined,
  ): Promise<StreamableFile> {
    const file = await this.findFile.execute({ fileId, spaceId: space.id });

    if (!file || !SpaceFileStorage.isReady(file)) {
      throw new NotFoundException('File not available');
    }

    const variant = SpaceFileMediaService.parseVariant(variantRaw);
    const media = this.fileMedia.open({ file, variant });

    return new StreamableFile(media.stream, {
      type: media.contentType,
      disposition: media.inline
        ? `inline; filename="${encodeURIComponent(file.originalName)}"`
        : `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    });
  }

  @Get(':spaceId/zip')
  async downloadZip(
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
    @Query('fileIds') fileIdsRaw: string | string[] | undefined,
  ): Promise<StreamableFile> {
    const ready = await this.listReady.execute({
      spaceId: space.id,
      fileIds: SpaceZipService.parseFileIds(fileIdsRaw),
    });

    if (ready.length === 0) {
      throw new NotFoundException('No files available to download');
    }

    const zip = this.spaceZip.open({ spaceId: space.id, files: ready });

    return new StreamableFile(zip.stream, {
      type: 'application/zip',
      disposition: `attachment; filename="${encodeURIComponent(zip.filename)}"`,
    });
  }
}
