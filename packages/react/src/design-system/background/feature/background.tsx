import { Box } from '../../box/feature/box';

import classes from './background.module.css';

/** Quiet atmospheric field behind full-page surfaces. */
export function Background() {
  return (
    <Box className={classes.root} aria-hidden>
      <Box className={`${classes.glow} ${classes.glowA}`} />
      <Box className={`${classes.glow} ${classes.glowB}`} />
      <Box className={classes.veil} />
    </Box>
  );
}
