import { useState } from 'react';

import { fadeInAfterPaint } from '../util/fade-in-after-paint';
import { ProgressiveImageLayer, type ProgressiveImageLayerProps } from './progressive-image-layer';

import classes from './progressive-image-hi-res-layer.module.css';

export type ProgressiveImageHiResLayerProps = Omit<
  ProgressiveImageLayerProps,
  'opaque' | 'onLoad' | 'onError' | 'className'
>;

export function ProgressiveImageHiResLayer(props: ProgressiveImageHiResLayerProps) {
  const [opaque, setOpaque] = useState(false);

  const handleLoad = () => {
    fadeInAfterPaint(() => setOpaque(true));
  };

  return (
    <ProgressiveImageLayer
      {...props}
      className={classes.root}
      opaque={opaque}
      onLoad={handleLoad}
    />
  );
}
