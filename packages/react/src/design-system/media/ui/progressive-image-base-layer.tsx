import { useState } from 'react';

import { MediaPlaceholder } from './media-placeholder';
import { ProgressiveImageLayer, type ProgressiveImageLayerProps } from './progressive-image-layer';

export type ProgressiveImageBaseLayerProps = Omit<
  ProgressiveImageLayerProps,
  'opaque' | 'onLoad' | 'className'
>;

export function ProgressiveImageBaseLayer({
  src,
  alt,
  fit,
  onError,
  'aria-hidden': ariaHidden,
}: ProgressiveImageBaseLayerProps) {
  const [loaded, setLoaded] = useState(false);

  const image = (
    <ProgressiveImageLayer
      src={src}
      alt={alt}
      fit={fit}
      opaque={loaded}
      aria-hidden={ariaHidden}
      onLoad={() => setLoaded(true)}
      onError={onError}
    />
  );

  if (!loaded) {
    return (
      <>
        <MediaPlaceholder pos="absolute" inset={0} aria-hidden />
        {image}
      </>
    );
  }

  return image;
}
