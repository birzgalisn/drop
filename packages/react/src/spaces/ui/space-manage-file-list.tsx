import {
  FileTable,
  type UseFileTable,
  type UseImageView,
} from '../../design-system/file-table/feature/file-table';
import { Text } from '../../design-system/text/feature/text';
import { useEditableFileTable } from '../hooks/use-editable-file-table';
import { useSpaceImageView } from '../hooks/use-space-image-view';
import type { MergedSpaceFileItem } from '../util/get-merged-space-files-with-uploads';
import { openSpaceZip } from '../util/open-space-zip';
import { spaceManageFileColumns } from '../util/space-manage-file-columns';

export interface SpaceManageFileListProps {
  items: MergedSpaceFileItem[];
  spaceId: string;
  apiBaseUrl: string;
  removing: boolean;
  onRemoveFiles: (fileIds: string[]) => void;
}

export function SpaceManageFileList({
  items,
  spaceId,
  apiBaseUrl,
  removing,
  onRemoveFiles,
}: SpaceManageFileListProps) {
  const useTable: UseFileTable<MergedSpaceFileItem> = ({ rows }) => useEditableFileTable({ rows });

  const useImageView: UseImageView<MergedSpaceFileItem> = ({ rows }) =>
    useSpaceImageView({
      rows,
      spaceId,
      apiBaseUrl,
    });

  return (
    <FileTable
      rows={items}
      columns={spaceManageFileColumns}
      useTable={useTable}
      useImageView={useImageView}
    >
      {({ Toolbar, List, ImageView }) => (
        <>
          <Toolbar>
            <Toolbar.Search placeholder="Search by name" />
            <Toolbar.Actions>
              <Toolbar.Zip onZip={(fileIds) => openSpaceZip({ apiBaseUrl, spaceId, fileIds })} />
              <Toolbar.Delete loading={removing} onRemove={onRemoveFiles} />
            </Toolbar.Actions>
          </Toolbar>
          <List empty={<Text>No files match that name.</Text>} />
          <ImageView />
        </>
      )}
    </FileTable>
  );
}
