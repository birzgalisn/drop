import { ActionIcon, Badge, Box, Progress, Stack, Text } from '@mantine/core';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { Bytes } from '@repo/shared';

import { ProgressiveImage } from '../../../design-system/media/feature/progressive-image';
import type { MergedSpaceFileItem } from '../../util/get-merged-space-files-with-uploads';
import { useUploadCardPreviewSrc } from '../hooks/use-upload-card-preview-src';

export interface UploadCardProps {
  item: MergedSpaceFileItem;
  /** Undefined while there is no upload to measure. */
  percent?: number;
  isReady: boolean;
  isError: boolean;
  spaceId?: string;
  apiBaseUrl: string;
  removing: boolean;
  onRemove: (fileId: string) => void;
}

export function UploadCard({
  item,
  percent,
  isReady,
  isError,
  spaceId,
  apiBaseUrl,
  removing,
  onRemove,
}: UploadCardProps) {
  const { lowSrc, highSrc, onLowError } = useUploadCardPreviewSrc({
    item,
    isReady,
    spaceId,
    apiBaseUrl,
  });

  return (
    <div className="drop-upload-card">
      <Stack gap={6}>
        <Box pos="relative">
          <Box pos="relative" h={140} style={{ borderRadius: 8, overflow: 'hidden' }}>
            <ProgressiveImage
              lowSrc={lowSrc}
              highSrc={highSrc}
              alt={item.name}
              height={140}
              borderRadius={8}
              onLowError={onLowError}
            />
          </Box>

          <ActionIcon
            pos="absolute"
            top={6}
            right={6}
            size="sm"
            color="red"
            variant="filled"
            radius="xl"
            loading={removing}
            onClick={() => onRemove(item.fileId)}
            aria-label={`Remove ${item.name}`}
          >
            <TrashIcon size={14} />
          </ActionIcon>

          <Box pos="absolute" bottom={6} left={6}>
            <UploadCardStatus percent={percent} isReady={isReady} isError={isError} />
          </Box>
        </Box>

        {!isReady && !isError && percent !== undefined ? (
          <Progress value={percent} size="xs" color="sand" />
        ) : null}

        <Text size="xs" truncate="end">
          {item.name}
        </Text>
        <Text size="xs" c="dimmed">
          {Bytes.format(item.byteSize)}
        </Text>
      </Stack>
    </div>
  );
}

function UploadCardStatus({
  percent,
  isReady,
  isError,
}: {
  percent?: number;
  isReady: boolean;
  isError: boolean;
}) {
  if (isError) {
    return (
      <Badge color="red" size="xs" variant="filled">
        Failed
      </Badge>
    );
  }

  if (isReady) {
    return (
      <Badge color="sand" size="xs" variant="light">
        Ready
      </Badge>
    );
  }

  return (
    <Badge color="graphite" size="xs" variant="filled">
      {percent ?? 0}%
    </Badge>
  );
}
