import { Box, Stack, Text } from '@mantine/core';

import type { SpaceUploadItem } from '../../util/upload-space-files-tus';
import { completeNotificationTitle } from '../util/upload-notification-helpers';
import { UploadFileLine } from './upload-toast-file-line';

export function CompleteUploadNotificationBody({ uploads }: { uploads: SpaceUploadItem[] }) {
  return (
    <Box className="drop-upload-toast-body">
      <Text size="sm" fw={600} className="drop-upload-toast-header">
        {completeNotificationTitle(uploads)}
      </Text>
      <Box className="drop-upload-toast-files">
        <Stack gap="md">
          {uploads.map((upload) => (
            <UploadFileLine
              key={upload.fileId}
              upload={upload}
              isPaused={false}
              isOffline={false}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
