import type { ReactNode } from 'react';

import { Group } from '../../group/feature/group';
import { TableToolbarActions } from './table-toolbar-actions';
import { TableToolbarSelection } from './table-toolbar-selection';

export function TableToolbarBar({
  children = (
    <>
      <TableToolbarSelection />
      <TableToolbarActions />
    </>
  ),
}: {
  children?: ReactNode;
}) {
  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      {children}
    </Group>
  );
}

TableToolbarBar.Selection = TableToolbarSelection;
TableToolbarBar.Actions = TableToolbarActions;
