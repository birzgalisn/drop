import { notifications } from '@mantine/notifications';

import { useSpaceUploadStore, type SpaceUploadItem } from '../../files/util/upload-space-files-tus';
import { COMPLETE_AUTO_CLOSE_MS, UPLOAD_NOTIFICATION_ID } from '../constants/upload-notifications';
import { CompleteUploadNotificationBody } from '../ui/upload-toast-complete-body';
import { LiveUploadNotificationBody } from '../ui/upload-toast-live-body';
import { isActiveUpload, upsertUploadNotification } from './upload-notification-helpers';

/**
 * Drives the single upload toast between idle → active → complete.
 *
 * Deliberately does not update the toast on progress: the live body subscribes
 * to the upload store itself, because calling `notifications.update` on every
 * tus tick freezes the UI.
 */
export function syncUploadToast(options: { uploads: SpaceUploadItem[]; spaceId?: string }): void {
  const { uploads, spaceId } = options;
  const {
    toastPhase,
    toastBatchIds,
    setToastPhase,
    setToastBatchIds,
    addToastBatchId,
    resetToast,
  } = useSpaceUploadStore.getState();

  const active = uploads.filter((upload) => isActiveUpload(upload.status));

  if (active.length > 0) {
    if (toastPhase !== 'active') {
      setToastBatchIds(active.map((upload) => upload.fileId));
      setToastPhase('active');
      upsertUploadNotification({
        autoClose: false,
        withCloseButton: false,
        message: <LiveUploadNotificationBody spaceId={spaceId} />,
      });
      return;
    }

    for (const upload of active) {
      addToastBatchId(upload.fileId);
    }

    return;
  }

  const batchFinished = uploads.filter(
    (upload) =>
      (upload.status === 'success' || upload.status === 'error') &&
      toastBatchIds.includes(upload.fileId),
  );

  if (toastPhase === 'active' && batchFinished.length > 0) {
    setToastPhase('complete');
    upsertUploadNotification({
      autoClose: COMPLETE_AUTO_CLOSE_MS,
      withCloseButton: true,
      color: 'sand',
      message: <CompleteUploadNotificationBody uploads={batchFinished} />,
      onClose: () => {
        if (useSpaceUploadStore.getState().toastPhase === 'complete') {
          resetToast();
        }
      },
    });
    return;
  }

  if (toastPhase === 'complete') {
    return;
  }

  resetToast();
  notifications.hide(UPLOAD_NOTIFICATION_ID);
}
