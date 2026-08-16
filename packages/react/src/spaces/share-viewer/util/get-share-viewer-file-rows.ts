import type { SpaceFileFieldsFragment } from '../../data-access/space-fields.generated';
import { spaceFileMediaUrl } from '../../util/space-file-media-url';

export type ShareViewerFileRow = SpaceFileFieldsFragment & {
  thumbSrc: string | null;
};

export function getShareViewerFileRows({
  files,
  token,
  apiBaseUrl,
}: {
  files: SpaceFileFieldsFragment[];
  token: string;
  apiBaseUrl: string;
}): ShareViewerFileRow[] {
  return files.map((file) => ({
    ...file,
    thumbSrc: file.thumbKey
      ? spaceFileMediaUrl({
          apiBaseUrl,
          scope: 'shares',
          scopeId: token,
          fileId: file.id,
          variant: 'thumb',
        })
      : null,
  }));
}
