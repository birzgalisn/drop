import clsx from 'clsx';

import { Box } from '../../box/feature/box';
import { Image, type ImageProps } from '../../image/feature/image';

import classes from './progressive-image-layer.module.css';

export type ProgressiveImageLayerProps = Pick<
  ImageProps,
  'src' | 'alt' | 'fit' | 'onLoad' | 'onError'
> & {
  opaque: boolean;
  className?: string;
  'aria-hidden'?: boolean;
};

export function ProgressiveImageLayer({
  opaque,
  className,
  'aria-hidden': ariaHidden,
  ...image
}: ProgressiveImageLayerProps) {
  return (
    <Box
      pos="absolute"
      inset={0}
      aria-hidden={ariaHidden}
      className={clsx(classes.layer, className, opaque && classes.opaque)}
    >
      <Image w="100%" h="100%" decoding="async" draggable={false} {...image} />
    </Box>
  );
}
