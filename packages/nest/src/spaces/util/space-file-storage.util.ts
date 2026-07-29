import { SpaceFileStatus } from '../../drizzle';
import type { SpaceFileRow, SpaceFileWithStorageKey } from '../use-cases';

/** Type guards for space file rows that have (or are ready with) a storage key. */
export class SpaceFileStorage {
  static hasKey(file: SpaceFileRow): file is SpaceFileWithStorageKey {
    return file.storageKey != null;
  }

  /** Ready for download: status READY and a non-null storage key. */
  static isReady(file: SpaceFileRow): file is SpaceFileWithStorageKey {
    return file.status === SpaceFileStatus.READY && file.storageKey != null;
  }
}
