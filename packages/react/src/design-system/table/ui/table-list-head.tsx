import type { ReactNode } from 'react';

import { TableTh } from './table-th';
import { TableThead } from './table-thead';
import { TableTr } from './table-tr';

export function TableListHead({ children }: { children?: ReactNode }) {
  return (
    <TableThead>
      <TableTr>{children}</TableTr>
    </TableThead>
  );
}

TableListHead.Th = TableTh;
