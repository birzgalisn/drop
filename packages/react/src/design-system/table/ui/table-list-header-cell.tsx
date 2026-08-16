import type { Header } from '@tanstack/react-table';

import { type TableFeatures, useTableContext } from '../hooks/create-table';
import type { TableRowBase } from '../util/types';
import { TableTh } from './table-th';

import classes from './table-list-header-cell.module.css';

export function TableListHeaderCell({ header }: { header: Header<TableFeatures, TableRowBase> }) {
  const table = useTableContext<TableRowBase>();
  const canSort = header.column.getCanSort();
  const sorted = header.column.getIsSorted();
  const sortMark = sorted === 'asc' ? ' ↑' : sorted === 'desc' ? ' ↓' : '';
  const handleSort = header.column.getToggleSortingHandler();

  return (
    <TableTh
      w={header.column.getSize()}
      fit={header.column.columnDef.meta?.fit}
      className={canSort ? classes.sort : undefined}
      onClick={canSort ? handleSort : undefined}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
    >
      <table.FlexRender header={header} />
      {canSort ? sortMark : null}
    </TableTh>
  );
}
