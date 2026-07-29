import { AppError } from '../../errors/app-error';
import { SpaceConfig } from '../constants/space-config.constants';

/** Space inventory caps (file count + total bytes) against `SpaceConfig` limits. */
export class SpaceBundle {
  static assertFits(input: {
    existingBytes: number;
    existingCount: number;
    incoming: { byteSize: number }[];
  }): void {
    const incomingBytes = input.incoming.reduce((sum, file) => sum + file.byteSize, 0);
    const nextCount = input.existingCount + input.incoming.length;
    const nextBytes = input.existingBytes + incomingBytes;

    if (nextCount > SpaceConfig.MAX_FILES) {
      throw AppError.badRequest(`At most ${SpaceConfig.MAX_FILES} files per space`);
    }

    if (nextBytes > SpaceConfig.MAX_BYTES) {
      throw AppError.badRequest('Space size limit exceeded');
    }
  }
}
