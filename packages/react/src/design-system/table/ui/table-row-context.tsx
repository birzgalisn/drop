import { createContext, useContext } from 'react';

import type { TableRowBase } from '../util/types';

export const TableRowContext = createContext<{ row: TableRowBase } | null>(null);

export function useTableRowContext() {
  const ctx = useContext(TableRowContext);
  if (!ctx) {
    throw new Error('`useTableRowContext` must be used within `Table.Row`');
  }
  return ctx;
}
