import { getZipQuery } from '../../common/util/build-query-string';
import { openDownload } from '../../common/util/open-download';

export function openSpaceZip({
  apiBaseUrl,
  spaceId,
  fileIds,
}: {
  apiBaseUrl: string;
  spaceId: string;
  fileIds: string[];
}): void {
  openDownload(`${apiBaseUrl}/spaces/${spaceId}/zip${getZipQuery(fileIds)}`);
}
