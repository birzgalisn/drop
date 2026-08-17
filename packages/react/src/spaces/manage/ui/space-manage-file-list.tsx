import { FileTable } from '../../../design-system/file-table/feature/file-table';
import { Text } from '../../../design-system/text/feature/text';
import type { MergedSpaceFileItem } from '../../files/util/get-merged-space-files-with-uploads';
import { useEditableFileTable } from '../hooks/use-editable-file-table';
import { useSpaceImageView } from '../hooks/use-space-image-view';
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
  const useImageView = ({ rows }: { rows: MergedSpaceFileItem[] }) =>
    useSpaceImageView({ rows, spaceId, apiBaseUrl });

  return (
    <FileTable
      rows={items}
      columns={spaceManageFileColumns}
      useTable={useEditableFileTable}
      useImageView={useImageView}
    >
      <FileTable.Toolbar>
        <FileTable.Toolbar.Search placeholder="Search by name" />
        <FileTable.Toolbar.Actions>
          <FileTable.Toolbar.Zip
            onZip={(fileIds) => openSpaceZip({ apiBaseUrl, spaceId, fileIds })}
          />
          <FileTable.Toolbar.Delete loading={removing} onRemove={onRemoveFiles} />
        </FileTable.Toolbar.Actions>
      </FileTable.Toolbar>
      <FileTable.List empty={<Text>No files match that name.</Text>} />
      <FileTable.ImageView />
    </FileTable>
  );
}
