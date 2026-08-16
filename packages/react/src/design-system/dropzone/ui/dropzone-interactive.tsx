import {
  Dropzone as MantineDropzone,
  type DropzoneProps as MantineDropzoneProps,
} from '@mantine/dropzone';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import type { PanelTone } from '../../panel/feature/panel';
import { useDropzoneOpenRef } from '../hooks/use-dropzone-open-ref';
import { DropzoneOpenContext } from './dropzone-open-context';
import { DropzoneSurface } from './dropzone-surface';

import tones from '../../panel/ui/panel-tone.module.css';
import '@mantine/dropzone/styles.css';
import classes from './dropzone.module.css';

export type DropzoneInteractiveProps = {
  hasFiles: boolean;
  onAddFiles: (files: File[]) => void;
  accept: MantineDropzoneProps['accept'];
  maxSize?: number;
  empty: ReactNode;
  hint: ReactNode;
  children: ReactNode;
  tone: PanelTone;
};

export function DropzoneInteractive({
  hasFiles,
  onAddFiles,
  accept,
  maxSize,
  empty,
  hint,
  tone,
  children,
}: DropzoneInteractiveProps) {
  const { openRef, open } = useDropzoneOpenRef();

  return (
    <DropzoneOpenContext.Provider value={open}>
      <MantineDropzone
        className={clsx(classes.root, classes.rootInteractive, tones[tone])}
        data-tone={tone}
        openRef={openRef}
        onDrop={onAddFiles}
        accept={accept}
        maxSize={maxSize}
        radius="md"
        p={hasFiles ? 0 : 'xl'}
        activateOnClick={!hasFiles}
        activateOnDrag
        enablePointerEvents={hasFiles}
      >
        <DropzoneSurface hasFiles={hasFiles} empty={empty} hint={hint}>
          {children}
        </DropzoneSurface>
      </MantineDropzone>
    </DropzoneOpenContext.Provider>
  );
}
