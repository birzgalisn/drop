import { Table as MantineTable } from '@mantine/core';
import clsx from 'clsx';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

import type { TableRowBase } from '../util/types';
import { TableRowContext } from './table-row-context';

import classes from './table-row.module.css';

export function TableRow<T extends TableRowBase>({
  row,
  onOpen,
  'aria-label': ariaLabel,
  style,
  children,
}: {
  row: T;
  onOpen?: () => void;
  'aria-label'?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const handleClick = () => {
    onOpen?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
    const keyHandlerMap: {
      [key: string]: ((event: KeyboardEvent<HTMLTableRowElement>) => void) | undefined;
    } = {
      Enter: handleClick,
      ' ': (keyEvent) => {
        keyEvent.preventDefault();
        handleClick();
      },
    };

    keyHandlerMap[event.key]?.(event);
  };

  const openProps = onOpen
    ? {
        className: clsx(classes.row, classes.rowInteractive),
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': ariaLabel,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      }
    : { className: classes.row };

  return (
    <TableRowContext.Provider value={{ row }}>
      <MantineTable.Tr style={style} {...openProps}>
        {children}
      </MantineTable.Tr>
    </TableRowContext.Provider>
  );
}
