import type { ReactNode } from 'react';

import { Stack } from '../../stack/feature/stack';

export function DropzoneBody({
  hasFiles,
  hint,
  children,
}: {
  hasFiles: boolean;
  hint: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stack
      gap="regular"
      p={hasFiles ? 'md' : 0}
      display={hasFiles ? undefined : 'none'}
      aria-hidden={!hasFiles}
    >
      {children}
      {hasFiles ? hint : null}
    </Stack>
  );
}
