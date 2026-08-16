export function getZipQuery(fileIds: string[]): string {
  if (fileIds.length === 0) {
    return '';
  }

  return `?${new URLSearchParams({ fileIds: fileIds.join(',') })}`;
}
