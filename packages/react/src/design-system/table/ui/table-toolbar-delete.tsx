import { Button } from '@mantine/core';

import { useTableContext } from '../hooks/create-table';
import { getTableSelection } from '../util/table-selection';
import type { TableRowBase } from '../util/types';

export function TableToolbarDelete({
  loading = false,
  onRemove,
}: {
  loading?: boolean;
  onRemove: (fileIds: string[]) => void;
}) {
  const table = useTableContext<TableRowBase>();

  return (
    <table.Subscribe
      selector={(state) => getTableSelection({ table, rowSelection: state.rowSelection })}
    >
      {({ selected, selectedIds }) => (
        <TableToolbarDeleteButton
          loading={loading}
          disabled={selected.size === 0}
          onClick={() => {
            if (selected.size === 0) {
              return;
            }

            onRemove(selectedIds);
            table.resetRowSelection();
          }}
        />
      )}
    </table.Subscribe>
  );
}

function TableToolbarDeleteButton({
  loading,
  disabled,
  onClick,
}: {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="xs"
      color="red"
      variant="light"
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      aria-label="Delete selected files"
    >
      Delete
    </Button>
  );
}
