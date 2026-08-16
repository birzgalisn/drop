import { Image as MantineImage, type ImageProps as MantineImageProps } from '@mantine/core';

import { RADIUS } from '../../util/radius';
import type { WithoutStyle } from '../../util/without-style';

export type ImageProps = WithoutStyle<
  Pick<MantineImageProps, 'src' | 'fit' | 'w' | 'h' | 'fallbackSrc' | 'onError'>
> &
  Pick<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'alt' | 'loading' | 'decoding' | 'draggable' | 'onLoad'
  >;

export function Image(props: ImageProps) {
  return <MantineImage radius={RADIUS.md} {...props} />;
}
