import { TableList } from '../../table/ui/table-list';
import type { FileTableListProps } from '../util/types';
import { FileTableListRows } from './file-table-list-rows';

export function FileTableList({ empty = null }: FileTableListProps) {
  return (
    <TableList empty={empty}>
      <FileTableListRows />
    </TableList>
  );
}
