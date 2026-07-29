import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { Dropzone, type FileWithPath } from '@mantine/dropzone';
import { SpaceConfig } from '@repo/shared';
import { useRef, type ReactNode } from 'react';

import '@mantine/dropzone/styles.css';
import styles from './space-files-dropzone.module.css';

const DROPZONE_ACCEPT: Record<string, string[]> = Object.fromEntries(
  Object.entries(SpaceConfig.DROPZONE_ACCEPT).map(([mime, extensions]) => [mime, [...extensions]]),
);

export interface SpaceFilesDropzoneProps {
  hasFiles: boolean;
  onAddFiles: (files: File[]) => void;
  /** File table / grid shown inside the dropzone when there are files. */
  children: ReactNode;
}

/**
 * Dropzone that doubles as the files container. Empty → pick prompt; with files →
 * children render inside and new files can still be dropped or browsed.
 */
export function SpaceFilesDropzone({ hasFiles, onAddFiles, children }: SpaceFilesDropzoneProps) {
  const openRef = useRef<() => void>(null);

  return (
    <Dropzone
      className={styles.root}
      openRef={openRef}
      onDrop={(dropped: FileWithPath[]) => onAddFiles(dropped)}
      accept={DROPZONE_ACCEPT}
      maxSize={SpaceConfig.FILE_MAX_BYTES}
      radius="md"
      p={hasFiles ? 0 : 'xl'}
      bg="var(--drop-surface)"
      acceptColor="sand"
      activateOnClick={!hasFiles}
      activateOnDrag
      enablePointerEvents={hasFiles}
      styles={{
        root: {
          borderColor: 'var(--drop-border)',
          borderStyle: 'dashed',
          borderWidth: 1,
          position: 'relative',
          transition: 'border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease',
        },
      }}
    >
      <Box pos="relative">
        {/* Always mounted so the file list keeps its React tree across empty ↔ files. */}
        <Stack
          gap="sm"
          p={hasFiles ? 'md' : 0}
          display={hasFiles ? undefined : 'none'}
          aria-hidden={!hasFiles}
        >
          {children}
          {hasFiles ? (
            <Group justify="center" gap={6} wrap="wrap" pt={4}>
              <Text size="sm" c="dimmed" ta="center">
                Drop more images here, or
              </Text>
              <Button size="compact-sm" variant="subtle" onClick={() => openRef.current?.()}>
                browse
              </Button>
            </Group>
          ) : null}
        </Stack>

        {!hasFiles ? (
          <Stack align="center" gap="xs" mih={180} justify="center">
            <Text size="lg" fw={600}>
              Drop images here
            </Text>
            <Text size="sm" c="dimmed" ta="center" maw={360}>
              or click to browse — JPEG &amp; PNG, up to {SpaceConfig.FILE_MAX_MIB} MiB each,{' '}
              {SpaceConfig.MAX_FILES} files max
            </Text>
          </Stack>
        ) : null}

        <Dropzone.Accept>
          <Box className={styles.accept} aria-hidden>
            <Text size="sm" fw={600} c="sand.3">
              Drop to add
            </Text>
          </Box>
        </Dropzone.Accept>
      </Box>
    </Dropzone>
  );
}
