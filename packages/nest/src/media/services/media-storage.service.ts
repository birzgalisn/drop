import { mkdir, rename, rm, statfs, unlink } from 'node:fs/promises';
import path from 'node:path';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AppError, Bytes, ByteSize, SpaceFilePath, SpaceFileThumbnailSizes } from '@repo/shared';

import type { StorageCapacity } from '../interfaces/storage-capacity.interface';
import { mediaConfig } from '../media.config';

@Injectable()
export class MediaStorageService {
  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  async readStorageCapacity(): Promise<StorageCapacity> {
    const stats = await statfs(this.media.root);
    const blockSize = stats.bsize;
    const totalBytes = blockSize * stats.blocks;
    const availableBytes = blockSize * stats.bavail;
    const usedBytes = totalBytes - blockSize * stats.bfree;

    return {
      totalBytes,
      usedBytes,
      availableBytes,
      reserveBytes: ByteSize.STORAGE_RESERVE,
      uploadAllowed: Bytes.uploadableFree(availableBytes) > 0,
    };
  }

  /** Throws {@link AppError.storageFull} if `requiredBytes` would eat into the reserve. */
  async ensureDiskHeadroomFor(requiredBytes: number): Promise<void> {
    const { availableBytes, reserveBytes } = await this.readStorageCapacity();
    const remainingAfterUpload = availableBytes - requiredBytes;

    if (remainingAfterUpload < reserveBytes) {
      throw AppError.storageFull('Not enough storage space. Please try again later.');
    }
  }

  /**
   * Moves a finished tus upload out of the tus root into its permanent media path
   * and drops the `@tus/file-store` `{uploadId}.json` sidecar (no longer needed).
   */
  async promote({
    uploadId,
    storageKey,
  }: {
    uploadId: string;
    storageKey: string;
  }): Promise<string> {
    const source = path.join(this.media.tusRoot, uploadId);
    const destination = path.join(this.media.root, storageKey);
    const infoPath = path.join(this.media.tusRoot, `${uploadId}.json`);

    await mkdir(path.dirname(destination), { recursive: true });
    await rename(source, destination);
    await unlink(infoPath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    });

    return destination;
  }

  /** Best-effort `rm -rf` of a space media directory under `spaces/`. Never touches `tus/`. */
  async removeSpaceDir(spaceId: string): Promise<void> {
    if (!isSafeSpaceMediaSegment(spaceId)) {
      return;
    }

    await rm(path.join(this.media.root, SpaceFilePath.spaceDir(spaceId)), {
      recursive: true,
      force: true,
    });
  }

  /** Best-effort unlink of a file’s original + thumb/preview derivatives. */
  async removeSpaceFileMedia(options: {
    spaceId: string;
    fileId: string;
    storageKey?: string | null;
  }): Promise<void> {
    if (!isSafeSpaceMediaSegment(options.spaceId) || !options.fileId) {
      return;
    }

    const keys = new Set<string>();

    if (options.storageKey) {
      keys.add(options.storageKey);
    }

    for (const size of SpaceFileThumbnailSizes.ALL) {
      keys.add(
        SpaceFilePath.thumbnailKey({
          spaceId: options.spaceId,
          fileId: options.fileId,
          size,
        }),
      );
    }

    await Promise.all([...keys].map((key) => this.unlinkRelative(key)));
  }

  private async unlinkRelative(storageKey: string): Promise<void> {
    await unlink(path.join(this.media.root, storageKey)).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    });
  }
}

/** Reject path traversal and reserved top-level media segments. */
function isSafeSpaceMediaSegment(spaceId: string): boolean {
  return Boolean(
    spaceId &&
    spaceId !== 'tus' &&
    spaceId !== SpaceFilePath.ROOT &&
    !spaceId.includes('/') &&
    !spaceId.includes('\\') &&
    !spaceId.includes('..'),
  );
}
