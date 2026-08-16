import { Box as MantineBox, type BoxProps as MantineBoxProps } from '@mantine/core';
import type { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';

import type { WithoutStyle } from '../../util/without-style';

type BoxComponent = 'div' | 'span' | 'main';

export type BoxProps = WithoutStyle<
  Pick<
    MantineBoxProps,
    | 'pos'
    | 'w'
    | 'h'
    | 'mih'
    | 'miw'
    | 'flex'
    | 'display'
    | 'inset'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'p'
  >
> & {
  className?: string;
  component?: BoxComponent;
  children?: ReactNode;
  role?: string;
  tabIndex?: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  'data-autofocus'?: boolean;
};

export function Box(props: BoxProps) {
  return <MantineBox {...props} />;
}
