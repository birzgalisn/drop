import { Box } from '@mantine/core';

import classes from './floaty-background.module.css';

/** Quiet atmospheric field behind full-page surfaces. */
export function FloatyBackground() {
  return (
    <Box className={classes.root} aria-hidden>
      <Box className={`${classes.glow} ${classes.glowA}`} />
      <Box className={`${classes.glow} ${classes.glowB}`} />
      <Box className={classes.veil} />
    </Box>
  );
}
