import { notifications, notificationsStore } from '@mantine/notifications';
import { pluralize } from '@repo/shared';

import type { SpaceUploadItem, SpaceUploadStatus } from '../../files/util/upload-space-files-tus';
import { UPLOAD_NOTIFICATION_ID } from '../constants/upload-notifications';

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
    return pluralize({
      count: uploads.length,
      singular: 'Upload finished',
      plural: 'Uploads finished',
    });
  }

  return pluralize({
    count: uploads.length,
    singular: 'Upload complete',
    plural: 'All uploads complete',
  });
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
    return pluralize({
      count,
      singular: 'Upload paused',
      plural: `${count} uploads paused`,
    });
  }

  return `Uploading ${count} ${pluralize({ count, singular: 'file' })}`;
}
