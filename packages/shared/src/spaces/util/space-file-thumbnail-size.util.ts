import { SpaceFileThumbnailSize } from '../enums/space-file-thumbnail-size.enum';

/** Registry / guard helpers for {@link SpaceFileThumbnailSize}. */
export class SpaceFileThumbnailSizes {
  /** Stable iteration order for generating / purging derivatives. */
  static readonly ALL = [SpaceFileThumbnailSize.Thumb, SpaceFileThumbnailSize.Preview] as const;

  private static readonly SET = new Set<string>(SpaceFileThumbnailSizes.ALL);

  static is(value: unknown): value is SpaceFileThumbnailSize {
    return typeof value === 'string' && SpaceFileThumbnailSizes.SET.has(value);
  }
}
