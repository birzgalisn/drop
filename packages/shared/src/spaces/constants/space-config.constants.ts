import { ByteSize } from '../../file/constants/file-size.constants';
import { Duration } from '../../time/constants/duration.constants';
import { SpaceFileThumbnailSize } from '../enums/space-file-thumbnail-size.enum';

/** Product limits, accept rules, derivatives, lifecycle, and cookie names for spaces. */
export class SpaceConfig {
  /** Max single file size (25 MiB). */
  static readonly FILE_MAX_MIB = 25;
  static readonly FILE_MAX_BYTES = SpaceConfig.FILE_MAX_MIB * ByteSize.MIB;

  /** Max total bytes for all non-removed files in one space (250 MiB). */
  static readonly MAX_MIB = 250;
  static readonly MAX_BYTES = SpaceConfig.MAX_MIB * ByteSize.MIB;

  /** Max file count per space. */
  static readonly MAX_FILES = 50;

  /** v1 mime allowlist — jpeg + png only. */
  static readonly ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'] as const;

  static readonly ACCEPTED_MIME_TYPE_SET = new Set<string>(SpaceConfig.ACCEPTED_MIME_TYPES);

  /**
   * Derivative image widths (px). Generated as WebP on upload complete.
   * - thumb: list / grid cards
   * - preview: image viewer (replaces loading the original for display)
   */
  static readonly THUMBNAIL_WIDTHS: Record<SpaceFileThumbnailSize, number> = {
    [SpaceFileThumbnailSize.Thumb]: 360,
    [SpaceFileThumbnailSize.Preview]: 1920,
  };

  /** WebP quality per derivative size (0–100). */
  static readonly THUMBNAIL_WEBP_QUALITY: Record<SpaceFileThumbnailSize, number> = {
    [SpaceFileThumbnailSize.Thumb]: 72,
    [SpaceFileThumbnailSize.Preview]: 82,
  };

  /** Draft spaces without a share older than this are cleaned up daily. */
  static readonly DRAFT_TTL_MS = Duration.toMs(Duration.DAY);

  static readonly SHARE_EXPIRY_PRESETS_DAYS = [1, 7, 30] as const;

  /** Fixed 6-digit PIN — matches Mantine PinInput length. */
  static readonly SHARE_PIN_LENGTH = 6;

  /** Author cookie name (HttpOnly) binding browser to spaces.authorKey. */
  static readonly AUTHOR_COOKIE = 'drop_space_author';

  /** Share unlock session cookie after PIN verify. */
  static readonly SHARE_SESSION_COOKIE = 'drop_share_session';

  /** UTC midnight of the calendar day `now + expiryDays` (aligned with daily cleanup cron). */
  static shareExpiresAt(options: { expiryDays: number; now?: Date }): Date {
    const now = options.now ?? new Date();

    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + options.expiryDays,
        0,
        0,
        0,
        0,
      ),
    );
  }
}

export type SpaceAcceptedMimeType = (typeof SpaceConfig.ACCEPTED_MIME_TYPES)[number];

export type SpaceShareExpiryPresetDays = (typeof SpaceConfig.SHARE_EXPIRY_PRESETS_DAYS)[number];
