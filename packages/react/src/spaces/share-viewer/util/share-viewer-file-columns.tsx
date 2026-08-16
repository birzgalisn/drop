import { Bytes, Dates } from '@repo/shared';

import { createFileTableColumnHelper } from '../../../design-system/file-table/feature/file-table';
import { rowFilter } from '../../../design-system/table/feature/table';
import { Text } from '../../../design-system/text/feature/text';
import type { ShareViewerFileRow } from './get-share-viewer-file-rows';

const columnHelper = createFileTableColumnHelper<ShareViewerFileRow>();

export const shareViewerFileColumns = columnHelper.columns([
  columnHelper.select(),
  columnHelper.thumb({ src: (row) => row.thumbSrc }),
  columnHelper.accessor('name', {
    header: 'Name',
    enableGlobalFilter: true,
    cell: ({ getValue }) => (
      <Text variant="label" truncate>
        {getValue<string>()}
      </Text>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Added',
    meta: { fit: true },
    cell: ({ getValue }) => <Text>{Dates.format(getValue<string | Date | null>())}</Text>,
  }),
  columnHelper.accessor('byteSize', {
    header: 'Size',
    meta: { fit: true },
    cell: ({ getValue }) => <Text>{Bytes.format(getValue<number>())}</Text>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableColumnFilter: false,
    meta: { fit: true },
    filterFn: rowFilter((row) => row.status === 'READY'),
  }),
]);
