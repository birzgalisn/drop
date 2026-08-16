import { Box, type BoxProps } from '../../box/feature/box';

import classes from './media-placeholder.module.css';

export type MediaPlaceholderProps = Pick<BoxProps, 'w' | 'h' | 'pos' | 'inset' | 'flex'> & {
  'aria-hidden'?: boolean;
};

export function MediaPlaceholder(props: MediaPlaceholderProps) {
  return <Box className={classes.root} {...props} />;
}
