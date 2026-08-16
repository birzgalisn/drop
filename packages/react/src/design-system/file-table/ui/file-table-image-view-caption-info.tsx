import type { ReactNode } from 'react';

import { Stack } from '../../stack/feature/stack';
import { FileTableImageViewCaptionDate } from './file-table-image-view-caption-date';
import { FileTableImageViewCaptionName } from './file-table-image-view-caption-name';

export function FileTableImageViewCaptionInfo({
  children = (
    <>
      <FileTableImageViewCaptionName />
      <FileTableImageViewCaptionDate />
    </>
  ),
}: {
  children?: ReactNode;
}) {
  return (
    <Stack gap="tight" flex={1} miw={0}>
      {children}
    </Stack>
  );
}

FileTableImageViewCaptionInfo.Name = FileTableImageViewCaptionName;
FileTableImageViewCaptionInfo.Date = FileTableImageViewCaptionDate;
