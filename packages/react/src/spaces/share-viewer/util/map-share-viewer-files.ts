import type { FileExplorerItem } from '../../../design-system/file-explorer/feature/file-explorer';
import type { SpaceFileFieldsFragment } from '../../data-access/space-fields.generated';

export function mapShareViewerFiles(options: {
  files: SpaceFileFieldsFragment[];
  token: string;
  apiBaseUrl: string;
}): FileExplorerItem[] {
  const { files, token, apiBaseUrl } = options;

  return files
    .filter((file) => file.status === 'READY')
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((file) => ({
      id: file.id,
      name: file.originalName,
      byteSize: file.byteSize,
      createdAt: file.createdAt ? String(file.createdAt) : null,
      thumbUrl: file.thumbKey
        ? `${apiBaseUrl}/shares/${token}/files/${file.id}?variant=thumb`
        : null,
      viewUrl: file.previewKey
        ? `${apiBaseUrl}/shares/${token}/files/${file.id}?variant=preview`
        : `${apiBaseUrl}/shares/${token}/files/${file.id}`,
      selectable: true as const,
    }));
}
