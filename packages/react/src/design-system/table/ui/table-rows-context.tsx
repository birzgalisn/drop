import { createContext, useContext } from 'react';

import type { TableRowBase } from '../util/types';

export const TableRowsContext = createContext<readonly TableRowBase[] | null>(null);

export function useTableRows<T extends TableRowBase = TableRowBase>() {
  const rows = useContext(TableRowsContext);
  if (!rows) {
    throw new Error('`useTableRows` must be used within `Table`');
  }
  return rows as readonly T[];
}
