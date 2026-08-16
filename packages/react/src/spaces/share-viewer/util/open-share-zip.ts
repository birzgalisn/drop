import { getZipQuery } from '../../../common/util/build-query-string';
import { openDownload } from '../../../common/util/open-download';

export function openShareZip({
  apiBaseUrl,
  token,
  fileIds,
}: {
  apiBaseUrl: string;
  token: string;
  fileIds: string[];
}): void {
  openDownload(`${apiBaseUrl}/shares/${token}/zip${getZipQuery(fileIds)}`);
}
