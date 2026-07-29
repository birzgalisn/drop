import { getZipQuery } from '../../common/util/build-query-string';
import { openDownload } from '../../common/util/open-download';
import {
  FileExplorer,
  type FileExplorerItem,
} from '../../design-system/file-explorer/feature/file-explorer';
import type { MergedSpaceFileItem } from '../util/get-merged-space-files-with-uploads';

export interface SpaceManageFileListProps {
  items: MergedSpaceFileItem[];
  spaceId: string;
  apiBaseUrl: string;
  removing: boolean;
  onRemoveFiles: (fileIds: string[]) => void;
  activeImageId?: string | null;
  onActiveImageIdChange?: (fileId: string | null) => void;
}

export function SpaceManageFileList({
  items,
  spaceId,
  apiBaseUrl,
  removing,
  onRemoveFiles,
  activeImageId,
  onActiveImageIdChange,
}: SpaceManageFileListProps) {
  const fileUrl = (fileId: string) => `${apiBaseUrl}/spaces/${spaceId}/files/${fileId}`;

  const explorerFiles: FileExplorerItem[] = items.map((item) => {
    const ready = item.serverStatus === 'READY' || item.upload?.status === 'success';
    const thumbsReady = Boolean(item.thumbKey);
    const thumbUrl = thumbsReady ? `${fileUrl(item.fileId)}?variant=thumb` : null;
    const blobPreview = item.upload?.previewUrl ?? null;
    // Thumbs can lag behind READY; fall back to the thumb endpoint anyway.
    const readyFallback =
      !thumbUrl && !blobPreview && ready ? `${fileUrl(item.fileId)}?variant=thumb` : null;

    return {
      id: item.fileId,
      name: item.name,
      byteSize: item.byteSize,
      createdAt: item.createdAt ? String(item.createdAt) : null,
      statusLabel: getStatusLabel(item),
      thumbUrl: thumbUrl ?? blobPreview ?? readyFallback,
      viewUrl: thumbsReady
        ? `${fileUrl(item.fileId)}?variant=preview`
        : ready
          ? fileUrl(item.fileId)
          : null,
      selectable: ready,
    };
  });

  return (
    <FileExplorer
      files={explorerFiles}
      embedded
      removing={removing}
      onZip={(fileIds) => {
        openDownload(`${apiBaseUrl}/spaces/${spaceId}/zip${getZipQuery(fileIds)}`);
      }}
      getDownloadHref={(file) => (file.selectable === false ? null : fileUrl(file.id))}
      onRemoveMany={onRemoveFiles}
      activeImageId={activeImageId}
      onActiveImageIdChange={onActiveImageIdChange}
    />
  );
}

function getStatusLabel(item: MergedSpaceFileItem): string {
  const upload = item.upload;

  if (upload?.status === 'error') {
    return 'Failed';
  }

  if (item.serverStatus === 'READY' || upload?.status === 'success') {
    return 'Ready';
  }

  if (upload && upload.bytesTotal > 0) {
    return `${Math.round((upload.bytesUploaded / upload.bytesTotal) * 100)}%`;
  }

  return item.serverStatus ?? 'Pending';
}
