import {
  Container as MantineContainer,
  type ContainerProps as MantineContainerProps,
} from '@mantine/core';
import type { ReactNode } from 'react';

import type { WithoutStyle } from '../../util/without-style';

import classes from './container.module.css';

export type ContainerProps = WithoutStyle<Pick<MantineContainerProps, 'size' | 'py'>> & {
  children?: ReactNode;
  component?: 'div' | 'main';
};

export function Container({ component = 'main', ...props }: ContainerProps) {
  return (
    <MantineContainer component={component} pos="relative" className={classes.root} {...props} />
  );
}
