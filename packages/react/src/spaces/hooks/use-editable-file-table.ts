import type { FileTableOptions } from '../../design-system/file-table/feature/file-table';
import { useDefaultTable } from '../../design-system/table/feature/table';
import type { TableRowBase } from '../../design-system/table/util/types';

export function useEditableFileTable<T extends TableRowBase>({
  rows,
}: {
  rows: T[];
}): FileTableOptions<T> {
  const table = useDefaultTable({ rows });
  const initialState = {
    columnFilters: [{ id: 'statusLabel', value: true }],
  };

  return {
    ...table,
    enableGlobalFilter: true,
    globalFilterFn: 'includesString',
    initialState,
  };
}
