import { ActionIcon, Box, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { CaretLeftIcon } from '@phosphor-icons/react/CaretLeft';
import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';
import { XIcon } from '@phosphor-icons/react/X';
import { Dates } from '@repo/shared';
import { useEffect, useEffectEvent } from 'react';

import { ProgressiveImage } from '../../media/feature/progressive-image';
import type { FileExplorerItem } from '../types';

const OVERLAY_ICON_STYLE = {
  zIndex: 3,
  background: 'rgba(0, 0, 0, 0.35)',
  color: '#fff',
} as const;

export interface FileExplorerImageViewProps {
  /** Null closes the lightbox. */
  file: FileExplorerItem | null;
  canNavigate: boolean;
  getDownloadHref?: (file: FileExplorerItem) => string | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function FileExplorerImageView({
  file,
  canNavigate,
  getDownloadHref,
  onClose,
  onPrev,
  onNext,
}: FileExplorerImageViewProps) {
  const opened = file !== null;

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onNext();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  });

  useEffect(() => {
    if (!opened) {
      return;
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="90%"
      padding="sm"
      radius="md"
      styles={{ content: { maxWidth: 960 } }}
      overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
    >
      {file ? (
        <Box pos="relative" tabIndex={-1} data-autofocus style={{ outline: 'none' }}>
          <Box
            pos="relative"
            style={{
              width: '100%',
              height: 'min(78vh, 680px)',
              background: 'var(--drop-elevated)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <StageImage key={file.id} file={file} />

            {canNavigate ? (
              <>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  onClick={onPrev}
                  aria-label="Previous image"
                  style={{
                    ...OVERLAY_ICON_STYLE,
                    position: 'absolute',
                    top: '50%',
                    left: 8,
                    transform: 'translateY(-50%)',
                  }}
                >
                  <CaretLeftIcon size={20} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  onClick={onNext}
                  aria-label="Next image"
                  style={{
                    ...OVERLAY_ICON_STYLE,
                    position: 'absolute',
                    top: '50%',
                    right: 8,
                    transform: 'translateY(-50%)',
                  }}
                >
                  <CaretRightIcon size={20} />
                </ActionIcon>
              </>
            ) : null}

            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={onClose}
              aria-label="Close image view"
              style={{ ...OVERLAY_ICON_STYLE, position: 'absolute', top: 8, right: 8 }}
            >
              <XIcon size={18} />
            </ActionIcon>

            <Caption file={file} downloadHref={getDownloadHref?.(file) ?? null} />
          </Box>
        </Box>
      ) : null}
    </Modal>
  );
}

function StageImage({ file }: { file: FileExplorerItem }) {
  const thumbUrl = file.thumbUrl ?? null;
  const viewUrl = file.viewUrl ?? null;

  return (
    <ProgressiveImage
      lowSrc={thumbUrl ?? viewUrl}
      highSrc={viewUrl && viewUrl !== thumbUrl ? viewUrl : null}
      alt={file.name}
      objectFit="contain"
      width="100%"
      height="100%"
    />
  );
}

function Caption({ file, downloadHref }: { file: FileExplorerItem; downloadHref: string | null }) {
  return (
    <Box
      pos="absolute"
      left={0}
      right={0}
      bottom={0}
      p="md"
      style={{
        zIndex: 2,
        background:
          'linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.35) 55%, transparent 100%)',
      }}
    >
      <Group justify="space-between" align="flex-end" wrap="nowrap" gap="md">
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={500} truncate="end" c="#fff">
            {file.name}
          </Text>
          <Text size="xs" c="rgba(255, 255, 255, 0.72)">
            {Dates.format(file.createdAt)}
          </Text>
        </Stack>
        {downloadHref ? (
          <Button
            size="compact-sm"
            variant="subtle"
            color="gray"
            component="a"
            href={downloadHref}
            download={file.name}
            styles={{
              root: {
                color: 'rgba(255, 255, 255, 0.88)',
                background: 'rgba(255, 255, 255, 0.12)',
              },
            }}
          >
            Download
          </Button>
        ) : null}
      </Group>
    </Box>
  );
}
