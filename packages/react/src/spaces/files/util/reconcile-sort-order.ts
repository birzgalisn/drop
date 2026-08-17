import type { SpaceFileFieldsFragment } from '../data-access/space-fields.generated';
import { getMergedSpaceFilesWithUploads } from './get-merged-space-files-with-uploads';
import { useSpaceUploadStore, type SpaceUploadItem } from './upload-space-files-tus';

export interface ReorderEntry {
  fileId: string;
  sortOrder: number;
}

/**
 * The server appends new files in request order, which can disagree with the
 * positions the user already sees for still-pending uploads. Compare the merged
 * list against the server rows and return the entries to persist, or null when
 * they already agree.
 */
export function getSortOrderDrift(options: {
  serverFiles: SpaceFileFieldsFragment[];
  uploads: SpaceUploadItem[];
}): ReorderEntry[] | null {
  const { serverFiles, uploads } = options;
  const merged = getMergedSpaceFilesWithUploads({ files: serverFiles, uploads });
  const serverIds = new Set(serverFiles.map((file) => file.id));
  const drifted = merged.some((item) => {
    const server = serverFiles.find((file) => file.id === item.fileId);

    return Boolean(server && server.sortOrder !== item.sortOrder);
  });

  if (!drifted) {
    return null;
  }

  return merged
    .map((item, sortOrder) => ({ fileId: item.fileId, sortOrder }))
    .filter((entry) => serverIds.has(entry.fileId));
}

/** Apply the same order to in-flight uploads so cards do not jump afterwards. */
export function applySortOrderToUploads(options: {
  serverFiles: SpaceFileFieldsFragment[];
  uploads: SpaceUploadItem[];
}): void {
  const { serverFiles, uploads } = options;
  const merged = getMergedSpaceFilesWithUploads({ files: serverFiles, uploads });

  useSpaceUploadStore.getState().setSortOrders(
    merged.map((item, sortOrder) => ({
      fileId: item.upload?.fileId ?? item.fileId,
      sortOrder,
    })),
  );
}
