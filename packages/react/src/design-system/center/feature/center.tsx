import { Center as MantineCenter, type CenterProps as MantineCenterProps } from '@mantine/core';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import type { WithoutStyle } from '../../util/without-style';

import classes from './center.module.css';

export type CenterProps = WithoutStyle<Pick<MantineCenterProps, 'mih' | 'p' | 'pos'>> & {
  className?: string;
  component?: 'div' | 'main';
  children?: ReactNode;
  role?: 'status';
  'aria-live'?: 'polite';
};

export function Center({ pos = 'relative', className, ...props }: CenterProps) {
  return <MantineCenter pos={pos} className={clsx(classes.root, className)} {...props} />;
}
