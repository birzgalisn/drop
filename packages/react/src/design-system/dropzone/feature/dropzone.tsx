import type { DropzoneProps as MantineDropzoneProps } from '@mantine/dropzone';
import type { ReactNode } from 'react';

import type { PanelTone } from '../../panel/feature/panel';
import { DROPZONE_ACCEPT } from '../constants/dropzone-accept';
import { DropzoneAccept } from '../ui/dropzone-accept';
import { DropzoneEmpty } from '../ui/dropzone-empty';
import { DropzoneFrame } from '../ui/dropzone-frame';
import { DropzoneHint } from '../ui/dropzone-hint';
import { DropzoneInteractive } from '../ui/dropzone-interactive';

export { useDropzoneOpen } from '../ui/dropzone-open-context';

export type DropzoneProps = {
  hasFiles: boolean;
  children: ReactNode;
  onAddFiles?: (files: File[]) => void;
  accept?: MantineDropzoneProps['accept'];
  maxSize?: number;
  empty?: ReactNode;
  hint?: ReactNode;
  tone?: PanelTone;
};

export function Dropzone({
  hasFiles,
  children,
  onAddFiles,
  accept = DROPZONE_ACCEPT,
  maxSize,
  empty = <DropzoneEmpty />,
  hint = <DropzoneHint />,
  tone = 'surface',
}: DropzoneProps) {
  if (!onAddFiles) {
    return <DropzoneFrame tone={tone}>{children}</DropzoneFrame>;
  }

  return (
    <DropzoneInteractive
      hasFiles={hasFiles}
      onAddFiles={onAddFiles}
      accept={accept}
      maxSize={maxSize}
      empty={empty}
      hint={hint}
      tone={tone}
    >
      {children}
    </DropzoneInteractive>
  );
}

Dropzone.Empty = DropzoneEmpty;
Dropzone.Hint = DropzoneHint;
Dropzone.Accept = DropzoneAccept;
