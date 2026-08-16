import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_includesString,
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type AppReactTable,
  type TableState,
} from '@tanstack/react-table';
import type { ComponentType } from 'react';

const features = tableFeatures({
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  columnMeta: { fit: false },
});

export type TableFeatures = typeof features;

export type TableLayoutState = Pick<
  TableState<TableFeatures>,
  'globalFilter' | 'columnFilters' | 'sorting' | 'columnVisibility' | 'columnSizing'
>;

export type TableInstance<T extends { id: string }> = AppReactTable<
  TableFeatures,
  T,
  TableLayoutState,
  Record<string, ComponentType>,
  Record<string, ComponentType>,
  Record<string, ComponentType>
>;

export const { createAppColumnHelper, useAppTable, useTableContext } = createTableHook({
  features,
  getRowId: (row: { id: string }) => row.id,
  defaultColumn: {
    enableGlobalFilter: false,
  },
  enableSorting: true,
  enableFilters: true,
  enableGlobalFilter: false,
});
