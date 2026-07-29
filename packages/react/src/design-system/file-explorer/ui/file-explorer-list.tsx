import { Box, Checkbox, Group, Image, Stack, Text } from '@mantine/core';
import { Bytes, Dates } from '@repo/shared';
import clsx from 'clsx';
import { useState } from 'react';

import { DotSeparator } from '../../dot-separator/feature/dot-separator';
import { MediaPlaceholder } from '../../media/ui/media-placeholder';
import type { FileExplorerItem } from '../types';

import classes from '../feature/file-explorer.module.css';

const CHECKBOX_STYLES = {
  input: { transition: 'none' },
  icon: { transition: 'none' },
} as const;

export interface FileExplorerListProps {
  files: FileExplorerItem[];
  embedded: boolean;
  selected: ReadonlySet<string>;
  onToggleOne: (fileId: string) => void;
  onOpenImage: (fileId: string) => void;
}

export function FileExplorerList({
  files,
  embedded,
  selected,
  onToggleOne,
  onOpenImage,
}: FileExplorerListProps) {
  return (
    <Box className={clsx(classes.list, embedded && classes.listEmbedded)}>
      {files.map((file, index) => (
        <FileExplorerRow
          key={file.id}
          file={file}
          index={index}
          embedded={embedded}
          isSelected={selected.has(file.id)}
          onToggleOne={onToggleOne}
          onOpenImage={onOpenImage}
        />
      ))}
    </Box>
  );
}

function FileExplorerRow({
  file,
  index,
  embedded,
  isSelected,
  onToggleOne,
  onOpenImage,
}: {
  file: FileExplorerItem;
  index: number;
  embedded: boolean;
  isSelected: boolean;
  onToggleOne: (fileId: string) => void;
  onOpenImage: (fileId: string) => void;
}) {
  const canView = Boolean(file.viewUrl);

  const open = () => {
    if (canView) {
      onOpenImage(file.id);
    }
  };

  return (
    <Box
      className={clsx(classes.row, canView && classes.rowViewable)}
      role={canView ? 'button' : undefined}
      tabIndex={canView ? 0 : undefined}
      aria-label={canView ? `View ${file.name}` : undefined}
      onClick={canView ? open : undefined}
      onKeyDown={
        canView
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
              }
            }
          : undefined
      }
    >
      <Group
        gap="sm"
        wrap="nowrap"
        px={embedded ? 0 : 'md'}
        py={10}
        style={{
          borderTop: index === 0 ? undefined : '1px solid var(--drop-border)',
        }}
      >
        <Checkbox
          checked={isSelected}
          disabled={file.selectable === false}
          onChange={() => onToggleOne(file.id)}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          aria-label={`Select ${file.name}`}
          styles={CHECKBOX_STYLES}
        />
        <RowThumb file={file} />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={500} truncate="end">
            {file.name}
          </Text>
          <RowMeta file={file} />
        </Stack>
      </Group>
    </Box>
  );
}

function RowThumb({ file }: { file: FileExplorerItem }) {
  const [loadedThumbUrl, setLoadedThumbUrl] = useState<string | null>(null);
  const loaded = file.thumbUrl != null && loadedThumbUrl === file.thumbUrl;

  if (!file.thumbUrl) {
    return (
      <MediaPlaceholder w={40} h={40} style={{ flexShrink: 0, borderRadius: 6 }} aria-hidden />
    );
  }

  return (
    <Box pos="relative" w={40} h={40} style={{ flexShrink: 0 }}>
      {!loaded ? (
        <MediaPlaceholder
          w={40}
          h={40}
          style={{ position: 'absolute', inset: 0, borderRadius: 6 }}
          aria-hidden
        />
      ) : null}
      <Image
        src={file.thumbUrl}
        w={40}
        h={40}
        alt=""
        fit="cover"
        radius={6}
        decoding="async"
        loading="lazy"
        draggable={false}
        onLoad={() => setLoadedThumbUrl(file.thumbUrl ?? null)}
        style={{
          flexShrink: 0,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />
    </Box>
  );
}

function RowMeta({ file }: { file: FileExplorerItem }) {
  const parts = [
    <Text key="date" size="xs" c="dimmed">
      {Dates.format(file.createdAt)}
    </Text>,
    <Text key="size" size="xs" c="dimmed">
      {Bytes.format(file.byteSize)}
    </Text>,
  ];

  if (file.statusLabel) {
    parts.push(
      <Text key="status" size="xs" c="dimmed">
        {file.statusLabel}
      </Text>,
    );
  }

  return (
    <Group gap="xs" wrap="wrap">
      {parts.flatMap((part, index) =>
        index === 0 ? [part] : [<DotSeparator key={`sep-${index}`} />, part],
      )}
    </Group>
  );
}
