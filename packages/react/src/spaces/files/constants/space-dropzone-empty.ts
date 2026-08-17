import { SpaceConfig } from '@repo/shared';

export const SPACE_DROPZONE_EMPTY = {
  title: 'Drop images here',
  hint: `or click to browse — JPEG & PNG, up to ${SpaceConfig.FILE_MAX_MIB} MiB each, ${SpaceConfig.MAX_FILES} files max`,
} as const;
