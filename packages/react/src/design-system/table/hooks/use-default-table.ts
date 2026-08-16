import type { TableOptionsFor, TableRowBase } from '../util/types';

export function useDefaultTable<T extends TableRowBase>(_options: {
  rows: T[];
}): TableOptionsFor<T> {
  return {
    enableRowSelection: (row) => row.original.selectable !== false,
  };
}
