import { ActionIcon, Group, Progress, Stack, Text } from '@mantine/core';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { Bytes } from '@repo/shared';

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

  return (
    <Stack gap={6}>
      <Group justify="space-between" gap="xs" wrap="nowrap">
        <Text size="sm" truncate style={{ flex: 1, minWidth: 0 }}>
          {upload.name}
        </Text>
        <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
          <Text size="xs" c={failed ? 'red' : 'dimmed'}>
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
          {canCancel && (
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onCancel?.(upload.fileId);
              }}
              aria-label={`Cancel upload of ${upload.name}`}
            >
              <TrashIcon size={14} />
            </ActionIcon>
          )}
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
