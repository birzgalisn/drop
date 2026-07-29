import { Box, Image, Text, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ArrowUpIcon } from '@phosphor-icons/react/ArrowUp';
import { useState } from 'react';

import type { UploadSamplesPreview } from '../types';

import samplesStyles from './upload-samples.module.css';

export interface UploadSamplesProps {
  previews: UploadSamplesPreview[];
  load: () => Promise<File[]>;
  onAddFiles: (files: File[]) => Promise<void>;
}

/** Below-dropzone CTA that injects demo files (landing only, hidden once files exist). */
export function UploadSamples({ previews, load, onAddFiles }: UploadSamplesProps) {
  const [loading, setLoading] = useState(false);

  if (previews.length === 0) {
    return null;
  }

  const fanClass = (index: number) => {
    if (index === 0) {
      return `${samplesStyles.thumb} ${samplesStyles.thumbLeft}`;
    }

    if (index === previews.length - 1 && previews.length > 1) {
      return `${samplesStyles.thumb} ${samplesStyles.thumbRight}`;
    }

    return `${samplesStyles.thumb} ${samplesStyles.thumbCenter}`;
  };

  const handleClick = async () => {
    setLoading(true);

    try {
      await onAddFiles(await load());
    } catch (error) {
      notifications.show({
        color: 'red',
        message: error instanceof Error ? error.message : 'Could not load sample images',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnstyledButton
      className={samplesStyles.root}
      disabled={loading}
      aria-label="Try with sample images"
      onClick={() => void handleClick()}
    >
      <Box component="span" className={samplesStyles.arrow} aria-hidden>
        <ArrowUpIcon size={16} weight="bold" />
      </Box>
      <Box component="span" className={samplesStyles.fan} aria-hidden>
        {previews.map((preview, index) => (
          <Image
            key={preview.src}
            className={fanClass(index)}
            src={preview.src}
            alt={preview.alt ?? 'Sample image'}
            fit="cover"
            draggable={false}
          />
        ))}
      </Box>
      <Text component="span" className={samplesStyles.label} size="sm">
        Try with sample images
      </Text>
    </UnstyledButton>
  );
}
