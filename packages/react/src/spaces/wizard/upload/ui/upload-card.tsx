import { Badge, Progress } from '@mantine/core';
import { TrashIcon } from '@phosphor-icons/react/Trash';
import { Bytes } from '@repo/shared';

import { Box } from '../../../../design-system/box/feature/box';
import { IconButton } from '../../../../design-system/icon-button/feature/icon-button';
import { ProgressiveImage } from '../../../../design-system/media/feature/progressive-image';
import { Stack } from '../../../../design-system/stack/feature/stack';
import { Text } from '../../../../design-system/text/feature/text';
import { ICON_SIZE } from '../../../../design-system/util/icon-size';
import type { MergedSpaceFileItem } from '../../../files/util/get-merged-space-files-with-uploads';
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
  const { src, preview, onPreviewError } = useUploadCardPreviewSrc({
    item,
    isReady,
    spaceId,
    apiBaseUrl,
  });

  return (
    <Stack gap="regular">
      <Box pos="relative">
        <Box pos="relative" h={140}>
          <ProgressiveImage
            src={src}
            preview={preview}
            alt={item.name}
            onPreviewError={onPreviewError}
          />
        </Box>

        <Box pos="absolute" top={6} right={6}>
          <IconButton
            variant="solid"
            tone="danger"
            loading={removing}
            onClick={() => onRemove(item.fileId)}
            aria-label={`Remove ${item.name}`}
          >
            <TrashIcon size={ICON_SIZE.md} />
          </IconButton>
        </Box>

        <Box pos="absolute" bottom={6} left={6}>
          <UploadCardStatus percent={percent} isReady={isReady} isError={isError} />
        </Box>
      </Box>

      {!isReady && !isError && percent !== undefined ? (
        <Progress value={percent} size="xs" color="sand" />
      ) : null}

      <Stack gap="tight">
        <Text variant="label" truncate>
          {item.name}
        </Text>
        <Text>{Bytes.format(item.byteSize)}</Text>
      </Stack>
    </Stack>
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
