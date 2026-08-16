import { Table as MantineTable } from '@mantine/core';
import type { ReactNode } from 'react';

import { useTableContext } from '../hooks/create-table';
import type { TableRowBase } from '../util/types';
import { TableListHead } from './table-list-head';
import { TableListHeaderCell } from './table-list-header-cell';
import { TableTbody } from './table-tbody';
import { TableTd } from './table-td';
import { TableTr } from './table-tr';

import classes from './table-list.module.css';

export function TableList({
  empty = null,
  head,
  children,
}: {
  empty?: ReactNode;
  head?: ReactNode;
  children?: ReactNode;
}) {
  const table = useTableContext<TableRowBase>();
  const headerGroups = table.getHeaderGroups();
  const coreRowCount = table.getCoreRowModel().rows.length;
  const visibleColumnCount = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;
  const headerCells = head ?? (
    <>
      {headerGroups.map((headerGroup) =>
        headerGroup.headers.map((header) => (
          <TableListHeaderCell key={header.id} header={header} />
        )),
      )}
    </>
  );

  if (coreRowCount === 0) {
    return empty;
  }

  return (
    <MantineTable className={classes.list} highlightOnHover withTableBorder={false} withRowBorders>
      <TableListHead>{headerCells}</TableListHead>
      <TableTbody>
        {rows.length === 0 ? (
          <TableTr>
            <TableTd colSpan={visibleColumnCount}>{empty}</TableTd>
          </TableTr>
        ) : (
          children
        )}
      </TableTbody>
    </MantineTable>
  );
}

TableList.Head = TableListHead;
