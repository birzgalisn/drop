import { z } from 'zod';

import { SpaceConfig } from '../constants/space-config.constants';
import { spaceAcceptedMimeTypeSchema } from '../util/space-file-path.util';

export const addSpaceFileInputSchema = z.object({
  originalName: z.string().min(1).max(255),
  mimeType: spaceAcceptedMimeTypeSchema,
  byteSize: z
    .number()
    .int()
    .positive()
    .max(
      SpaceConfig.FILE_MAX_BYTES,
      `Each file must be ${SpaceConfig.FILE_MAX_MIB} MiB or smaller`,
    ),
});

export type AddSpaceFileInput = z.infer<typeof addSpaceFileInputSchema>;

export const addSpaceFilesInputSchema = z.object({
  spaceId: z.uuid().optional(),
  files: z
    .array(addSpaceFileInputSchema)
    .min(1)
    .max(SpaceConfig.MAX_FILES, `At most ${SpaceConfig.MAX_FILES} files per space`),
});

export type AddSpaceFilesInput = z.infer<typeof addSpaceFilesInputSchema>;
