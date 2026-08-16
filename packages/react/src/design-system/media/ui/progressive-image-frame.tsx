import type { ReactNode } from 'react';

import { Box } from '../../box/feature/box';

import classes from './progressive-image-frame.module.css';

export type ProgressiveImageFrameProps = {
  children: ReactNode;
};

export function ProgressiveImageFrame({ children }: ProgressiveImageFrameProps) {
  return (
    <Box pos="relative" w="100%" h="100%" className={classes.root}>
      {children}
    </Box>
  );
}
