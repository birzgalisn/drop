export function getZipQuery(fileIds: string[]): string {
  if (fileIds.length === 0) {
    return '';
  }

  return `?${fileIds.map((id) => `fileIds=${encodeURIComponent(id)}`).join('&')}`;
}
