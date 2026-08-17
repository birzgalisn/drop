import { Box, Group } from '@mantine/core';
import { PauseIcon } from '@phosphor-icons/react/Pause';
import { PlayIcon } from '@phosphor-icons/react/Play';
import { Bytes } from '@repo/shared';

import { IconButton } from '../../../design-system/icon-button/feature/icon-button';
import { Stack } from '../../../design-system/stack/feature/stack';
import { Text } from '../../../design-system/text/feature/text';
import { ICON_SIZE } from '../../../design-system/util/icon-size';
import { useSpaceUploadStore } from '../../files/util/upload-space-files-tus';
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

  const handleTogglePause = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (isPaused) {
      resumeAll();
    } else {
      pauseAll();
    }
  };

  return (
    <Box className="drop-upload-toast-body">
      <Group justify="space-between" gap="xs" wrap="nowrap" className="drop-upload-toast-header">
        <Group gap={6} wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <Text variant="label" truncate>
            {activeUploadTitle({ count: active.length, isPaused, isOffline })}
          </Text>
          {showCombinedSpeed && <Text>{Bytes.formatSpeed(combinedSpeed)}</Text>}
        </Group>
        {canTogglePause ? (
          <IconButton
            variant="subtle"
            onClick={handleTogglePause}
            aria-label={isPaused ? 'Resume uploads' : 'Pause uploads'}
          >
            {isPaused ? <PlayIcon size={ICON_SIZE.md} /> : <PauseIcon size={ICON_SIZE.md} />}
          </IconButton>
        ) : null}
      </Group>

      <Box className="drop-upload-toast-files">
        <Stack gap="regular">
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
