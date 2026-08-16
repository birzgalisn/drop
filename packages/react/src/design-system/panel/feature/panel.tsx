import type { ReactNode } from 'react';

import { Stack, type StackProps } from '../../stack/feature/stack';

import tones from '../ui/panel-tone.module.css';
import classes from './panel.module.css';

export type PanelTone = 'surface' | 'elevated';

export type PanelProps = Pick<StackProps, 'gap'> & {
  tone?: PanelTone;
  children: ReactNode;
};

/** Bordered, padded surface used for share/form chrome. */
export function Panel({ tone = 'elevated', children, gap = 'regular' }: PanelProps) {
  return (
    <Stack gap={gap} p="md" className={`${classes.root} ${tones[tone]}`}>
      {children}
    </Stack>
  );
}
