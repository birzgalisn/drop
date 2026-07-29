import { createReadStream, type ReadStream } from 'node:fs';
import path from 'node:path';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { SpaceFileThumbnailSize, SpaceFileThumbnailSizes } from '@repo/shared';

import { mediaConfig } from '../../media';
import type { SpaceFileWithStorageKey } from '../use-cases';

export type SpaceFileMediaVariant = SpaceFileThumbnailSize | 'original';

export interface OpenSpaceFileMediaResult {
  stream: ReadStream;
  contentType: string;
  inline: boolean;
}

/**
 * Picks original or generated WebP thumbnail using keys stored on the file row.
 * Falls back to the original when thumb/preview keys are not set yet.
 */
@Injectable()
export class SpaceFileMediaService {
  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  static parseVariant(raw: string | undefined): SpaceFileMediaVariant {
    if (SpaceFileThumbnailSizes.is(raw)) {
      return raw;
    }

    return 'original';
  }

  open(input: {
    file: SpaceFileWithStorageKey;
    variant: SpaceFileMediaVariant;
  }): OpenSpaceFileMediaResult {
    const { file, variant } = input;
    const key = this.variantKey({ file, variant });

    if (key) {
      return {
        stream: createReadStream(path.join(this.media.root, key)),
        contentType: 'image/webp',
        inline: true,
      };
    }

    return this.openOriginal(file);
  }

  private variantKey(input: {
    file: SpaceFileWithStorageKey;
    variant: SpaceFileMediaVariant;
  }): string | null {
    const { file, variant } = input;

    if (variant === SpaceFileThumbnailSize.Thumb) {
      return file.thumbKey ?? null;
    }

    if (variant === SpaceFileThumbnailSize.Preview) {
      return file.previewKey ?? null;
    }

    return null;
  }

  private openOriginal(file: SpaceFileWithStorageKey): OpenSpaceFileMediaResult {
    return {
      stream: createReadStream(path.join(this.media.root, file.storageKey)),
      contentType: file.mimeType,
      // Inline so the image viewer can render before thumbs exist; clients force
      // save via `<a download>` on the original (no variant) URL.
      inline: true,
    };
  }
}
