import { Group, Progress } from '@mantine/core';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { Bytes } from '@repo/shared';

import { IconButton } from '../../../design-system/icon-button/feature/icon-button';
import { Stack } from '../../../design-system/stack/feature/stack';
import { Text } from '../../../design-system/text/feature/text';
import { ICON_SIZE } from '../../../design-system/util/icon-size';
import type { SpaceUploadItem } from '../../util/upload-space-files-tus';
import { uploadPercent } from '../util/upload-notification-helpers';

export function UploadFileLine({
  upload,
  isPaused,
  isOffline,
  onCancel,
}: {
  upload: SpaceUploadItem;
  isPaused: boolean;
  isOffline: boolean;
  onCancel?: (fileId: string) => void;
}) {
  const percent = uploadPercent(upload);
  const failed = upload.status === 'error';
  const done = upload.status === 'success';
  const preparing = upload.status === 'pending';
  const stalled = !done && (isOffline || isPaused || upload.status === 'paused');
  const canCancel = Boolean(onCancel) && !done;

  const handleCancel = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onCancel?.(upload.fileId);
  };

  return (
    <Stack gap="tight">
      <Group justify="space-between" gap="xs" wrap="nowrap">
        <Text variant="label" truncate>
          {upload.name}
        </Text>
        <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
          <Text variant={failed ? 'error' : 'muted'}>
            {failed
              ? 'Failed'
              : done
                ? 'Done'
                : preparing
                  ? 'Starting…'
                  : stalled
                    ? '—'
                    : Bytes.formatSpeed(upload.speedBytesPerSec)}
          </Text>
          {canCancel ? (
            <IconButton
              variant="subtle"
              tone="danger"
              onClick={handleCancel}
              aria-label={`Cancel upload of ${upload.name}`}
            >
              <TrashIcon size={ICON_SIZE.md} />
            </IconButton>
          ) : null}
        </Group>
      </Group>
      <Progress
        className="drop-upload-toast-progress"
        value={done ? 100 : percent}
        size="sm"
        radius="xl"
        color={failed ? 'red' : done ? 'sand' : stalled || preparing ? 'graphite' : 'sand'}
        animated={false}
      />
    </Stack>
  );
}
