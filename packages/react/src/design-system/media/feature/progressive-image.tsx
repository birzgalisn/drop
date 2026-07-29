import { Box, Image } from '@mantine/core';
import { useState } from 'react';

import { MediaPlaceholder } from '../ui/media-placeholder';

export interface ProgressiveImageProps {
  lowSrc: string | null;
  highSrc?: string | null;
  alt: string;
  objectFit?: 'cover' | 'contain';
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  onLowError?: () => void;
}

interface ImageLayerProps {
  src: string;
  alt: string;
  objectFit: 'cover' | 'contain';
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  onError?: () => void;
}

function fadeInAfterPaint(onReady: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(onReady);
  });
}

function BaseImageLayer({
  src,
  alt,
  objectFit,
  width,
  height,
  borderRadius,
  onError,
}: ImageLayerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded ? (
        <MediaPlaceholder style={{ position: 'absolute', inset: 0, borderRadius }} aria-hidden />
      ) : null}
      <Image
        src={src}
        alt={alt}
        fit={objectFit}
        radius={borderRadius}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => onError?.()}
        pos="absolute"
        inset={0}
        w={width ?? '100%'}
        h={height ?? '100%'}
        display="block"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
      />
    </>
  );
}

function HiResImageLayer({
  src,
  alt,
  objectFit,
  width,
  height,
  borderRadius,
}: Omit<ImageLayerProps, 'onError'>) {
  const [opaque, setOpaque] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fit={objectFit}
      radius={borderRadius}
      decoding="async"
      draggable={false}
      onLoad={() => fadeInAfterPaint(() => setOpaque(true))}
      pos="absolute"
      inset={0}
      w={width ?? '100%'}
      h={height ?? '100%'}
      display="block"
      style={{
        opacity: opaque ? 1 : 0,
        transition: 'opacity 320ms ease',
      }}
    />
  );
}

export function ProgressiveImage({
  lowSrc,
  highSrc,
  alt,
  objectFit = 'cover',
  width,
  height,
  borderRadius,
  onLowError,
}: ProgressiveImageProps) {
  const baseUrl = lowSrc ?? highSrc ?? null;
  const hiResSrc = highSrc && highSrc !== lowSrc ? highSrc : null;

  if (!baseUrl) {
    return (
      <MediaPlaceholder
        style={{ position: 'absolute', inset: 0, width, height, borderRadius }}
        aria-hidden
      />
    );
  }

  return (
    <Box
      pos="relative"
      w={width ?? '100%'}
      h={height ?? '100%'}
      style={{
        overflow: borderRadius !== undefined ? 'hidden' : undefined,
        borderRadius,
      }}
    >
      <BaseImageLayer
        key={baseUrl}
        src={baseUrl}
        alt={hiResSrc ? '' : alt}
        objectFit={objectFit}
        width={width}
        height={height}
        borderRadius={borderRadius}
        onError={onLowError}
      />
      {hiResSrc ? (
        <HiResImageLayer
          key={hiResSrc}
          src={hiResSrc}
          alt={alt}
          objectFit={objectFit}
          width={width}
          height={height}
          borderRadius={borderRadius}
        />
      ) : null}
    </Box>
  );
}
