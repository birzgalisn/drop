import { Box, type BoxProps } from '@mantine/core';

export type MediaPlaceholderProps = BoxProps;

export function MediaPlaceholder({ className, ...rest }: MediaPlaceholderProps) {
  return <Box className={className ?? 'drop-media-placeholder'} {...rest} />;
}
