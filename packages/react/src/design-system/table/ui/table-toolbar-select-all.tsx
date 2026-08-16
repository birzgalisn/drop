import { Checkbox } from '../../checkbox/feature/checkbox';
import { useTableContext } from '../hooks/create-table';
import { getTableSelection, toggleAllSelection } from '../util/table-selection';
import type { TableRowBase } from '../util/types';

export function TableToolbarSelectAll() {
  const table = useTableContext<TableRowBase>();

  if (!table.getColumn('select')) {
    return null;
  }

  return (
    <table.Subscribe
      selector={(state) => {
        const selection = getTableSelection({ table, rowSelection: state.rowSelection });
        return {
          checked: selection.isEverySelected,
          indeterminate: selection.isAnyVisibleSelected && !selection.isEverySelected,
          disabled: selection.selectableIds.length === 0,
        };
      }}
    >
      {({ checked, indeterminate, disabled }) => (
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          onChange={() => toggleAllSelection(table)}
          aria-label="Select all files"
          disabled={disabled}
        />
      )}
    </table.Subscribe>
  );
}
