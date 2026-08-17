import {
  useImageViewSession,
  type ImageViewItem,
  type UseImageViewResult,
} from '../../../design-system/file-table/feature/file-table';
import { useImageViewSearch } from '../../../design-system/file-table/ui/image-view-search-context';
import type { SpaceFileFieldsFragment } from '../../files/data-access/space-fields.generated';
import { spaceFileMediaUrl } from '../../files/util/space-file-media-url';

export function useShareViewerImageView({
  rows,
  token,
  apiBaseUrl,
}: {
  rows: SpaceFileFieldsFragment[];
  token: string;
  apiBaseUrl: string;
}): UseImageViewResult {
  const { activeId, onActiveIdChange } = useImageViewSearch();

  const items = rows.flatMap((row) => {
    const src = spaceFileMediaUrl({
      apiBaseUrl,
      scope: 'shares',
      scopeId: token,
      fileId: row.id,
      variant: row.previewKey ? 'preview' : undefined,
    });

    return [
      {
        id: row.id,
        name: row.name,
        src,
        previewSrc: row.thumbKey
          ? spaceFileMediaUrl({
              apiBaseUrl,
              scope: 'shares',
              scopeId: token,
              fileId: row.id,
              variant: 'thumb',
            })
          : null,
        createdAt: row.createdAt as string | Date | null,
      },
    ];
  });

  const getDownloadHref = (item: ImageViewItem) =>
    spaceFileMediaUrl({
      apiBaseUrl,
      scope: 'shares',
      scopeId: token,
      fileId: item.id,
    });

  return useImageViewSession({
    items,
    activeId,
    onActiveIdChange,
    getDownloadHref,
  });
}
