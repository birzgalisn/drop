import type { CSSProperties, ReactNode } from 'react';

import { TableRow } from '../../table/ui/table-row';
import type { TableRowBase } from '../../table/util/types';
import { useImageViewActions } from './image-view-actions-context';

export function FileTableRow<T extends TableRowBase>({
  row,
  style,
  children,
}: {
  row: T;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const { open, isViewable } = useImageViewActions();
  const canOpen = isViewable(row.id);

  const handleOpen = () => {
    open(row.id);
  };

  return (
    <TableRow
      row={row}
      onOpen={canOpen ? handleOpen : undefined}
      aria-label={canOpen ? 'View' : undefined}
      style={style}
    >
      {children}
    </TableRow>
  );
}
