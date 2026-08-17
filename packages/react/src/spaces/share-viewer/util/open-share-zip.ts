import { Urls } from '../../../common/util/urls.util';

export function openShareZip({
  apiBaseUrl,
  token,
  fileIds,
}: {
  apiBaseUrl: string;
  token: string;
  fileIds: string[];
}): void {
  Urls.open({
    url: `${apiBaseUrl}/shares/${token}/zip`,
    query: { fileIds },
  });
}
