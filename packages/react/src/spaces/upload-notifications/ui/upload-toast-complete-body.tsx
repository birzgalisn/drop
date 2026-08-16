import { Box } from '@mantine/core';

import { Stack } from '../../../design-system/stack/feature/stack';
import { Text } from '../../../design-system/text/feature/text';
import type { SpaceUploadItem } from '../../util/upload-space-files-tus';
import { completeNotificationTitle } from '../util/upload-notification-helpers';
import { UploadFileLine } from './upload-toast-file-line';

export function CompleteUploadNotificationBody({ uploads }: { uploads: SpaceUploadItem[] }) {
  return (
    <Box className="drop-upload-toast-body">
      <Text variant="label" className="drop-upload-toast-header">
        {completeNotificationTitle(uploads)}
      </Text>
      <Box className="drop-upload-toast-files">
        <Stack gap="regular">
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
