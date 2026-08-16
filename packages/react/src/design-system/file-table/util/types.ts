import type { ReactNode } from 'react';

import type { TableOptionsFor, TableRowBase, UseTable } from '../../table/util/types';

export type ImageViewItem = {
  id: string;
  name: string;
  src: string;
  previewSrc?: string | null;
  createdAt?: string | Date | null;
};

export type FileTableListProps = {
  empty?: ReactNode;
};

export type UseFileTable<T extends TableRowBase = TableRowBase> = UseTable<T>;

export type FileTableOptions<T extends TableRowBase = TableRowBase> = TableOptionsFor<T>;

export type UseImageView<T extends TableRowBase = TableRowBase> = (options: {
  rows: T[];
}) => UseImageViewResult;

export type UseImageViewResult = {
  active: ImageViewItem | null;
  canNavigate: boolean;
  isViewable: (id: string) => boolean;
  open: (id: string) => void;
  close: () => void;
  goPrev: () => void;
  goNext: () => void;
  getDownloadHref?: (item: ImageViewItem) => string | null;
};

export type { TableRowBase, UseTable };
