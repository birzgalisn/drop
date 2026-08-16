import type { ReactNode } from 'react';

import { Box } from '../../box/feature/box';
import { DropzoneAccept } from './dropzone-accept';
import { DropzoneBody } from './dropzone-body';

export function DropzoneSurface({
  hasFiles,
  empty,
  hint,
  children,
}: {
  hasFiles: boolean;
  empty: ReactNode;
  hint: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box pos="relative" miw={0}>
      <DropzoneBody hasFiles={hasFiles} hint={hint}>
        {children}
      </DropzoneBody>
      {hasFiles ? null : empty}
      <DropzoneAccept />
    </Box>
  );
}
