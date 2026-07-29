import { z } from 'zod';

import { SpaceConfig, type SpaceAcceptedMimeType } from '../constants/space-config.constants';
import { SpaceFileThumbnailSize } from '../enums/space-file-thumbnail-size.enum';

export const spaceAcceptedMimeTypeSchema = z.enum(SpaceConfig.ACCEPTED_MIME_TYPES);

/** Preferred on-disk extension per accepted mime (jpeg → `.jpg`). */
const SPACE_FILE_EXTENSION_BY_MIME: Record<SpaceAcceptedMimeType, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
};

/** Path / mime helpers for space file blobs (no persistence). */
export class SpaceFilePath {
  /** Top-level media prefix for all permanent space blobs (siblings: `tus/`). */
  static readonly ROOT = 'spaces';

  static isAcceptedMimeType(value: string): value is SpaceAcceptedMimeType {
    return SpaceConfig.ACCEPTED_MIME_TYPE_SET.has(value);
  }

  static extension(mimeType: string): string {
    return SpaceFilePath.isAcceptedMimeType(mimeType) ? SPACE_FILE_EXTENSION_BY_MIME[mimeType] : '';
  }

  /** Relative dir for one space: `spaces/{spaceId}`. */
  static spaceDir(spaceId: string): string {
    return `${SpaceFilePath.ROOT}/${spaceId}`;
  }

  static storageKey(options: { spaceId: string; fileId: string; mimeType: string }): string {
    return `${SpaceFilePath.spaceDir(options.spaceId)}/${options.fileId}${SpaceFilePath.extension(options.mimeType)}`;
  }

  static thumbnailKey(options: {
    spaceId: string;
    fileId: string;
    size: SpaceFileThumbnailSize;
  }): string {
    return `${SpaceFilePath.spaceDir(options.spaceId)}/${options.fileId}.${options.size}.webp`;
  }
}
