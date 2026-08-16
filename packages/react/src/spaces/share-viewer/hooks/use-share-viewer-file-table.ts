import type { FileTableOptions } from '../../../design-system/file-table/feature/file-table';
import { useDefaultTable } from '../../../design-system/table/feature/table';
import type { TableRowBase } from '../../../design-system/table/util/types';

export function useShareViewerFileTable<T extends TableRowBase>({
  rows,
}: {
  rows: T[];
}): FileTableOptions<T> {
  const table = useDefaultTable({ rows });
  const initialState = {
    columnFilters: [{ id: 'status', value: true }],
    columnVisibility: { status: false },
  };

  return {
    ...table,
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    initialState,
  };
}
