import type { ReactNode } from 'react';

import { Box } from '../../box/feature/box';
import type { PanelTone } from '../../panel/feature/panel';

import tones from '../../panel/ui/panel-tone.module.css';
import classes from './dropzone.module.css';

export function DropzoneFrame({ tone, children }: { tone: PanelTone; children: ReactNode }) {
  return (
    <Box className={`${classes.root} ${tones[tone]}`} p="md">
      {children}
    </Box>
  );
}
