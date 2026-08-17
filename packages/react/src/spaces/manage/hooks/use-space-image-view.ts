import {
  useImageViewSession,
  type ImageViewItem,
  type UseImageViewResult,
} from '../../../design-system/file-table/feature/file-table';
import { useImageViewSearch } from '../../../design-system/file-table/ui/image-view-search-context';
import type { MergedSpaceFileItem } from '../../files/util/get-merged-space-files-with-uploads';
import { mergedFileThumbSrc, mergedFileViewSrc } from '../../files/util/merged-file-media';
import { spaceFileMediaUrl } from '../../files/util/space-file-media-url';

export function useSpaceImageView({
  rows,
  spaceId,
  apiBaseUrl,
}: {
  rows: MergedSpaceFileItem[];
  spaceId: string;
  apiBaseUrl: string;
}): UseImageViewResult {
  const { activeId, onActiveIdChange } = useImageViewSearch();

  const items = rows.flatMap((row) => {
    const src = mergedFileViewSrc({ item: row, spaceId, apiBaseUrl });

    if (!src) {
      return [];
    }

    return [
      {
        id: row.id,
        name: row.name,
        src,
        previewSrc: mergedFileThumbSrc({ item: row, spaceId, apiBaseUrl }),
        createdAt: row.createdAt as string | Date | null,
      },
    ];
  });

  const getDownloadHref = (item: ImageViewItem) => {
    const row = rows.find((file) => file.id === item.id);
    return row?.selectable === false
      ? null
      : spaceFileMediaUrl({
          apiBaseUrl,
          scope: 'spaces',
          scopeId: spaceId,
          fileId: item.id,
        });
  };

  return useImageViewSession({
    items,
    activeId,
    onActiveIdChange,
    getDownloadHref,
  });
}
