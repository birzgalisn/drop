import { createAppColumnHelper } from '../hooks/create-table';
import type { TableRowBase } from './types';

const displayColumnDefaults = {
  enableColumnFilter: false,
  enableGlobalFilter: false,
  enableSorting: false,
} as const;

export function createTableColumnHelper<T extends TableRowBase>() {
  const helper = createAppColumnHelper<T>();

  return {
    ...helper,
    display: (column: Parameters<(typeof helper)['display']>[0]) =>
      helper.display({
        ...displayColumnDefaults,
        ...column,
      }),
  };
}
