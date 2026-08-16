import { Paper as MantinePaper, type PaperProps as MantinePaperProps } from '@mantine/core';
import type { ReactNode } from 'react';

import type { WithoutStyle } from '../../util/without-style';

import classes from './paper.module.css';

export type PaperProps = WithoutStyle<Pick<MantinePaperProps, 'p' | 'w' | 'bg' | 'withBorder'>> & {
  children?: ReactNode;
};

export function Paper({ withBorder = true, ...props }: PaperProps) {
  return (
    <MantinePaper
      radius="md"
      shadow="sm"
      withBorder={withBorder}
      className={classes.root}
      {...props}
    />
  );
}
