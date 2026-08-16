import { Bytes, Dates } from '@repo/shared';

import { createFileTableColumnHelper } from '../../design-system/file-table/feature/file-table';
import { rowFilter } from '../../design-system/table/feature/table';
import { Text } from '../../design-system/text/feature/text';
import type { MergedSpaceFileItem } from './get-merged-space-files-with-uploads';

const columnHelper = createFileTableColumnHelper<MergedSpaceFileItem>();

export const spaceManageFileColumns = columnHelper.columns([
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
    cell: ({ getValue }) => <Text>{Dates.format(getValue<string | Date | null>())}</Text>,
  }),
  columnHelper.accessor('byteSize', {
    header: 'Size',
    meta: { fit: true },
    cell: ({ getValue }) => <Text>{Bytes.format(getValue<number>())}</Text>,
  }),
  columnHelper.accessor('statusLabel', {
    header: 'Status',
    enableColumnFilter: false,
    meta: { fit: true },
    filterFn: rowFilter((row) => row.serverStatus !== 'REMOVED'),
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  }),
]);
