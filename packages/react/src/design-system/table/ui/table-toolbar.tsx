import type { ReactNode } from 'react';

import { Group } from '../../group/feature/group';
import { useTableContext } from '../hooks/create-table';
import type { TableRowBase } from '../util/types';
import { TableToolbarActions } from './table-toolbar-actions';
import { TableToolbarBar } from './table-toolbar-bar';
import { TableToolbarDelete } from './table-toolbar-delete';
import { TableToolbarSearch } from './table-toolbar-search';
import { TableToolbarSelectAll } from './table-toolbar-select-all';
import { TableToolbarSelection } from './table-toolbar-selection';
import { TableToolbarZip } from './table-toolbar-zip';

export function TableToolbar({ children = <TableToolbarSearch /> }: { children?: ReactNode }) {
  const table = useTableContext<TableRowBase>();
  const coreRowCount = table.getCoreRowModel().rows.length;

  if (coreRowCount === 0) {
    return null;
  }

  return (
    <Group align="center" wrap="nowrap" gap="regular">
      {children}
    </Group>
  );
}

TableToolbar.Search = TableToolbarSearch;
TableToolbar.Bar = TableToolbarBar;
TableToolbar.Selection = TableToolbarSelection;
TableToolbar.Selection.SelectAll = TableToolbarSelectAll;
TableToolbar.Actions = TableToolbarActions;
TableToolbar.Actions.Zip = TableToolbarZip;
TableToolbar.Actions.Delete = TableToolbarDelete;
TableToolbar.Zip = TableToolbarZip;
TableToolbar.Delete = TableToolbarDelete;
