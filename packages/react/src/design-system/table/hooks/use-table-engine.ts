import type { ColumnDef, TableState } from '@tanstack/react-table';

import { hasSelectColumn } from '../util/has-select-column';
import type { TableOptionsFor, TableRowBase } from '../util/types';
import { type TableFeatures, type TableLayoutState, useAppTable } from './create-table';

function selectLayoutState(state: TableState<TableFeatures>): TableLayoutState {
  return {
    globalFilter: state.globalFilter,
    columnFilters: state.columnFilters,
    sorting: state.sorting,
    columnVisibility: state.columnVisibility,
    columnSizing: state.columnSizing,
  };
}

export function useTableEngine<T extends TableRowBase>({
  rows,
  columns,
  options = {},
}: {
  rows: T[];
  columns: Array<ColumnDef<TableFeatures, T>>;
  options?: TableOptionsFor<T>;
}) {
  const { enableRowSelection: optionsEnableRowSelection, ...restOptions } = options;
  const enableRowSelection = hasSelectColumn(columns)
    ? (optionsEnableRowSelection ?? ((row) => row.original.selectable !== false))
    : false;

  return useAppTable(
    {
      ...restOptions,
      columns,
      data: rows,
      enableRowSelection,
    },
    selectLayoutState,
  );
}
