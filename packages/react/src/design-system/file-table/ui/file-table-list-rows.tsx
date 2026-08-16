import type { Row } from '@tanstack/react-table';

import type { TableFeatures } from '../../table/hooks/create-table';
import { useTableContext } from '../../table/hooks/create-table';
import { TableTd } from '../../table/ui/table-td';
import type { TableRowBase } from '../../table/util/types';
import { FileTableRow } from './file-table-row';

export function FileTableListRows() {
  const table = useTableContext<TableRowBase>();
  const rows = table.getRowModel().rows;

  return (
    <>
      {rows.map((row) => (
        <FileTableListRow key={row.id} row={row} />
      ))}
    </>
  );
}

function FileTableListRow({ row }: { row: Row<TableFeatures, TableRowBase> }) {
  const table = useTableContext<TableRowBase>();

  return (
    <FileTableRow row={row.original}>
      {row.getVisibleCells().map((cell) => (
        <table.AppCell key={cell.id} cell={cell}>
          {(c) => (
            <TableTd fit={c.column.columnDef.meta?.fit} w={c.column.getSize()}>
              <c.FlexRender />
            </TableTd>
          )}
        </table.AppCell>
      ))}
    </FileTableRow>
  );
}
