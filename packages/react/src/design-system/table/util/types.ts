import type { TableOptions } from '@tanstack/react-table';

import type { TableFeatures } from '../hooks/create-table';

export type TableRowBase = {
  id: string;
  selectable?: boolean;
};

export type TableOptionsFor<T extends TableRowBase> = Omit<
  TableOptions<TableFeatures, T>,
  'columns' | 'data' | 'features'
>;

export type UseTable<T extends TableRowBase> = (options: { rows: T[] }) => TableOptionsFor<T>;
