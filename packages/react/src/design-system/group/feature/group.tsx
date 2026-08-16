import { Group as MantineGroup, type GroupProps as MantineGroupProps } from '@mantine/core';
import type { ReactNode } from 'react';

import { GAP, type Gap } from '../../util/gap';
import type { WithoutStyle } from '../../util/without-style';

export type GroupProps = WithoutStyle<
  Pick<
    MantineGroupProps,
    'justify' | 'align' | 'wrap' | 'grow' | 'px' | 'py' | 'pt' | 'flex' | 'miw'
  >
> & {
  gap?: Gap;
  className?: string;
  children?: ReactNode;
};

export function Group({ gap = 'regular', ...props }: GroupProps) {
  return <MantineGroup gap={GAP[gap]} {...props} />;
}
