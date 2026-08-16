import type { ReactNode } from 'react';

import { Box } from '../../box/feature/box';
import { FileTableImageViewCaptionDate } from './file-table-image-view-caption-date';
import { FileTableImageViewCaptionInfo } from './file-table-image-view-caption-info';
import { FileTableImageViewCaptionName } from './file-table-image-view-caption-name';

import classes from './file-table-image-view.module.css';

export function FileTableImageViewCaption({
  children = <FileTableImageViewCaptionInfo />,
}: {
  children?: ReactNode;
}) {
  return (
    <Box pos="absolute" left={0} right={0} bottom={0} p="md" className={classes.caption}>
      {children}
    </Box>
  );
}

FileTableImageViewCaption.Info = FileTableImageViewCaptionInfo;
FileTableImageViewCaption.Name = FileTableImageViewCaptionName;
FileTableImageViewCaption.Date = FileTableImageViewCaptionDate;
