import type { FilterFn } from '@tanstack/react-table';

import type { TableFeatures } from '../hooks/create-table';
import type { TableRowBase } from './types';

export function rowFilter<T extends TableRowBase>(
  predicate: (row: T) => boolean,
): FilterFn<TableFeatures, T> {
  return (row) => predicate(row.original);
}
