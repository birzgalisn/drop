import { AppError, SpaceBundle, SpaceConfig } from '@repo/shared';

import type { SpaceFileFieldsFragment } from '../data-access/space-fields.generated';

export interface ValidateSpaceFilesResult {
  accepted: File[];
  /** User-facing messages for everything rejected. */
  errors: string[];
}

/**
 * Mirror of the API guards (`SpaceConfig` / `SpaceBundle`) so the user sees a
 * rejection before any bytes leave the browser.
 */
export function validateSpaceFiles(options: {
  incoming: File[];
  existingFiles: SpaceFileFieldsFragment[];
}): ValidateSpaceFilesResult {
  const { incoming, existingFiles } = options;
  const accepted: File[] = [];
  const errors: string[] = [];

  for (const file of incoming) {
    if (!SpaceConfig.ACCEPTED_MIME_TYPE_SET.has(file.type)) {
      errors.push(`${file.name}: only JPEG and PNG are allowed`);
      continue;
    }

    if (file.size > SpaceConfig.FILE_MAX_BYTES) {
      errors.push(`${file.name}: larger than ${SpaceConfig.FILE_MAX_MIB} MiB`);
      continue;
    }

    accepted.push(file);
  }

  if (accepted.length === 0) {
    return { accepted, errors };
  }

  const activeFiles = existingFiles.filter((file) => file.status !== 'REMOVED');

  try {
    SpaceBundle.assertFits({
      existingBytes: activeFiles.reduce((sum, file) => sum + file.byteSize, 0),
      existingCount: activeFiles.length,
      incoming: accepted.map((file) => ({ byteSize: file.size })),
    });
  } catch (error) {
    return {
      accepted: [],
      errors: [
        ...errors,
        AppError.is(error) ? error.message : 'These files exceed the space limit',
      ],
    };
  }

  return { accepted, errors };
}
