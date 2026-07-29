import { useEffect } from 'react';

import type { MergedSpaceFileItem } from '../util/get-merged-space-files-with-uploads';
import { useSpaceUploadStore } from '../util/upload-space-files-tus';

/** Revoke blob URLs once server thumbs are ready — after crossfade completes. */
export function usePruneReadyUploads(items: MergedSpaceFileItem[]): void {
  const pruneUploadIds = items
    .filter((item) => item.upload?.status === 'success' && Boolean(item.thumbKey))
    .map((item) => item.upload?.fileId ?? item.fileId)
    .join(',');

  useEffect(() => {
    if (!pruneUploadIds) {
      return;
    }

    // Let blob→thumb crossfade finish before revoking object URLs.
    const timer = window.setTimeout(() => {
      const { remove } = useSpaceUploadStore.getState();
      for (const fileId of pruneUploadIds.split(',')) {
        remove(fileId);
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pruneUploadIds]);
}
