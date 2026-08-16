import type { RowSelectionState, Table } from '@tanstack/react-table';

import type { TableFeatures } from '../hooks/create-table';
import type { TableRowBase } from './types';

export function getTableSelection<T extends TableRowBase>({
  table,
  rowSelection,
}: {
  table: Table<TableFeatures, T>;
  rowSelection: RowSelectionState;
}) {
  const selectableIds: string[] = [];
  const selected = new Set<string>();
  let selectedSelectableCount = 0;

  for (const row of table.getCoreRowModel().rows) {
    const isSelected = rowSelection[row.id] === true;

    if (isSelected) {
      selected.add(row.id);
    }

    if (row.getCanSelect()) {
      selectableIds.push(row.id);
      if (isSelected) {
        selectedSelectableCount += 1;
      }
    }
  }

  const isAnySelected = selected.size > 0;
  const isAnyVisibleSelected = selectedSelectableCount > 0;
  const isEverySelected =
    selectableIds.length > 0 && selectedSelectableCount === selectableIds.length;

  return {
    selectableIds,
    selected,
    selectedIds: [...selected],
    isAnySelected,
    isAnyVisibleSelected,
    isEverySelected,
  };
}

export function toggleAllSelection<T extends TableRowBase>(table: Table<TableFeatures, T>) {
  table.setRowSelection((rowSelection) => {
    const { selectableIds, isEverySelected } = getTableSelection({ table, rowSelection });
    const next = !isEverySelected;
    const nextSelection = { ...rowSelection };

    selectableIds.forEach((id) => {
      if (next) {
        nextSelection[id] = true;
      } else {
        delete nextSelection[id];
      }
    });

    return nextSelection;
  });
}
