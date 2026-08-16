import { useSyncExternalStore } from 'react';

import type { TableRowBase } from '../util/types';
import { useTableContext } from './create-table';

function useTableAtom<T>(atom: {
  get: () => T;
  subscribe: (listener: (value: T) => void) => { unsubscribe: () => void };
}) {
  return useSyncExternalStore(
    (onChange) => atom.subscribe(onChange).unsubscribe,
    () => atom.get(),
    () => atom.get(),
  );
}

export function useTableGlobalFilter() {
  const table = useTableContext<TableRowBase>();
  const globalFilter = useTableAtom(table.atoms.globalFilter);
  return typeof globalFilter === 'string' ? globalFilter : '';
}
