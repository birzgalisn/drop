import { Button } from '../../button/feature/button';
import { useTableContext } from '../hooks/create-table';
import { getTableSelection } from '../util/table-selection';
import type { TableRowBase } from '../util/types';

export function TableToolbarZip({ onZip }: { onZip: (fileIds: string[]) => void }) {
  const table = useTableContext<TableRowBase>();

  return (
    <table.Subscribe
      selector={(state) => getTableSelection({ table, rowSelection: state.rowSelection })}
    >
      {({ selectedIds, selectableIds, isAnySelected }) => {
        if (selectableIds.length === 0) {
          return null;
        }

        return (
          <Button
            size="xs"
            variant="subtle"
            onClick={() => onZip(isAnySelected ? selectedIds : [])}
            aria-label={isAnySelected ? 'Download selected files' : 'Download all files'}
          >
            Download
          </Button>
        );
      }}
    </table.Subscribe>
  );
}
