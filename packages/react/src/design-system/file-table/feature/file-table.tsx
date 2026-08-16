import type { ColumnDef } from '@tanstack/react-table';
import type { ReactElement, ReactNode } from 'react';

import { Table, useDefaultTable } from '../../table/feature/table';
import type { TableFeatures } from '../../table/hooks/create-table';
import { useTableEngine } from '../../table/hooks/use-table-engine';
import { TableToolbar } from '../../table/ui/table-toolbar';
import type { TableRowBase } from '../../table/util/types';
import { useDefaultImageView } from '../hooks/use-default-image-view';
import { FileTableImageView } from '../ui/file-table-image-view';
import { FileTableList } from '../ui/file-table-list';
import { FileTableImageViewProvider } from '../ui/image-view-context';
import { FileTableImageViewSearch } from '../ui/image-view-search-context';
import type { FileTableListProps, UseFileTable, UseImageView } from '../util/types';

export type {
  FileTableListProps,
  FileTableOptions,
  ImageViewItem,
  UseFileTable,
  UseImageView,
  UseImageViewResult,
} from '../util/types';
export { createFileTableColumnHelper } from '../util/create-file-table-column-helper';
export { useDefaultImageView } from '../hooks/use-default-image-view';
export { useImageViewSession } from '../hooks/use-image-view-session';
export { useImageViewContext } from '../ui/image-view-context';
export { rowFilter, useTableEngine } from '../../table/feature/table';

export type FileTableSlots = {
  Toolbar: typeof TableToolbar;
  List: (props: FileTableListProps) => ReactElement | null;
  ImageView: typeof FileTableImageView;
};

export type FileTableProps<T extends TableRowBase> = {
  rows: T[];
  columns: Array<ColumnDef<TableFeatures, T>>;
  useTable?: UseFileTable<T>;
  useImageView?: UseImageView<T>;
  children: ReactNode | ((slots: FileTableSlots) => ReactNode);
};

const fileTableSlots = {
  Toolbar: Table.Toolbar,
  List: FileTableList,
  ImageView: FileTableImageView,
};

export function FileTable<T extends TableRowBase>({
  rows,
  columns,
  useTable = useDefaultTable as UseFileTable<T>,
  useImageView = useDefaultImageView as UseImageView<T>,
  children,
}: FileTableProps<T>) {
  const options = useTable({ rows });
  const table = useTableEngine({
    rows,
    columns,
    options,
  });
  const content = typeof children === 'function' ? children(fileTableSlots) : children;
  const visibleRows = table.getRowModel().rows.map((row) => row.original);

  return (
    <Table table={table}>
      <FileTableImageViewProvider rows={visibleRows} useImageView={useImageView}>
        {content}
      </FileTableImageViewProvider>
    </Table>
  );
}

FileTable.Toolbar = Table.Toolbar;
FileTable.Toolbar.Search = Table.Toolbar.Search;
FileTable.Toolbar.Bar = Table.Toolbar.Bar;
FileTable.Toolbar.Selection = Table.Toolbar.Selection;
FileTable.Toolbar.Actions = Table.Toolbar.Actions;
FileTable.Toolbar.Zip = Table.Toolbar.Zip;
FileTable.Toolbar.Delete = Table.Toolbar.Delete;
FileTable.List = FileTableList;
FileTable.ImageView = FileTableImageView;
FileTable.ImageView.Search = FileTableImageViewSearch;
FileTable.ImageView.Stage = FileTableImageView.Stage;
FileTable.ImageView.Prev = FileTableImageView.Prev;
FileTable.ImageView.Next = FileTableImageView.Next;
FileTable.ImageView.Close = FileTableImageView.Close;
FileTable.ImageView.Download = FileTableImageView.Download;
FileTable.ImageView.Caption = FileTableImageView.Caption;
FileTable.ImageView.Caption.Info = FileTableImageView.Caption.Info;
FileTable.ImageView.Caption.Name = FileTableImageView.Caption.Name;
FileTable.ImageView.Caption.Date = FileTableImageView.Caption.Date;
