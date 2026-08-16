import { Table as MantineTable, type TableThProps as MantineTableThProps } from '@mantine/core';
import clsx from 'clsx';
import type { MouseEventHandler, ReactNode } from 'react';

import type { WithoutStyle } from '../../util/without-style';

import classes from './table-cell.module.css';

export type TableThProps = WithoutStyle<Pick<MantineTableThProps, 'w' | 'ta'>> & {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  fit?: boolean;
  onClick?: MouseEventHandler<HTMLTableCellElement>;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
};

export function TableTh({ children, className, fit, ...props }: TableThProps) {
  return (
    <MantineTable.Th
      className={clsx(fit && classes.fit, className)}
      data-fit={fit || undefined}
      {...props}
    >
      {children}
    </MantineTable.Th>
  );
}
