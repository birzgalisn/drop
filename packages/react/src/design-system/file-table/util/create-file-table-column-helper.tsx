import type { ColumnDef } from '@tanstack/react-table';

import type { TableFeatures } from '../../table/hooks/create-table';
import { TableToolbarSelection } from '../../table/ui/table-toolbar-selection';
import { createTableColumnHelper } from '../../table/util/create-table-column-helper';
import type { TableRowBase } from '../../table/util/types';
import { FileTableCellSelect } from '../ui/file-table-cell-select';
import { FileTableCellThumb } from '../ui/file-table-cell-thumb';

export function createFileTableColumnHelper<T extends TableRowBase>() {
  const helper = createTableColumnHelper<T>();

  return {
    ...helper,
    select: (): ColumnDef<TableFeatures, T> =>
      helper.display({
        id: 'select',
        size: 36,
        header: () => <TableToolbarSelection />,
        cell: ({ row }) => <FileTableCellSelect row={row} />,
      }),
    thumb: ({ src }: { src: (row: T) => string | null | undefined }): ColumnDef<TableFeatures, T> =>
      helper.display({
        id: 'thumb',
        size: 56,
        header: () => null,
        cell: ({ row }) => <FileTableCellThumb src={src(row.original)} />,
      }),
  };
}
