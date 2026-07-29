import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core';
import { PauseIcon } from '@phosphor-icons/react/Pause';
import { PlayIcon } from '@phosphor-icons/react/Play';
import { Bytes } from '@repo/shared';

import { useSpaceUploadStore } from '../../util/upload-space-files-tus';
import {
  activeUploadTitle,
  isActiveUpload,
  totalUploadSpeed,
} from '../util/upload-notification-helpers';
import { UploadFileLine } from './upload-toast-file-line';

import './space-upload-notifications.css';

/**
 * Lives inside the Mantine notification and re-renders on tus progress via the
 * upload store — avoids notifications.update on every byte tick.
 */
export function LiveUploadNotificationBody({ spaceId }: { spaceId?: string }) {
  const allUploads = useSpaceUploadStore((state) => state.uploads);
  const cancelUpload = useSpaceUploadStore((state) => state.cancelUpload);
  const isPaused = useSpaceUploadStore((state) => state.manuallyPaused);
  const isOffline = useSpaceUploadStore((state) => state.offline);
  const pauseAll = useSpaceUploadStore((state) => state.pauseAll);
  const resumeAll = useSpaceUploadStore((state) => state.resumeAll);

  const active = (() => {
    const scoped = spaceId ? allUploads.filter((upload) => upload.spaceId === spaceId) : allUploads;

    return scoped.filter((upload) => isActiveUpload(upload.status));
  })();

  const combinedSpeed = totalUploadSpeed(active);
  const showCombinedSpeed = !isOffline && !isPaused && combinedSpeed > 0;
  const canTogglePause = !isOffline;

  return (
    <Box className="drop-upload-toast-body">
      <Group justify="space-between" gap="xs" wrap="nowrap" className="drop-upload-toast-header">
        <Group gap={6} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <Text size="sm" fw={600} truncate>
            {activeUploadTitle({ count: active.length, isPaused, isOffline })}
          </Text>
          {showCombinedSpeed && (
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
              {Bytes.formatSpeed(combinedSpeed)}
            </Text>
          )}
        </Group>
        {canTogglePause && (
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              if (isPaused) {
                resumeAll();
              } else {
                pauseAll();
              }
            }}
            aria-label={isPaused ? 'Resume uploads' : 'Pause uploads'}
          >
            {isPaused ? <PlayIcon size={14} /> : <PauseIcon size={14} />}
          </ActionIcon>
        )}
      </Group>

      <Box className="drop-upload-toast-files">
        <Stack gap="md">
          {active.map((upload) => (
            <UploadFileLine
              key={upload.fileId}
              upload={upload}
              isPaused={isPaused}
              isOffline={isOffline}
              onCancel={cancelUpload}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
