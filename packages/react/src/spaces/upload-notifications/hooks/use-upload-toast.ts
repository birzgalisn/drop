import { useEffect, useEffectEvent } from 'react';

import { useSpaceUploadStore, type SpaceUploadItem } from '../../files/util/upload-space-files-tus';
import { syncUploadToast } from '../util/sync-upload-toast';
import { isActiveUpload } from '../util/upload-notification-helpers';

export interface UseUploadToastOptions {
  uploads: SpaceUploadItem[];
  spaceId?: string;
  /** Cancel from the toast should also delete the file server-side. */
  onCancelUpload: (fileId: string) => void;
}

/**
 * Keeps the upload toast in sync with the current uploads, and registers the
 * cancel handler the toast calls from its portal.
 */
export function useUploadToast({ uploads, spaceId, onCancelUpload }: UseUploadToastOptions): void {
  const cancelUpload = useEffectEvent((fileId: string) => {
    onCancelUpload(fileId);
  });

  useEffect(() => {
    const { setCancelUploadHandler } = useSpaceUploadStore.getState();

    setCancelUploadHandler(cancelUpload);

    return () => {
      setCancelUploadHandler(null);
    };
  }, []);

  // Ids only: progress ticks must not re-run the sync. Plain strings compare by value.
  const activeIdsKey = uploads
    .filter((upload) => isActiveUpload(upload.status))
    .map((upload) => upload.fileId)
    .sort()
    .join(',');

  const finishedIdsKey = uploads
    .filter((upload) => upload.status === 'success' || upload.status === 'error')
    .map((upload) => upload.fileId)
    .sort()
    .join(',');

  const sync = useEffectEvent(() => {
    syncUploadToast({ uploads, spaceId });
  });

  useEffect(() => {
    sync();
  }, [activeIdsKey, finishedIdsKey, spaceId]);
}
