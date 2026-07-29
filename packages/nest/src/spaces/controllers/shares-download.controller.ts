import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
  Body,
} from '@nestjs/common';
import { Duration, SpaceConfig } from '@repo/shared';
import type { FastifyReply } from 'fastify';
import '@fastify/cookie';

import { ShareSessionPipe } from '../pipes/share-session.pipe';
import { SpaceFileMediaService } from '../services/space-file-media.service';
import { SpaceZipService } from '../services/space-zip.service';
import { FindSpaceFileByIdUseCase, ListReadySpaceFilesUseCase, type ShareRow } from '../use-cases';
import { SpaceFileStorage } from '../util/space-file-storage.util';
import { UnlockShareWorkflow } from '../workflows';

interface UnlockBody {
  pin?: string;
}

/**
 * REST surface for share consumers. Unlock verifies the PIN and drops the
 * opaque session cookie; both download routes require that cookie to equal the
 * share token and the share to be unexpired.
 */
@Controller('shares')
export class SharesDownloadController {
  constructor(
    private readonly unlockShare: UnlockShareWorkflow,
    private readonly findFile: FindSpaceFileByIdUseCase,
    private readonly listReady: ListReadySpaceFilesUseCase,
    private readonly fileMedia: SpaceFileMediaService,
    private readonly spaceZip: SpaceZipService,
  ) {}

  @Post(':token/unlock')
  async unlock(
    @Param('token') token: string,
    @Body() body: UnlockBody,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<{ ok: true }> {
    if (!body?.pin) {
      throw new BadRequestException('PIN is required');
    }

    const result = await this.unlockShare.execute({ token, pin: body.pin });

    reply.setCookie(SpaceConfig.SHARE_SESSION_COOKIE, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: Duration.DAY,
    });

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

  @Get(':token/zip')
  async downloadZip(
    @Param('token', ShareSessionPipe) share: ShareRow,
    @Query('fileIds') fileIdsRaw: string | string[] | undefined,
  ): Promise<StreamableFile> {
    const ready = await this.listReady.execute({
      spaceId: share.spaceId,
      fileIds: SpaceZipService.parseFileIds(fileIdsRaw),
    });

    if (ready.length === 0) {
      throw new NotFoundException('No files available to download');
    }

    const zip = this.spaceZip.open({ spaceId: share.spaceId, files: ready });

    return new StreamableFile(zip.stream, {
      type: 'application/zip',
      disposition: `attachment; filename="${encodeURIComponent(zip.filename)}"`,
    });
  }
}
