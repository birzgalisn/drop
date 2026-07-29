import { notifications, notificationsStore } from '@mantine/notifications';

import type { SpaceUploadItem, SpaceUploadStatus } from '../../util/upload-space-files-tus';
import { UPLOAD_NOTIFICATION_ID } from '../constants';

export function isActiveUpload(status: SpaceUploadStatus): boolean {
  return status === 'pending' || status === 'uploading' || status === 'paused';
}

export function uploadNotificationExists(): boolean {
  const { notifications: visible, queue } = notificationsStore.getState();
  return (
    visible.some((item) => item.id === UPLOAD_NOTIFICATION_ID) ||
    queue.some((item) => item.id === UPLOAD_NOTIFICATION_ID)
  );
}

export function upsertUploadNotification(
  notification: Parameters<typeof notifications.show>[0],
): void {
  const payload = {
    ...notification,
    id: UPLOAD_NOTIFICATION_ID,
    className: 'drop-upload-toast',
    py: 'md',
    px: 'md',
  };

  if (uploadNotificationExists()) {
    notifications.update(payload);
  } else {
    notifications.show(payload);
  }
}

export function uploadPercent(upload: SpaceUploadItem): number {
  if (upload.bytesTotal <= 0) {
    return 0;
  }

  return Math.min(100, (upload.bytesUploaded / upload.bytesTotal) * 100);
}

export function totalUploadSpeed(uploads: SpaceUploadItem[]): number {
  return uploads
    .filter((upload) => upload.status === 'uploading')
    .reduce((sum, upload) => sum + upload.speedBytesPerSec, 0);
}

export function completeNotificationTitle(uploads: SpaceUploadItem[]): string {
  const failed = uploads.some((upload) => upload.status === 'error');

  if (failed) {
    return uploads.length === 1 ? 'Upload finished' : 'Uploads finished';
  }

  return uploads.length === 1 ? 'Upload complete' : 'All uploads complete';
}

export function activeUploadTitle(options: {
  count: number;
  isPaused: boolean;
  isOffline: boolean;
}): string {
  const { count, isPaused, isOffline } = options;

  if (isOffline) {
    return 'Offline — uploads paused';
  }

  if (isPaused) {
    return count === 1 ? 'Upload paused' : `${count} uploads paused`;
  }

  return count === 1 ? 'Uploading 1 file' : `Uploading ${count} files`;
}
