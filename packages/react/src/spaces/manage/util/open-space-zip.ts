import { Urls } from '../../../common/util/urls.util';

export function openSpaceZip({
  apiBaseUrl,
  spaceId,
  fileIds,
}: {
  apiBaseUrl: string;
  spaceId: string;
  fileIds: string[];
}): void {
  Urls.open({
    url: `${apiBaseUrl}/spaces/${spaceId}/zip`,
    query: { fileIds },
  });
}
