import type { ReactNode } from 'react';

import { Stack } from '../../stack/feature/stack';
import type { TableInstance } from '../hooks/create-table';
import { TableList } from '../ui/table-list';
import { TableRow } from '../ui/table-row';
import { TableRowsContext } from '../ui/table-rows-context';
import { TableToolbar } from '../ui/table-toolbar';
import type { TableRowBase } from '../util/types';

export type { TableOptionsFor, TableRowBase, UseTable } from '../util/types';
export type { TableInstance, TableFeatures } from '../hooks/create-table';
export { createTableColumnHelper } from '../util/create-table-column-helper';
export { rowFilter } from '../util/row-filter';
export { useDefaultTable } from '../hooks/use-default-table';
export { useTableEngine } from '../hooks/use-table-engine';
export { useTableContext } from '../hooks/create-table';
export { useTableRowContext } from '../ui/table-row-context';
export { useTableRows } from '../ui/table-rows-context';

export function Table<T extends TableRowBase>({
  table,
  children,
}: {
  table: TableInstance<T>;
  children: ReactNode;
}) {
  const rows = table.getFilteredRowModel().rows.map((row) => row.original);

  return (
    <table.AppTable>
      <TableRowsContext.Provider value={rows}>
        <Stack gap="regular" miw={0}>
          {children}
        </Stack>
      </TableRowsContext.Provider>
    </table.AppTable>
  );
}

Table.Toolbar = TableToolbar;
Table.Toolbar.Search = TableToolbar.Search;
Table.Toolbar.Bar = TableToolbar.Bar;
Table.Toolbar.Selection = TableToolbar.Selection;
Table.Toolbar.Actions = TableToolbar.Actions;
Table.Toolbar.Zip = TableToolbar.Zip;
Table.Toolbar.Delete = TableToolbar.Delete;
Table.List = TableList;
Table.Row = TableRow;
