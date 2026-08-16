import type { ReactNode } from 'react';

import { Group } from '../../group/feature/group';
import { TableToolbarDelete } from './table-toolbar-delete';
import { TableToolbarZip } from './table-toolbar-zip';

export function TableToolbarActions({ children }: { children?: ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <Group gap="regular" wrap="nowrap">
      {children}
    </Group>
  );
}

TableToolbarActions.Zip = TableToolbarZip;
TableToolbarActions.Delete = TableToolbarDelete;
