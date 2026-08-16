import { Table as MantineTable, type TableTdProps as MantineTableTdProps } from '@mantine/core';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import type { WithoutStyle } from '../../util/without-style';

import classes from './table-cell.module.css';

export type TableTdProps = WithoutStyle<Pick<MantineTableTdProps, 'w' | 'ta'>> & {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  fit?: boolean;
};

export function TableTd({ children, className, fit, ...props }: TableTdProps) {
  return (
    <MantineTable.Td
      className={clsx(fit && classes.fit, className)}
      data-fit={fit || undefined}
      {...props}
    >
      {children}
    </MantineTable.Td>
  );
}
