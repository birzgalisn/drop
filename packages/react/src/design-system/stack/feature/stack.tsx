import { Stack as MantineStack, type StackProps as MantineStackProps } from '@mantine/core';
import type { ReactNode } from 'react';

import { GAP, type Gap } from '../../util/gap';
import type { WithoutStyle } from '../../util/without-style';

export type StackProps = WithoutStyle<
  Pick<
    MantineStackProps,
    'align' | 'justify' | 'flex' | 'miw' | 'mih' | 'maw' | 'p' | 'display' | 'pt' | 'ta'
  >
> & {
  gap?: Gap;
  className?: string;
  children?: ReactNode;
  'aria-hidden'?: boolean;
};

export function Stack({ gap = 'regular', ...props }: StackProps) {
  return <MantineStack gap={GAP[gap]} {...props} />;
}
