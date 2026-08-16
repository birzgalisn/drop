import { Body, Controller, Get, Param, Post, Query, Res, StreamableFile } from '@nestjs/common';
import {
  AppError,
  unlockShareFormSchema,
  uuidListSchema,
  type UnlockShareFormValues,
} from '@repo/shared';
import type { FastifyReply } from 'fastify';

import { Streamable } from '../../common';
import { MediaZipService } from '../../media';
import { ZodValidationPipe } from '../../validation';
import { ShareSessionPipe } from '../pipes/share-session.pipe';
import { SpaceContext } from '../services/space-context.service';
import { SpaceFileMediaService } from '../services/space-file-media.service';
import { FindSpaceFileByIdUseCase, ListReadySpaceFilesUseCase, type ShareRow } from '../use-cases';
import { SpaceFileStorage } from '../util/space-file-storage.util';
import { UnlockShareWorkflow } from '../workflows';

@Controller('shares')
export class SharesDownloadController {
  constructor(
    private readonly unlockShare: UnlockShareWorkflow,
    private readonly findFile: FindSpaceFileByIdUseCase,
    private readonly listReady: ListReadySpaceFilesUseCase,
    private readonly fileMedia: SpaceFileMediaService,
    private readonly mediaZip: MediaZipService,
    private readonly spaceContext: SpaceContext,
  ) {}

  @Post(':token/unlock')
  async unlock(
    @Param('token') token: string,
    @Body(new ZodValidationPipe(unlockShareFormSchema)) body: UnlockShareFormValues,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ ok: true }> {
    const result = await this.unlockShare.execute({ token, pin: body.pin });
    this.spaceContext.setShareSessionCookie(reply, token);

    return result;
  }

  @Get(':token/files/:fileId')
  async downloadFile(
    @Param('token', ShareSessionPipe) share: ShareRow,
    @Param('fileId') fileId: string,
    @Query('variant') variantRaw: string | undefined,
  ): Promise<StreamableFile> {
    const file = await this.findFile.execute({ fileId, spaceId: share.spaceId });

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

  @Get(':token/zip')
  async downloadZip(
    @Param('token', ShareSessionPipe) share: ShareRow,
    @Query('fileIds', new ZodValidationPipe(uuidListSchema)) fileIds: string[],
  ): Promise<StreamableFile> {
    const ready = await this.listReady.execute({
      spaceId: share.spaceId,
      fileIds,
    });

    if (ready.length === 0) {
      throw AppError.notFound('No files available to download');
    }

    return Streamable.zip(
      this.mediaZip.open({
        filename: `space-${share.spaceId}.zip`,
        files: ready.map((file) => ({
          storageKey: file.storageKey,
          name: file.originalName,
        })),
      }),
    );
  }
}
